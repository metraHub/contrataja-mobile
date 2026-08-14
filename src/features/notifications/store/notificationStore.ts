import { create } from 'zustand';
import { Notification } from '../../../types';
import { notificationsApi } from '../services/notificationsApi';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;

  fetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const data = await notificationsApi.findAll();
      set({
        notifications: data,
        unreadCount: data.filter((n) => !n.read).length,
      });
    } catch {
      // silently fail
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      set((state) => {
        const notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        );
        return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
      });
    } catch {
      // silently fail
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch {
      // silently fail
    }
  },
}));
