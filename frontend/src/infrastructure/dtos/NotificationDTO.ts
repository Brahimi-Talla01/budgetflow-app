export interface NotificationDTO {
      notificationId: number;
      title: string;
      message: string;
      link: string | null;
      isRead: boolean;
      createdAt: string;
      userId: number;
}
