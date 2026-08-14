import { useState, useEffect } from 'react';
import { socketService } from '../../../services/socket/socketService';

export interface IncomingInterviewCall {
  jobCallId: string;
  candidateId: string;
  interviewSessionId: string;
  jobTitle?: string | null;
  companyName?: string | null;
}

// Mesmo padrão do useDispatchNotification: reaproveita a conexão de socket
// já existente pro namespace job-calls (não abre uma nova), só escuta mais
// um evento nela.
export function useInterviewSessionCall(userId: string | undefined) {
  const [incomingCall, setIncomingCall] = useState<IncomingInterviewCall | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    void socketService.connectJobCalls().then(() => {
      if (cancelled) return;
      socketService.onInterviewSessionStarted((data: IncomingInterviewCall) => {
        setIncomingCall(data);
      });
    });

    return () => {
      cancelled = true;
      socketService.offInterviewSessionStarted();
    };
  }, [userId]);

  const dismiss = () => setIncomingCall(null);

  return { incomingCall, dismiss };
}
