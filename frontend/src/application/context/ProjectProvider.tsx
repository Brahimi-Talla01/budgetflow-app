import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { ProjectProps } from "../../domain/entities/Project";
import { getErrorMessage } from "../../shared/utils/errors";
import { repositories } from "../di/container";
import { useAuth } from "./authContext";
import { ProjectContext } from "./projectContext";

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
      const { token } = useAuth();
      const [projects, setProjects] = useState<ProjectProps[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            if (!token) return;

            let cancelled = false;

            const loadProjects = async () => {
                  setLoading(true);
                  try {
                        const data = await repositories.projects.list();
                        if (cancelled) return;
                        setProjects(data);
                        setError(null);
                  } catch (err) {
                        if (cancelled) return;
                        setError(getErrorMessage(err, "Impossible de charger les projets."));
                  } finally {
                        if (!cancelled) setLoading(false);
                  }
            };

            void loadProjects();

            return () => {
                  cancelled = true;
            };
      }, [token]);

      const value = useMemo(
            () => ({ projects: token ? projects : [], loading, error }),
            [token, projects, loading, error]
      );

      return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
