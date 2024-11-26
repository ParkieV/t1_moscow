import {create} from "zustand";

interface Notification {
  message: string;
  id: number;
  error: string;
  remove: () => void;
  setError: (err: string) => void;
  animation: boolean;
  fade: () => void;
}

interface NotificationsStore {
  notifications: Notification[];
  notify: (message: string) => Notification;
}

export const useNotifications = create<NotificationsStore>((set) => ({
  notifications: [],
  notify: (message: string) => {
    const id = Date.now();
    const newNotification: Notification = {
      message,
      id,
      error: '',
      remove: () => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      setError: (err: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) => n.id === id ? {...n, error: err} : n),
        }));
      },
      animation: false,
      fade: () => {
        setTimeout(()=>set((state) => ({
          notifications: state.notifications.map((n) => n.id === id ? {...n, animation: true} : n),
        })), 500);
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        }, 1000);
      }

    }
    set((state) => ({
      notifications: [
        ...state.notifications,
        newNotification
      ],
    }));
    return newNotification;
  },
}));