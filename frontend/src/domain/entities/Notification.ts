export interface NotificationProps {
      id: number;
      title: string;
      message: string;
      /** Route interne liée à la notification, quand elle existe. */
      link?: string;
      isRead: boolean;
      createdAt: Date;
      userId: number;
}
