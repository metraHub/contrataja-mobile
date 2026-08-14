import { StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  pageTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xxl,
  },

  // Section
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
  },
  addButtonText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },

  // Cards
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    ...typography.h3,
    color: colors.text,
    fontSize: 15,
  },
  itemSubtitle: {
    ...typography.bodySmall,
    color: colors.accent,
    marginTop: 2,
  },
  itemMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  itemDesc: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 19,
  },
  deleteBtn: {
    padding: spacing.xs,
  },

  // Skills
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillChip: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  skillText: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: '500',
  },

  // Summary
  summaryText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Work disposition
  dispositionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dispositionChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dispositionChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dispositionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dispositionTextActive: {
    color: colors.textOnAccent,
  },

  // Inline form
  inlineForm: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: spacing.md,
  },
  inlineFormRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inlineFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  saveBtnText: {
    ...typography.label,
    color: colors.textOnAccent,
  },

  // Main buttons
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: colors.textOnAccent,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: spacing.xl,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutBtnText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '500',
  },

  // Info row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
