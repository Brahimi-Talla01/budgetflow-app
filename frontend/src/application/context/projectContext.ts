import { createContext, useContext } from "react";
import type { ProjectProps } from "../../domain/entities/Project";

export interface ProjectContextType {
      projects: ProjectProps[];
      loading: boolean;
      error: string | null;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = (): ProjectContextType => {
      const context = useContext(ProjectContext);

      if (!context) {
            throw new Error("useProjects doit être utilisé à l'intérieur de <ProjectProvider>");
      }

      return context;
};
