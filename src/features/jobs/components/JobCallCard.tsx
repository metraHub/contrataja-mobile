import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { JobMatch } from '../../../types';
import { colors, spacing, radius, typography } from '../../../theme/colors';

interface JobCallCardProps {
  match: JobMatch;
  onAccept: () => void;
  onReject: () => void;
  onPress: () => void;
}

export default function JobCallCard({ match, onAccept, onReject, onPress }: JobCallCardProps) {
  const jobCall = match.jobCall;
  if (!jobCall) return null;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.title} numberOfLines={1}>{jobCall.title}</Text>
          <Text style={styles.company}>{jobCall.company?.companyName}</Text>
        </View>
        {match.isYoungTalent && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Jovem Talento</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {jobCall.description}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.rejectBtn} onPress={onReject} activeOpacity={0.7}>
          <MaterialCommunityIcons name="close" size={18} color={colors.error} />
          <Text style={styles.rejectText}>Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.8}>
          <MaterialCommunityIcons name="check" size={18} color={colors.textOnAccent} />
          <Text style={styles.acceptText}>Aceitar</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleArea: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  company: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.infoSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.info,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  acceptText: {
    ...typography.label,
    color: colors.textOnAccent,
  },
});
