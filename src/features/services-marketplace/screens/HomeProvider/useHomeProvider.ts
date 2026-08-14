import { useEffect, useCallback } from 'react';
import { useServiceCallsStore } from '../../store/serviceCallsStore';
import { useAuthStore } from '../../../auth/store/authStore';
import { socketService } from '../../../../services/socket/socketService';

export default function useHomeProvider() {
  const { user } = useAuthStore();
  const { providerCalls, isLoading, fetchProviderCalls, acceptServiceCall, rejectServiceCall } =
    useServiceCallsStore();

  useEffect(() => {
    fetchProviderCalls();

    if (user?.id) {
      void socketService.connectServiceCalls();
      socketService.onNewServiceRequest(() => {
        fetchProviderCalls();
      });
    }

    return () => {
      socketService.disconnectServiceCalls();
    };
  }, []);

  const handleAccept = useCallback(async (serviceCallId: string) => {
    try {
      await acceptServiceCall(serviceCallId);
    } catch {
      // erro tratado no store
    }
  }, []);

  const handleReject = useCallback(async (serviceCallId: string) => {
    try {
      await rejectServiceCall(serviceCallId);
    } catch {
      // erro tratado no store
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchProviderCalls();
  }, []);

  return { providerCalls, isLoading, handleAccept, handleReject, handleRefresh };
}
