import type { AxiosInstance } from "axios";
import type {
      CreateProjectPayload,
      ProjectProps,
      UpdateProjectPayload,
} from "../../domain/entities/Project";
import type { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ENDPOINTS } from "../api/endpoints";
import type { ProjectDTO } from "../dtos/ProjectDTO";
import { ProjectMapper } from "../mappers/ProjectMapper";

export class HttpProjectRepository implements IProjectRepository {
      private readonly http: AxiosInstance;

      constructor(http: AxiosInstance) {
            this.http = http;
      }

      async list(): Promise<ProjectProps[]> {
            const { data } = await this.http.get<ProjectDTO[]>(ENDPOINTS.projects.list);
            return data.map(ProjectMapper.toDomain);
      }

      async create(payload: CreateProjectPayload): Promise<ProjectProps> {
            const { data } = await this.http.post<ProjectDTO>(ENDPOINTS.projects.list, payload);
            return ProjectMapper.toDomain(data);
      }

      async update(id: number, payload: UpdateProjectPayload): Promise<ProjectProps> {
            const { data } = await this.http.put<ProjectDTO>(ENDPOINTS.projects.byId(id), payload);
            return ProjectMapper.toDomain(data);
      }

      async remove(id: number): Promise<void> {
            await this.http.delete(ENDPOINTS.projects.byId(id));
      }
}
