import { useEffect, useCallback, useState } from 'react';
import { useJobCallsStore } from '../../store/jobCallsStore';
import { useAuthStore } from '../../../auth/store/authStore';
import { socketService } from '../../../../services/socket/socketService';
import { DispatchStats } from '../../services/jobCallsApi';

export default function useHomeCompany() {
  const { user } = useAuthStore();
  const {
    companyJobCalls,
    isLoading,
    loadingIds,
    fetchCompanyJobCalls,
    updateStatus,
    deleteJobCall,
  } = useJobCallsStore();

  // Mapa de stats por vaga: { [jobCallId]: DispatchStats }
  const [dispatchStatsMap, setDispatchStatsMap] = useState<Record<string, DispatchStats>>({});

  useEffect(() => {
    fetchCompanyJobCalls();

    if (user?.id) {
      void socketService.connectJobCalls();
      socketService.onJobAccepted(() => {
        fetchCompanyJobCalls();
      });

      // Conecta ao namespace de dispatch para receber stats em tempo real
      void socketService.connectDispatch();
      socketService.onDispatchStats((stats: DispatchStats) => {
        setDispatchStatsMap((prev) => ({ ...prev, [stats.jobCallId]: stats }));
      });
    }

    return () => {
      socketService.offJobAccepted();
      socketService.disconnectJobCalls();
      socketService.disconnectDispatch();
    };
  }, []);

  // Quando a lista de vagas carrega, assiste todas as vagas abertas no dispatch
  useEffect(() => {
    if (companyJobCalls.length === 0) return;
    const openJobs = companyJobCalls.filter((j) => j.status === 'OPEN');
    openJobs.forEach((job) => socketService.watchJob(job.id));
  }, [companyJobCalls]);

  const handleRefresh = useCallback(() => {
    fetchCompanyJobCalls();
  }, []);

  return {
    companyJobCalls,
    isLoading,
    loadingIds,
    handleRefresh,
    updateStatus,
    deleteJobCall,
    dispatchStatsMap,
  };
}
