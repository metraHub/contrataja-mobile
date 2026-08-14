import { create } from 'zustand';
import { Message, ChatRoom } from '../../../types';
import apiClient from '../../../services/api/apiClient';

interface ChatState {
  rooms: ChatRoom[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  fetchRooms: () => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  messages: [],
  isLoading: false,
  error: null,

  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/chat/rooms');
      set({ rooms: response.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erro ao carregar conversas. Tente novamente.' });
    }
  },

  fetchMessages: async (roomId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/chat/rooms/${roomId}/messages`);
      set({ messages: response.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erro ao carregar mensagens. Tente novamente.' });
    }
  },

  addMessage: (message) => {
    const current = get().messages;
    // Evitar duplicata
    if (!current.find((m) => m.id === message.id)) {
      set({ messages: [...current, message] });
    }
  },

  clearMessages: () => set({ messages: [] }),
}));
