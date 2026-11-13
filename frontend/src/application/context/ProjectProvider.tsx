import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
      CreateProjectPayload,
      ProjectProps,
      UpdateProjectPayload,
} from "../../domain/entities/Project";
import { getErrorMessage } from "../../shared/utils/errors";
import { repositories } from "../di/container";
import { useAuth } from "./authContext";
import { ProjectContext } from "./projectContext";

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
      const { isAuthenticated } = useAuth();
      const [projects, setProjects] = useState<ProjectProps[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      const refresh = useCallback(async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                  const data = await repositories.projects.list();
                  setProjects(data);
                  setError(null);
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de charger les projets."));
            } finally {
                  setLoading(false);
            }
      }, [isAuthenticated]);

      const createProject = useCallback(async (payload: CreateProjectPayload) => {
            if (!isAuthenticated) return false;

            try {
                  const created = await repositories.projects.create(payload);
                  setProjects((prev) => [...prev, created]);
                  setError(null);
                  return true;
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de créer ce projet."));
                  return false;
            }
      }, [isAuthenticated]);

      const updateProject = useCallback(async (id: number, payload: UpdateProjectPayload) => {
            if (!isAuthenticated) return false;

            try {
                  const updated = await repositories.projects.update(id, payload);
                  setProjects((prev) => prev.map((project) => (project.id === id ? updated : project)));
                  setError(null);
                  return true;
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de modifier ce projet."));
                  return false;
            }
      }, [isAuthenticated]);

      const deleteProject = useCallback(async (id: number) => {
            if (!isAuthenticated) return false;

            try {
                  await repositories.projects.remove(id);
                  setProjects((prev) => prev.filter((project) => project.id !== id));
                  setError(null);
                  return true;
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de supprimer ce projet."));
                  return false;
            }
      }, [isAuthenticated]);

      useEffect(() => {
            void refresh();
      }, [refresh]);

      const value = useMemo(
            () => ({
                  projects: isAuthenticated ? projects : [],
                  loading,
                  error,
                  refresh,
                  createProject,
                  updateProject,
                  deleteProject,
            }),
            [isAuthenticated, projects, loading, error, refresh, createProject, updateProject, deleteProject]
      );

      return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
