import { StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  jobHeader: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.md,
  },
  jobHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  jobHeaderCompany: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  jobHeaderSalary: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    marginTop: 4,
  },
  jobHeaderDescription: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  list: {
    padding: spacing.md,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  myBubbleRow: {
    justifyContent: 'flex-end',
  },
  otherBubbleRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  myBubble: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: spacing.xs,
  },
  otherBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  myText: {
    color: colors.textOnAccent,
    fontSize: 15,
  },
  otherText: {
    color: colors.text,
    fontSize: 15,
  },
  time: {
    fontSize: 10,
    marginTop: spacing.xs,
  },
  myTime: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
  otherTime: {
    color: colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceVariant,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
  },
});
