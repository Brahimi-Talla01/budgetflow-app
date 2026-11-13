import type { AxiosInstance } from "axios";
import type { ProjectProps } from "../../domain/entities/Project";
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
}
