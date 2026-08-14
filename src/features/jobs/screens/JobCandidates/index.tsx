import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../../auth/store/authStore';
import useJobCandidates from './useJobCandidates';
import InterviewScheduleModal from './InterviewScheduleModal';
import { colors, spacing, radius } from '../../../../theme/colors';
import { JobMatch } from '../../../../types';
import { buildRoomId } from '../../../../shared';

const STATUS_SECTIONS = [
  { status: 'ACCEPTED', label: 'Em análise', color: colors.info, bg: colors.infoSoft },
  { status: 'INTERVIEW', label: 'Em entrevista', color: '#7C3AED', bg: '#F5F3FF' },
  { status: 'HIRED', label: 'Contratados', color: colors.success, bg: colors.successSoft },
  { status: 'REJECTED', label: 'Dispensados', color: colors.textMuted, bg: colors.surfaceVariant },
];

export default function JobCandidatesScreen({ route, navigation }: any) {
  const { jobCallId } = route.params;
  const companyUser = useAuthStore((s) => s.user);
  const { jobCall, candidates, isLoading, actingIds, handleInterview, handleHire, handleReject, refresh } =
    useJobCandidates(jobCallId);
  const [scheduleModal, setScheduleModal] = React.useState<{ candidateId: string; candidateName: string } | null>(
    null,
  );

  const acceptedCount = candidates.filter((m: JobMatch) => m.status === 'ACCEPTED').length;
  const interviewCount = candidates.filter((m: JobMatch) => m.status === 'INTERVIEW').length;
  const hiredCount = candidates.filter((m: JobMatch) => m.status === 'HIRED').length;

  const openChat = (candidateId: string, candidateName: string) => {
    if (!companyUser?.id) return;
    const roomId = buildRoomId(companyUser.id, candidateId);
    navigation.navigate('Chat', { roomId, otherUserId: candidateId, otherUserName: candidateName });
  };

  const renderCandidate = (match: JobMatch, sectionStatus: string) => {
    const c = match.candidate as any;
    const name = c?.fullName || c?.email || 'Candidato';
    const area = c?.profilePF?.areaAtuacao;
    const isActing = actingIds.has(match.id);
    const canInterview = sectionStatus === 'ACCEPTED';
    const canSchedule = sectionStatus === 'INTERVIEW';
    const canHire = sectionStatus === 'INTERVIEW';
    const canReject = sectionStatus === 'ACCEPTED' || sectionStatus === 'INTERVIEW';
    const isDone = sectionStatus === 'HIRED' || sectionStatus === 'REJECTED';

    return (
      <View key={match.id} style={s.candidateCard}>
        <TouchableOpacity
          style={s.candidateHeader}
          onPress={() => navigation.navigate('TalentProfile', { userId: match.candidateId })}
          activeOpacity={0.7}
        >
          <View style={s.avatar}>
            <MaterialCommunityIcons name="account" size={22} color={colors.textSecondary} />
          </View>
          <View style={s.candidateInfo}>
            <Text style={s.candidateName}>{name}</Text>
            {area ? <Text style={s.candidateArea}>{area}</Text> : null}
          </View>
          {match.score > 0 && (
            <View style={s.scoreBadge}>
              <Text style={s.scoreText}>{match.score}%</Text>
            </View>
          )}
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {isActing ? (
          <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: spacing.sm }} />
        ) : (
          <>
            {!isDone && (
              <View style={s.actions}>
                {canInterview && (
                  <TouchableOpacity
                    style={s.btnInterview}
                    onPress={() => handleInterview(match.candidateId, match.id)}
                  >
                    <Text style={s.btnInterviewText}>Chamar entrevista</Text>
                  </TouchableOpacity>
                )}
                {canSchedule && (
                  <TouchableOpacity
                    style={s.btnInterview}
                    onPress={() => setScheduleModal({ candidateId: match.candidateId, candidateName: name })}
                  >
                    <MaterialCommunityIcons name="calendar-clock-outline" size={14} color="#7C3AED" />
                    <Text style={s.btnInterviewText}>Horário de entrevista</Text>
                  </TouchableOpacity>
                )}
                {canHire && (
                  <TouchableOpacity
                    style={s.btnHire}
                    onPress={() => handleHire(match.candidateId, match.id)}
                  >
                    <MaterialCommunityIcons name="check" size={15} color="#FFF" />
                    <Text style={s.btnHireText}>Contratar</Text>
                  </TouchableOpacity>
                )}
                {canReject && (
                  <TouchableOpacity
                    style={s.btnReject}
                    onPress={() => handleReject(match.candidateId, match.id)}
                  >
                    <Text style={s.btnRejectText}>Dispensar</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {(sectionStatus === 'INTERVIEW' || sectionStatus === 'HIRED') && (
              <TouchableOpacity style={s.chatLink} onPress={() => openChat(match.candidateId, name)}>
                <MaterialCommunityIcons name="chat-outline" size={14} color={colors.accent} />
                <Text style={s.chatLinkText}>Conversar</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const hasAnyCandidates = candidates.length > 0;

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
      >
        {/* Resumo da vaga */}
        <View style={s.jobSummary}>
          <Text style={s.jobTitle}>{jobCall?.title}</Text>
          <View style={s.statsRow}>
            {acceptedCount > 0 && (
              <View style={s.statChip}>
                <Text style={s.statText}>{acceptedCount} em análise</Text>
              </View>
            )}
            {interviewCount > 0 && (
              <View style={[s.statChip, { backgroundColor: '#F5F3FF' }]}>
                <Text style={[s.statText, { color: '#7C3AED' }]}>{interviewCount} em entrevista</Text>
              </View>
            )}
            {hiredCount > 0 && (
              <View style={[s.statChip, { backgroundColor: colors.successSoft }]}>
                <Text style={[s.statText, { color: colors.success }]}>{hiredCount} contratado(s)</Text>
              </View>
            )}
          </View>
        </View>

        {/* Seções por status */}
        {STATUS_SECTIONS.map(({ status, label, color, bg }) => {
          const group = candidates.filter((m: JobMatch) => m.status === status);
          if (group.length === 0) return null;
          return (
            <View key={status} style={s.section}>
              <View style={[s.sectionHeader, { backgroundColor: bg }]}>
                <Text style={[s.sectionTitle, { color }]}>{label}</Text>
                <Text style={[s.sectionCount, { color }]}>{group.length}</Text>
              </View>
              {group.map((match: JobMatch) => renderCandidate(match, status))}
            </View>
          );
        })}

        {!hasAnyCandidates && (
          <View style={s.empty}>
            <MaterialCommunityIcons name="account-search-outline" size={48} color={colors.textMuted} />
            <Text style={s.emptyText}>Nenhum candidato ainda</Text>
            <Text style={s.emptyHint}>
              Os candidatos aparecerão aqui quando aceitarem o convite de dispatch
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <InterviewScheduleModal
        visible={!!scheduleModal}
        jobCallId={jobCallId}
        candidateId={scheduleModal?.candidateId ?? ''}
        candidateName={scheduleModal?.candidateName ?? ''}
        onClose={() => setScheduleModal(null)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: spacing.xxxl },

  jobSummary: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    marginBottom: spacing.sm,
  },
  jobTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statChip: {
    backgroundColor: colors.infoSoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  statText: { fontSize: 12, fontWeight: '600', color: colors.info },

  section: { marginBottom: spacing.sm },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
  },
  sectionTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  sectionCount: { fontSize: 11, fontWeight: '700' },

  candidateCard: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  candidateHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  candidateInfo: { flex: 1 },
  candidateName: { fontSize: 14, fontWeight: '600', color: colors.text },
  candidateArea: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  scoreBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    marginRight: spacing.sm,
  },
  scoreText: { fontSize: 11, fontWeight: '700', color: colors.accent },

  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  btnInterview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
  },
  btnInterviewText: { fontSize: 13, fontWeight: '600', color: '#7C3AED' },
  btnHire: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.md,
    backgroundColor: colors.success,
  },
  btnHireText: { fontSize: 13, fontWeight: '600', color: '#FFF' },
  btnReject: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  btnRejectText: { fontSize: 13, fontWeight: '600', color: colors.error },
  chatLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
  chatLinkText: { fontSize: 13, color: colors.accent, fontWeight: '500' },

  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: spacing.xl },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginTop: spacing.md },
  emptyHint: { fontSize: 13, color: colors.textMuted, marginTop: 4, textAlign: 'center', lineHeight: 20 },
});
