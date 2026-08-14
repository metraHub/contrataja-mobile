import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { jobCallsApi } from '../../services/jobCallsApi';
import { interviewSessionApi, InterviewSession } from '../../../interview-session/services/interviewSessionApi';
import { InterviewScheduleState } from '../../../../types';
import { colors, spacing, radius } from '../../../../theme/colors';
import { formatScheduledAt } from '../../../../shared';

interface Props {
  jobCallId: string;
  candidateId: string;
}

export default function InterviewScheduleCard({ jobCallId, candidateId }: Props) {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [state, setState] = useState<InterviewScheduleState | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [responding, setResponding] = useState(false);

  const load = async () => {
    try {
      const [scheduleData, sessionData] = await Promise.all([
        jobCallsApi.getInterviewSchedule(jobCallId, candidateId),
        interviewSessionApi.getStatus(jobCallId, candidateId),
      ]);
      setState(scheduleData);
      setSession(sessionData);
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobCallId, candidateId]);

  const respond = async (action: 'accept' | 'decline') => {
    setResponding(true);
    try {
      if (action === 'accept') {
        await jobCallsApi.acceptInterviewSchedule(jobCallId);
      } else {
        await jobCallsApi.declineInterviewSchedule(jobCallId);
      }
      await load();
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || 'Não foi possível registrar sua resposta.');
    } finally {
      setResponding(false);
    }
  };

  const handleDecline = () => {
    Alert.alert(
      'Recusar horário',
      'Tem certeza que deseja recusar este horário de entrevista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Recusar', style: 'destructive', onPress: () => void respond('decline') },
      ],
    );
  };

  if (loading || responding) {
    return <ActivityIndicator size="small" color={colors.accent} style={s.loading} />;
  }

  if (loadError) {
    return (
      <View style={[s.box, s.boxNeutral]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.error} />
        <Text style={[s.text, { color: colors.error }]}>Não foi possível carregar o horário da entrevista</Text>
        <TouchableOpacity onPress={() => void load()}>
          <Text style={s.retryText}>Tentar de novo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!state?.current && !state?.latest) {
    return (
      <View style={[s.box, s.boxNeutral]}>
        <MaterialCommunityIcons name="calendar-clock-outline" size={16} color={colors.textSecondary} />
        <Text style={[s.text, { color: colors.textSecondary }]}>
          Aguardando a empresa definir o horário da entrevista
        </Text>
      </View>
    );
  }

  if (!state.current && state.latest?.status === 'DECLINED') {
    return (
      <View style={[s.box, s.boxNeutral]}>
        <MaterialCommunityIcons name="calendar-remove-outline" size={16} color={colors.textSecondary} />
        <Text style={[s.text, { color: colors.textSecondary }]}>
          Você recusou o último horário. Aguardando nova proposta da empresa.
        </Text>
      </View>
    );
  }

  if (state.current?.status === 'ACCEPTED') {
    const canJoin = !session || session.status === 'WAITING' || session.status === 'ACTIVE';
    return (
      <View>
        <View style={[s.box, s.boxConfirmed]}>
          <MaterialCommunityIcons name="calendar-check" size={16} color={colors.success} />
          <Text style={[s.text, { color: colors.success }]}>
            Entrevista confirmada para {formatScheduledAt(state.current.scheduledAt)}
          </Text>
        </View>
        {session?.status === 'WAITING' && (
          <View style={[s.box, s.boxPending]}>
            <MaterialCommunityIcons name="video-outline" size={16} color="#7C3AED" />
            <Text style={[s.text, { color: '#7C3AED' }]}>A empresa já está na chamada. Entre agora.</Text>
          </View>
        )}
        {session?.status === 'ACTIVE' && (
          <View style={[s.box, s.boxPending]}>
            <MaterialCommunityIcons name="video" size={16} color="#7C3AED" />
            <Text style={[s.text, { color: '#7C3AED' }]}>Chamada em andamento.</Text>
          </View>
        )}
        {session?.status === 'ENDED' && (
          <View style={[s.box, s.boxNeutral]}>
            <MaterialCommunityIcons name="check-circle-outline" size={16} color={colors.textSecondary} />
            <Text style={[s.text, { color: colors.textSecondary }]}>Entrevista concluída.</Text>
          </View>
        )}
        {session?.status === 'NO_SHOW' && (
          <View style={[s.box, s.boxNeutral]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.error} />
            <Text style={[s.text, { color: colors.error }]}>
              Você não entrou na chamada a tempo. Fale com a empresa se precisar de um novo horário.
            </Text>
          </View>
        )}
        {canJoin && (
          <TouchableOpacity
            style={s.btnAccept}
            onPress={() => navigation.navigate('InterviewSession', { jobCallId, candidateId, mode: 'join' })}
          >
            <MaterialCommunityIcons name="video" size={14} color="#FFF" />
            <Text style={s.btnAcceptText}>Entrar na chamada</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (state.current?.status === 'PROPOSED') {
    return (
      <View>
        <View style={[s.box, s.boxPending]}>
          <MaterialCommunityIcons name="calendar-clock" size={16} color="#7C3AED" />
          <Text style={[s.text, { color: '#7C3AED' }]}>
            A empresa propôs {formatScheduledAt(state.current.scheduledAt)}
          </Text>
        </View>
        <View style={s.actions}>
          <TouchableOpacity style={s.btnAccept} onPress={() => void respond('accept')}>
            <MaterialCommunityIcons name="check" size={14} color="#FFF" />
            <Text style={s.btnAcceptText}>Aceitar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnDecline} onPress={handleDecline}>
            <Text style={s.btnDeclineText}>Recusar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const s = StyleSheet.create({
  loading: { marginTop: spacing.md, alignSelf: 'flex-start' },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  boxNeutral: { backgroundColor: colors.surfaceVariant },
  boxPending: { backgroundColor: '#F5F3FF' },
  boxConfirmed: { backgroundColor: colors.successSoft },
  text: { flex: 1, fontSize: 12, fontWeight: '600' },
  retryText: { fontSize: 12, fontWeight: '700', color: colors.accent },

  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  btnAccept: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.md,
    backgroundColor: colors.success,
  },
  btnAcceptText: { fontSize: 13, fontWeight: '600', color: '#FFF' },
  btnDecline: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  btnDeclineText: { fontSize: 13, fontWeight: '600', color: colors.error },
});
