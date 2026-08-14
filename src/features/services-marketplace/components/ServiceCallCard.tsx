import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ServiceCall } from '../../../types';
import { colors, spacing, radius, typography } from '../../../theme/colors';

interface ServiceCallCardProps {
  serviceCall: ServiceCall;
  isProvider?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onPress?: () => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  OPEN: { label: 'Aberto', color: colors.success, bg: colors.successSoft },
  MATCHED: { label: 'Aguardando', color: colors.warning, bg: colors.warningSoft },
  IN_PROGRESS: { label: 'Em andamento', color: colors.accent, bg: colors.accentSoft },
  COMPLETED: { label: 'Concluido', color: colors.textMuted, bg: colors.surfaceVariant },
  CANCELLED: { label: 'Cancelado', color: colors.error, bg: colors.errorSoft },
};

export default function ServiceCallCard({
  serviceCall,
  isProvider,
  onAccept,
  onReject,
  onPress,
}: ServiceCallCardProps) {
  const status = statusConfig[serviceCall.status] ?? statusConfig.OPEN;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{serviceCall.serviceType}</Text>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <Text style={styles.address}>{serviceCall.address}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {serviceCall.description}
      </Text>

      {isProvider && serviceCall.status === 'MATCHED' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectBtn} onPress={onReject} activeOpacity={0.7}>
            <Text style={styles.rejectText}>Recusar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.8}>
            <Text style={styles.acceptText}>Aceitar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  badgeText: {
    ...typography.caption,
  },
  address: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  rejectBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rejectText: {
    ...typography.label,
    color: colors.error,
  },
  acceptBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  acceptText: {
    ...typography.label,
    color: colors.textOnAccent,
  },
});
