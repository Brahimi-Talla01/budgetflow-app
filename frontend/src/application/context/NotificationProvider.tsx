import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { NotificationProps } from "../../domain/entities/Notification";
import { getErrorMessage } from "../../shared/utils/errors";
import { repositories } from "../di/container";
import { useAuth } from "./authContext";
import { NotificationContext } from "./notificationContext";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
      const { isAuthenticated } = useAuth();
      const [notifications, setNotifications] = useState<NotificationProps[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      const refresh = useCallback(async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                  const data = await repositories.notifications.list();
                  setNotifications(data);
                  setError(null);
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de charger les notifications."));
            } finally {
                  setLoading(false);
            }
      }, [isAuthenticated]);

      const markAsRead = useCallback(async (id: number) => {
            const target = notifications.find((notification) => notification.id === id);
            if (!target || target.isRead) return;

            // Mise à jour optimiste : l'UI réagit immédiatement.
            setNotifications((prev) =>
                  prev.map((notification) =>
                        notification.id === id ? { ...notification, isRead: true } : notification
                  )
            );

            try {
                  await repositories.notifications.markAsRead(id);
            } catch (err) {
                  setNotifications((prev) =>
                        prev.map((notification) =>
                              notification.id === id ? { ...notification, isRead: false } : notification
                        )
                  );
                  setError(getErrorMessage(err, "Impossible de marquer la notification comme lue."));
            }
      }, [notifications]);

      useEffect(() => {
            void refresh();
      }, [refresh]);

      const unreadCount = useMemo(
            () => notifications.filter((notification) => !notification.isRead).length,
            [notifications]
      );

      const value = useMemo(
            () => ({
                  notifications: isAuthenticated ? notifications : [],
                  unreadCount: isAuthenticated ? unreadCount : 0,
                  loading,
                  error,
                  refresh,
                  markAsRead,
            }),
            [isAuthenticated, notifications, unreadCount, loading, error, refresh, markAsRead]
      );

      return (
            <NotificationContext.Provider value={value}>
                  {children}
            </NotificationContext.Provider>
      );
};
