import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { jobCallsApi } from '../../services/jobCallsApi';
import { JobCall } from '../../../../types';

export default function useJobCandidates(jobCallId: string) {
  const [jobCall, setJobCall] = useState<JobCall | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actingIds, setActingIds] = useState<Set<string>>(new Set());

  const fetchJob = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await jobCallsApi.findById(jobCallId);
      setJobCall(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os candidatos.');
    } finally {
      setIsLoading(false);
    }
  }, [jobCallId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const withLoading = async (matchId: string, action: () => Promise<void>) => {
    setActingIds((prev) => new Set(prev).add(matchId));
    try {
      await action();
      await fetchJob();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao processar ação.';
      Alert.alert('Erro', msg);
    } finally {
      setActingIds((prev) => {
        const next = new Set(prev);
        next.delete(matchId);
        return next;
      });
    }
  };

  const handleInterview = (candidateId: string, matchId: string) => {
    void withLoading(matchId, () => jobCallsApi.moveToInterview(jobCallId, candidateId));
  };

  const handleHire = (candidateId: string, matchId: string) => {
    Alert.alert(
      'Contratar candidato',
      'Confirma a contratação deste candidato?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => void withLoading(matchId, () => jobCallsApi.acceptCandidate(jobCallId, candidateId)),
        },
      ],
    );
  };

  const handleReject = (candidateId: string, matchId: string) => {
    Alert.alert(
      'Dispensar candidato',
      'Tem certeza que deseja dispensar este candidato?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Dispensar',
          style: 'destructive',
          onPress: () => void withLoading(matchId, () => jobCallsApi.rejectCandidate(jobCallId, candidateId)),
        },
      ],
    );
  };

  return {
    jobCall,
    candidates: jobCall?.matches ?? [],
    isLoading,
    actingIds,
    handleInterview,
    handleHire,
    handleReject,
    refresh: fetchJob,
  };
}
