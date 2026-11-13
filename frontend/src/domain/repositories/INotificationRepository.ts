import type { NotificationProps } from "../entities/Notification";

export interface INotificationRepository {
      list(): Promise<NotificationProps[]>;
      markAsRead(id: number): Promise<void>;
}
