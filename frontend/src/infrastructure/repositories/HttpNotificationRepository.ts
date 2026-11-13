import type { AxiosInstance } from "axios";
import type { NotificationProps } from "../../domain/entities/Notification";
import type { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { ENDPOINTS } from "../api/endpoints";
import type { NotificationDTO } from "../dtos/NotificationDTO";
import { NotificationMapper } from "../mappers/NotificationMapper";

export class HttpNotificationRepository implements INotificationRepository {
      private readonly http: AxiosInstance;

      constructor(http: AxiosInstance) {
            this.http = http;
      }

      async list(): Promise<NotificationProps[]> {
            const { data } = await this.http.get<NotificationDTO[]>(ENDPOINTS.notifications.list);
            return data.map(NotificationMapper.toDomain);
      }

      async markAsRead(id: number): Promise<void> {
            await this.http.patch(ENDPOINTS.notifications.byId(id), { isRead: true });
      }
}
