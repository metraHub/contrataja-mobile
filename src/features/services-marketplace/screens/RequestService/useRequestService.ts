import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useServiceCallsStore } from '../../store/serviceCallsStore';
import { ProfileServiceProvider } from '../../../../types';

export default function useRequestService(navigation: any) {
  const { nearbyProviders, isLoading, createServiceCall, selectProvider, setNearbyProviders } =
    useServiceCallsStore();
  const [step, setStep] = useState<'form' | 'providers'>('form');
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);

  const handleSubmit = useCallback(async (data: any) => {
    try {
      const result = await createServiceCall(data);
      setCurrentCallId(result.serviceCall.id);
      setStep('providers');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel criar a solicitacao');
    }
  }, []);

  const handleSelectProvider = useCallback(
    async (provider: ProfileServiceProvider) => {
      if (!currentCallId) return;
      try {
        await selectProvider(currentCallId, provider.id);
        Alert.alert('Sucesso', 'Prestador selecionado! Aguardando resposta.');
        navigation.goBack();
      } catch {
        Alert.alert('Erro', 'Nao foi possivel selecionar o prestador');
      }
    },
    [currentCallId],
  );

  const handleBack = useCallback(() => {
    if (step === 'providers') {
      setStep('form');
      setNearbyProviders([]);
    } else {
      navigation.goBack();
    }
  }, [step]);

  return {
    step,
    nearbyProviders,
    isLoading,
    handleSubmit,
    handleSelectProvider,
    handleBack,
  };
}
