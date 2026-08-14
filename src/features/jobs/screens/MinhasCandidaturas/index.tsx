import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useJobCallsStore } from '../../store/jobCallsStore';
import { useAuthStore } from '../../../auth/store/authStore';
import InterviewScheduleCard from './InterviewScheduleCard';
import { colors, spacing, radius } from '../../../../theme/colors';
import { JobMatch } from '../../../../types';

const STATUS_META: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  PENDING: {
    label: 'Convite recebido',
    icon: 'bell-ring-outline',
    color: colors.warning,
    bg: colors.warningSoft,
  },
  ACCEPTED: {
    label: 'Candidatura enviada',
    icon: 'send-check-outline',
    color: colors.info,
    bg: colors.infoSoft,
  },
  INTERVIEW: {
    label: 'Em entrevista',
    icon: 'calendar-clock-outline',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  HIRED: {
    label: 'Contratado!',
    icon: 'party-popper',
    color: colors.success,
    bg: colors.successSoft,
  },
  REJECTED: {
    label: 'Não selecionado',
    icon: 'close-circle-outline',
    color: colors.textMuted,
    bg: colors.surfaceVariant,
  },
};

export default function MinhasCandidaturasScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user);
  const { myCandidacies, isLoading, fetchMyCandidacies } = useJobCallsStore();

  useEffect(() => {
    fetchMyCandidacies();
  }, []);

  const onRefresh = useCallback(() => {
    fetchMyCandidacies();
  }, []);

  const handleOpenChat = (match: JobMatch) => {
    const companyUserId = (match.jobCall?.company as any)?.userId;
    if (!companyUserId || !user?.id) return;
    const roomId = [user.id, companyUserId].sort().join(':');
    const companyName = match.jobCall?.company?.companyName ?? 'Empresa';
    navigation.navigate('Chat', { roomId, otherUserId: companyUserId, otherUserName: companyName });
  };

  const renderItem = ({ item }: { item: JobMatch }) => {
    const meta = STATUS_META[item.status] ?? STATUS_META.REJECTED;
    const canChat = item.status === 'INTERVIEW' || item.status === 'HIRED';

    return (
      <View style={s.card}>
        <View style={s.cardHeader}>
          <View style={s.companyIcon}>
            <MaterialCommunityIcons name="domain" size={22} color={colors.accent} />
          </View>
          <View style={s.cardInfo}>
            <Text style={s.jobTitle} numberOfLines={1}>
              {item.jobCall?.title ?? 'Vaga'}
            </Text>
            <Text style={s.companyName}>{item.jobCall?.company?.companyName ?? 'Empresa'}</Text>
          </View>
          {item.score > 0 && (
            <View style={s.scoreBadge}>
              <Text style={s.scoreText}>{item.score}%</Text>
            </View>
          )}
        </View>

        <View style={[s.statusRow, { backgroundColor: meta.bg }]}>
          <MaterialCommunityIcons name={meta.icon as any} size={14} color={meta.color} />
          <Text style={[s.statusLabel, { color: meta.color }]}>{meta.label}</Text>
        </View>

        {item.status === 'INTERVIEW' && user?.id && (
          <InterviewScheduleCard jobCallId={item.jobCallId} candidateId={user.id} />
        )}

        {canChat && (
          <TouchableOpacity style={s.chatBtn} onPress={() => handleOpenChat(item)}>
            <MaterialCommunityIcons name="chat-outline" size={16} color={colors.accent} />
            <Text style={s.chatBtnText}>Conversar com empresa</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
      <FlatList
        data={myCandidacies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={myCandidacies.length === 0 ? s.emptyContainer : s.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={s.emptyInner}>
            <MaterialCommunityIcons name="briefcase-search-outline" size={56} color={colors.textMuted} />
            <Text style={s.emptyTitle}>Nenhuma candidatura ainda</Text>
            <Text style={s.emptyHint}>
              Aceite vagas que aparecerem no dispatch para acompanhar o status aqui
            </Text>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, gap: spacing.md },
  emptyContainer: { flex: 1, padding: spacing.md },
  emptyInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    elevation: 1,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  companyIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1, marginLeft: spacing.md },
  jobTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  companyName: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  scoreBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    marginLeft: spacing.sm,
  },
  scoreText: { fontSize: 12, fontWeight: '700', color: colors.accent },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    alignSelf: 'flex-start',
  },
  statusLabel: { fontSize: 12, fontWeight: '600' },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignSelf: 'flex-start',
  },
  chatBtnText: { fontSize: 13, fontWeight: '600', color: colors.accent },
});
