import { createContext, useContext } from "react";
import type { NotificationProps } from "../../domain/entities/Notification";

export interface NotificationContextType {
      notifications: NotificationProps[];
      unreadCount: number;
      loading: boolean;
      error: string | null;
      refresh: () => Promise<void>;
      markAsRead: (id: number) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
      const context = useContext(NotificationContext);

      if (!context) {
            throw new Error("useNotifications doit être utilisé à l'intérieur de <NotificationProvider>");
      }

      return context;
};
