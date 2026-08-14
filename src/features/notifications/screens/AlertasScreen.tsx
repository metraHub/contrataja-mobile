import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../../theme/colors';
import { useNotificationStore } from '../store/notificationStore';
import { Notification } from '../../../types';

// ─── Mapeamento de tipo de notificação → visual ───────────────────────────────

type IconConfig = { icon: string; color: string; bg: string };

const TYPE_CONFIG: Record<string, IconConfig> = {
  CANDIDACY_ACCEPTED: { icon: 'briefcase-check',      color: colors.success,       bg: colors.successSoft },
  CANDIDACY_REJECTED: { icon: 'briefcase-remove',     color: colors.error,         bg: colors.errorSoft },
  NEW_MESSAGE:        { icon: 'chat-outline',          color: colors.info,          bg: colors.infoSoft },
  SERVICE_MATCH:      { icon: 'briefcase-search',      color: colors.warning,       bg: colors.warningSoft },
  SERVICE_COMPLETED:  { icon: 'check-circle-outline',  color: colors.success,       bg: colors.successSoft },
  INTERVIEW_PROPOSED: { icon: 'calendar-clock',         color: '#7C3AED',            bg: '#F5F3FF' },
  INTERVIEW_SESSION_STARTED: { icon: 'phone-in-talk',   color: colors.accent,        bg: colors.accentSoft },
  SYSTEM:             { icon: 'information-outline',   color: colors.textSecondary, bg: colors.surfaceVariant },
};

const FALLBACK_CONFIG: IconConfig = {
  icon: 'bell-outline',
  color: colors.accent,
  bg: colors.accentSoft,
};

function getConfig(type: string): IconConfig {
  return TYPE_CONFIG[type] ?? FALLBACK_CONFIG;
}

// ─── Formatação de data ───────────────────────────────────────────────────────

function groupLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
}

function timeLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

function groupByDate(notifications: Notification[]): Record<string, Notification[]> {
  return notifications.reduce<Record<string, Notification[]>>((acc, n) => {
    const label = groupLabel(n.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(n);
    return acc;
  }, {});
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AlertasScreen() {
  const { notifications, unreadCount, loading, fetch, markAsRead, markAllAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetch();
  }, []);

  const handleRefresh = useCallback(() => {
    fetch();
  }, [fetch]);

  const grouped = groupByDate(notifications);
  const dateGroups = Object.entries(grouped);

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* ── Header ── */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Alertas</Text>
          {unreadCount > 0 && (
            <Text style={s.headerSubtitle}>
              {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.7}>
            <Text style={s.markAllRead}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Loading inicial ── */}
      {loading && notifications.length === 0 ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={s.loadingText}>Carregando alertas...</Text>
        </View>
      ) : notifications.length === 0 ? (
        /* ── Estado vazio ── */
        <View style={s.centered}>
          <MaterialCommunityIcons name="bell-off-outline" size={56} color={colors.textMuted} />
          <Text style={s.emptyTitle}>Nenhum alerta</Text>
          <Text style={s.emptySubtitle}>
            Você será notificado sobre vagas, serviços e atualizações aqui.
          </Text>
        </View>
      ) : (
        /* ── Lista agrupada ── */
        <ScrollView
          style={s.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[colors.accent]}
              tintColor={colors.accent}
            />
          }
        >
          {dateGroups.map(([date, items]) => (
            <View key={date}>
              <Text style={s.dateHeader}>{date}</Text>

              {items.map((notif) => {
                const config = getConfig(notif.type);
                return (
                  <TouchableOpacity
                    key={notif.id}
                    style={[s.notifCard, !notif.read && s.notifCardUnread]}
                    onPress={() => !notif.read && markAsRead(notif.id)}
                    activeOpacity={notif.read ? 1 : 0.75}
                  >
                    {!notif.read && <View style={s.unreadDot} />}

                    <View style={[s.notifIcon, { backgroundColor: config.bg }]}>
                      <MaterialCommunityIcons
                        name={config.icon as any}
                        size={22}
                        color={config.color}
                      />
                    </View>

                    <View style={s.notifBody}>
                      <View style={s.notifHeaderRow}>
                        <Text
                          style={[s.notifTitle, !notif.read && s.notifTitleUnread]}
                          numberOfLines={1}
                        >
                          {notif.title}
                        </Text>
                        <Text style={s.notifTime}>{timeLabel(notif.createdAt)}</Text>
                      </View>
                      <Text style={s.notifMessage}>{notif.message}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  markAllRead: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    gap: spacing.md,
  },
  loadingText: { ...typography.bodySmall, color: colors.textMuted },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  list: { flex: 1 },

  dateHeader: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },

  notifCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
    padding: spacing.lg,
    elevation: 1,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  unreadDot: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  notifBody: { flex: 1 },
  notifHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notifTitle: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.text },
  notifTitleUnread: { fontWeight: '700' },
  notifTime: { fontSize: 11, color: colors.textMuted },
  notifMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 19,
  },
});
