import { useState, useEffect } from 'react';
import { socketService } from '../../../services/socket/socketService';
import { useJobCallsStore } from '../store/jobCallsStore';

export interface DispatchData {
  jobCallId: string;
  title: string;
  score: number;
  aiReason: string | null;
  expiresAt: string;
  type: string;
  companyName?: string | null;
  salary?: string | null;
  salaryMax?: string | null;
  location?: string | null;
  jobWorkMode?: string | null;
}

export function useDispatchNotification(userId: string | undefined) {
  const [activeDispatch, setActiveDispatch] = useState<DispatchData | null>(null);
  const addMatch = useJobCallsStore((s) => s.addMatch);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    // connectJobCalls() awaits an async token read before the socket instance
    // is created — registering the listener synchronously right after calling
    // it (unawaited) attaches to a still-null socket and silently no-ops.
    // Wait for the connection to actually exist first.
    void socketService.connectJobCalls().then(() => {
      if (cancelled) return;
      socketService.onNewJobMatch((data: any) => {
        if (data.type === 'JOB_DISPATCH') {
          setActiveDispatch(data as DispatchData);
        }
        addMatch(data);
      });
    });

    return () => {
      cancelled = true;
      socketService.disconnectJobCalls();
    };
  }, [userId]);

  const dismiss = () => setActiveDispatch(null);

  return { activeDispatch, dismiss };
}
