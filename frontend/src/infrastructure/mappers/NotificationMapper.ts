import type { NotificationProps } from "../../domain/entities/Notification";
import type { NotificationDTO } from "../dtos/NotificationDTO";

export class NotificationMapper {
      static toDomain(dto: NotificationDTO): NotificationProps {
            return {
                  id: dto.notificationId,
                  title: dto.title,
                  message: dto.message,
                  link: dto.link ?? undefined,
                  isRead: dto.isRead,
                  createdAt: new Date(dto.createdAt),
                  userId: dto.userId,
            };
      }
}
