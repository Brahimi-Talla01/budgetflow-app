import type { ProjectProps } from "../entities/Project";

export interface IProjectRepository {
      list(): Promise<ProjectProps[]>;
}
