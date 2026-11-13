import { createContext, useContext } from "react";
import type {
      CreateProjectPayload,
      ProjectProps,
      UpdateProjectPayload,
} from "../../domain/entities/Project";

export interface ProjectContextType {
      projects: ProjectProps[];
      loading: boolean;
      error: string | null;
      refresh: () => Promise<void>;
      createProject: (payload: CreateProjectPayload) => Promise<boolean>;
      updateProject: (id: number, payload: UpdateProjectPayload) => Promise<boolean>;
      deleteProject: (id: number) => Promise<boolean>;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = (): ProjectContextType => {
      const context = useContext(ProjectContext);

      if (!context) {
            throw new Error("useProjects doit être utilisé à l'intérieur de <ProjectProvider>");
      }

      return context;
};
