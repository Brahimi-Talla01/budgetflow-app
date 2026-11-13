import { useCallback, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationProps } from "../../domain/entities/Notification";
import { getErrorMessage } from "../../shared/utils/errors";
import { queryKeys } from "../../shared/constants/queryKeys";
import { repositories } from "../di/container";
import { useAuth } from "./authContext";
import { NotificationContext } from "./notificationContext";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
      const { isAuthenticated } = useAuth();
      const queryClient = useQueryClient();

      const notificationsQuery = useQuery({
            queryKey: queryKeys.notifications,
            queryFn: () => repositories.notifications.list(),
            enabled: isAuthenticated,
      });

      const markAsReadMutation = useMutation({
            mutationFn: (id: number) => repositories.notifications.markAsRead(id),
            onMutate: async (id: number) => {
                  await queryClient.cancelQueries({ queryKey: queryKeys.notifications });

                  const previous = queryClient.getQueryData<NotificationProps[]>(queryKeys.notifications);
                  queryClient.setQueryData<NotificationProps[]>(queryKeys.notifications, (current = []) =>
                        current.map((notification) =>
                              notification.id === id ? { ...notification, isRead: true } : notification
                        )
                  );

                  return { previous };
            },
            onError: (_error, _id, context) => {
                  if (context?.previous) {
                        queryClient.setQueryData(queryKeys.notifications, context.previous);
                  }
            },
            onSettled: () => {
                  void queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
            },
      });

      const refresh = useCallback(async () => {
            await notificationsQuery.refetch();
      }, [notificationsQuery]);

      const markAsRead = useCallback(async (id: number) => {
            if (!isAuthenticated) return;

            try {
                  await markAsReadMutation.mutateAsync(id);
            } catch {
                  // L'erreur est exposée via `error`.
            }
      }, [isAuthenticated, markAsReadMutation]);

      const notifications = useMemo(
            () => (isAuthenticated ? (notificationsQuery.data ?? []) : []),
            [isAuthenticated, notificationsQuery.data]
      );
      const unreadCount = notifications.filter((notification) => !notification.isRead).length;
      const errorSource = notificationsQuery.error ?? markAsReadMutation.error;

      const value = useMemo(
            () => ({
                  notifications,
                  unreadCount,
                  loading: notificationsQuery.isLoading,
                  error: errorSource
                        ? getErrorMessage(errorSource, "Une erreur est survenue avec les notifications.")
                        : null,
                  refresh,
                  markAsRead,
            }),
            [notifications, unreadCount, notificationsQuery.isLoading, errorSource, refresh, markAsRead]
      );

      return (
            <NotificationContext.Provider value={value}>
                  {children}
            </NotificationContext.Provider>
      );
};
