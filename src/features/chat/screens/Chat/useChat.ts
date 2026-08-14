import { useEffect, useCallback, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../../auth/store/authStore';
import { socketService } from '../../services/socketService';
import { jobCallsApi } from '../../../jobs/services/jobCallsApi';
import { JobCall } from '../../../../types';

export default function useChat(roomId: string, jobCallId?: string) {
  const { user } = useAuthStore();
  const { messages, isLoading, fetchMessages, addMessage, clearMessages } = useChatStore();
  const flatListRef = useRef<FlatList>(null);
  const [jobCall, setJobCall] = useState<JobCall | null>(null);

  // Cabeçalho fixo com os dados da vaga — só quando o chat foi aberto a
  // partir de uma chamada de vaga aceita (jobCallId presente)
  useEffect(() => {
    if (!jobCallId) {
      setJobCall(null);
      return;
    }
    jobCallsApi
      .findById(jobCallId)
      .then(setJobCall)
      .catch(() => setJobCall(null));
  }, [jobCallId]);

  useEffect(() => {
    fetchMessages(roomId);
    let cancelled = false;

    // connectChat() awaits an async token read before the socket instance
    // exists — registering the listener synchronously right after calling it
    // (unawaited) attaches to a still-null socket and silently no-ops.
    // Wait for the connection to actually exist first.
    void socketService.connectChat().then(() => {
      if (cancelled) return;
      socketService.joinChatRoom(roomId);
      socketService.onNewMessage((message) => {
        addMessage(message);
      });
    });

    return () => {
      cancelled = true;
      socketService.offNewMessage();
      socketService.leaveChatRoom(roomId);
      clearMessages();
    };
  }, [roomId]);

  const handleSend = useCallback(
    (content: string) => {
      if (!content.trim() || !user) return;
      // senderId vem do JWT no backend; receiverId extraído do roomId
      const receiverId = roomId.split(':').find((id) => id !== user.id) ?? '';
      socketService.sendMessage(receiverId, roomId, content.trim());
    },
    [user, roomId],
  );

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  return {
    messages,
    isLoading,
    currentUserId: user?.id ?? '',
    flatListRef,
    handleSend,
    scrollToBottom,
    jobCall,
  };
}
