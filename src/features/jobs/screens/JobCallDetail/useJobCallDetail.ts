import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { jobCallsApi } from '../../services/jobCallsApi';
import { useJobCallsStore } from '../../store/jobCallsStore';
import { JobCall } from '../../../../types';

export default function useJobCallDetail(jobCallId: string, navigation: any) {
  const [jobCall, setJobCall] = useState<JobCall | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { acceptJobCall, rejectJobCall } = useJobCallsStore();

  useEffect(() => {
    loadJobCall();
  }, [jobCallId]);

  const loadJobCall = async () => {
    try {
      const data = await jobCallsApi.findById(jobCallId);
      setJobCall(data);
      // Registra visualização — fire-and-forget, não bloqueia a tela
      jobCallsApi.markViewed(jobCallId).catch(() => {});
    } catch {
      Alert.alert('Erro', 'Nao foi possivel carregar a vaga');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = useCallback(async () => {
    try {
      await acceptJobCall(jobCallId);
      Alert.alert('Sucesso', 'Voce aceitou a vaga! A empresa sera notificada.');
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Nao foi possivel aceitar a vaga');
    }
  }, [jobCallId]);

  const handleReject = useCallback(async () => {
    try {
      await rejectJobCall(jobCallId);
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Nao foi possivel recusar a vaga');
    }
  }, [jobCallId]);

  return { jobCall, isLoading, handleAccept, handleReject };
}
