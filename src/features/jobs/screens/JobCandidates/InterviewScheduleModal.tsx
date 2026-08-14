import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableOpacity, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { jobCallsApi } from '../../services/jobCallsApi';
import { interviewSessionApi, InterviewSession } from '../../../interview-session/services/interviewSessionApi';
import { InterviewScheduleState } from '../../../../types';
import { colors, spacing, radius } from '../../../../theme/colors';
import { formatScheduledAt } from '../../../../shared';

interface Props {
  visible: boolean;
  jobCallId: string;
  candidateId: string;
  candidateName: string;
  onClose: () => void;
}

function defaultProposedDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d;
}

export default function InterviewScheduleModal({ visible, jobCallId, candidateId, candidateName, onClose }: Props) {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [state, setState] = useState<InterviewScheduleState | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [formMode, setFormMode] = useState(false);
  const [pickedDate, setPickedDate] = useState<Date>(defaultProposedDate());
  const [formError, setFormError] = useState<string | null>(null);
  const [activePicker, setActivePicker] = useState<'date' | 'time' | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [data, sessionData] = await Promise.all([
        jobCallsApi.getInterviewSchedule(jobCallId, candidateId),
        interviewSessionApi.getStatus(jobCallId, candidateId),
      ]);
      setState(data);
      setSession(sessionData);
      setFormMode(!data.current);
    } catch {
      setLoadError('Não foi possível carregar o horário da entrevista.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setFormError(null);
      setPickedDate(defaultProposedDate());
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, jobCallId, candidateId]);

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    const step = activePicker;
    // Android's "default" display is a one-shot native dialog — any callback
    // (set or dismissed) means it's done. iOS's "spinner" is inline and fires
    // onChange continuously while the user scrolls, so it must stay mounted
    // until they tap "Concluído" below, or it closes after the first tick.
    if (Platform.OS === 'android') setActivePicker(null);
    if (event.type !== 'set' || !selected) return;

    const next = new Date(pickedDate);
    if (step === 'date') {
      next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    } else if (step === 'time') {
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    }
    setPickedDate(next);
  };

  const openForm = () => {
    // Reschedule/re-propose starts from the existing time as a reference
    // point, when there is one and it's still in the future, rather than
    // silently discarding it for tomorrow-9am.
    const existing = state?.current?.scheduledAt ? new Date(state.current.scheduledAt) : null;
    setPickedDate(existing && existing.getTime() > Date.now() ? existing : defaultProposedDate());
    setFormError(null);
    setFormMode(true);
  };

  const handleSubmit = async () => {
    if (pickedDate.getTime() <= Date.now()) {
      setFormError('Escolha uma data e horário no futuro.');
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      await jobCallsApi.proposeInterviewSchedule(jobCallId, candidateId, pickedDate.toISOString());
      await load();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Não foi possível enviar a proposta. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const renderBody = () => {
    if (loading) {
      return <ActivityIndicator color={colors.accent} style={{ marginVertical: spacing.xl }} />;
    }

    if (loadError) {
      return <Text style={s.errorText}>{loadError}</Text>;
    }

    if (!formMode && state?.current) {
      const isConfirmed = state.current.status === 'ACCEPTED';
      const canStartOrJoin = isConfirmed && (!session || session.status === 'WAITING' || session.status === 'ACTIVE');
      return (
        <View>
          <View style={[s.statusBox, isConfirmed ? s.statusBoxConfirmed : s.statusBoxPending]}>
            <MaterialCommunityIcons
              name={isConfirmed ? 'calendar-check' : 'calendar-clock'}
              size={20}
              color={isConfirmed ? colors.success : '#7C3AED'}
            />
            <Text style={[s.statusText, { color: isConfirmed ? colors.success : '#7C3AED' }]}>
              {isConfirmed
                ? `Entrevista confirmada para ${formatScheduledAt(state.current.scheduledAt)}`
                : `Aguardando resposta do candidato — proposto para ${formatScheduledAt(state.current.scheduledAt)}`}
            </Text>
          </View>
          {isConfirmed && session?.status === 'WAITING' && (
            <View style={[s.statusBox, s.statusBoxPending]}>
              <MaterialCommunityIcons name="video-outline" size={20} color="#7C3AED" />
              <Text style={[s.statusText, { color: '#7C3AED' }]}>Aguardando o candidato entrar na chamada.</Text>
            </View>
          )}
          {isConfirmed && session?.status === 'ACTIVE' && (
            <View style={[s.statusBox, s.statusBoxPending]}>
              <MaterialCommunityIcons name="video" size={20} color="#7C3AED" />
              <Text style={[s.statusText, { color: '#7C3AED' }]}>Entrevista em andamento.</Text>
            </View>
          )}
          {isConfirmed && session?.status === 'ENDED' && (
            <View style={s.statusBox}>
              <MaterialCommunityIcons name="check-circle-outline" size={20} color={colors.textSecondary} />
              <Text style={[s.statusText, { color: colors.textSecondary }]}>Entrevista encerrada.</Text>
            </View>
          )}
          {isConfirmed && session?.status === 'NO_SHOW' && (
            <View style={[s.statusBox, s.statusBoxDeclined]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.error} />
              <Text style={[s.statusText, { color: colors.error }]}>O candidato não entrou na chamada a tempo.</Text>
            </View>
          )}
          {canStartOrJoin && (
            <TouchableOpacity
              style={s.submitBtn}
              onPress={() => {
                onClose();
                navigation.navigate('InterviewSession', {
                  jobCallId,
                  candidateId,
                  mode: session ? 'join' : 'start',
                });
              }}
            >
              <Text style={s.submitBtnText}>{session ? 'Entrar na chamada' : 'Iniciar entrevista'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={s.secondaryBtn} onPress={openForm}>
            <Text style={s.secondaryBtnText}>{isConfirmed ? 'Remarcar' : 'Propor novo horário'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        {state?.latest?.status === 'DECLINED' && (
          <View style={[s.statusBox, s.statusBoxDeclined]}>
            <MaterialCommunityIcons name="calendar-remove" size={18} color={colors.error} />
            <Text style={[s.statusText, { color: colors.error }]}>
              Último horário recusado em {formatScheduledAt(state.latest.scheduledAt)}
            </Text>
          </View>
        )}

        {!state?.current && !state?.latest && (
          <Text style={s.emptyHint}>Nenhuma proposta de horário ainda. Defina o primeiro horário abaixo.</Text>
        )}

        <Text style={s.label}>Data e horário da entrevista</Text>
        <View style={s.pickerRow}>
          <TouchableOpacity style={s.pickerBtn} onPress={() => setActivePicker('date')}>
            <MaterialCommunityIcons name="calendar-outline" size={16} color={colors.accent} />
            <Text style={s.pickerBtnText}>{pickedDate.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.pickerBtn} onPress={() => setActivePicker('time')}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.accent} />
            <Text style={s.pickerBtnText}>
              {pickedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        {formError && <Text style={s.errorText}>{formError}</Text>}

        <TouchableOpacity style={s.submitBtn} onPress={handleSubmit} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={s.submitBtnText}>Enviar proposta</Text>
          )}
        </TouchableOpacity>

        {state?.current && (
          <TouchableOpacity style={s.secondaryBtn} onPress={() => setFormMode(false)}>
            <Text style={s.secondaryBtnText}>Cancelar</Text>
          </TouchableOpacity>
        )}

        {activePicker && (
          <View>
            <DateTimePicker
              value={pickedDate}
              mode={activePicker}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onPickerChange}
              minimumDate={activePicker === 'date' ? new Date() : undefined}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity style={s.pickerDoneBtn} onPress={() => setActivePicker(null)}>
                <Text style={s.pickerDoneBtnText}>Concluído</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.sheetHeader}>
            <View style={s.sheetTitleRow}>
              <MaterialCommunityIcons name="calendar-clock-outline" size={22} color={colors.accent} />
              <Text style={s.sheetTitle}>Entrevista com {candidateName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {renderBody()}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: '85%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sheetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1, marginRight: spacing.md },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: colors.text, flexShrink: 1 },

  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statusBoxPending: { backgroundColor: '#F5F3FF' },
  statusBoxConfirmed: { backgroundColor: colors.successSoft },
  statusBoxDeclined: { backgroundColor: colors.errorSoft },
  statusText: { flex: 1, fontSize: 13, fontWeight: '600' },

  emptyHint: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.lg, lineHeight: 18 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm },
  pickerRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  pickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  pickerBtnText: { fontSize: 14, fontWeight: '600', color: colors.accent },
  pickerDoneBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  pickerDoneBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  submitBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  secondaryBtn: { alignItems: 'center', paddingVertical: spacing.md },
  secondaryBtnText: { fontSize: 13, fontWeight: '600', color: colors.accent },

  errorText: { fontSize: 12, color: colors.error, marginBottom: spacing.md },
});
