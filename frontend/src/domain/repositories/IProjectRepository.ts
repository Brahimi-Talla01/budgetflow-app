import type {
      CreateProjectPayload,
      ProjectProps,
      UpdateProjectPayload,
} from "../entities/Project";

export interface IProjectRepository {
      list(): Promise<ProjectProps[]>;
      create(payload: CreateProjectPayload): Promise<ProjectProps>;
      update(id: number, payload: UpdateProjectPayload): Promise<ProjectProps>;
      remove(id: number): Promise<void>;
}
