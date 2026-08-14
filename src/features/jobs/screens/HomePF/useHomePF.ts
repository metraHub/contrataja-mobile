import { useEffect, useCallback } from 'react';
import { useJobCallsStore } from '../../store/jobCallsStore';

export default function useHomePF() {
  const {
    candidateMatches,
    isLoading,
    fetchCandidateMatches,
    acceptJobCall,
    rejectJobCall,
  } = useJobCallsStore();

  useEffect(() => {
    fetchCandidateMatches();
  }, []);

  const handleAccept = useCallback(async (jobCallId: string) => {
    try {
      await acceptJobCall(jobCallId);
    } catch {
      // erro tratado no store
    }
  }, []);

  const handleReject = useCallback(async (jobCallId: string) => {
    try {
      await rejectJobCall(jobCallId);
    } catch {
      // erro tratado no store
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchCandidateMatches();
  }, []);

  return {
    candidateMatches,
    isLoading,
    handleAccept,
    handleReject,
    handleRefresh,
  };
}
