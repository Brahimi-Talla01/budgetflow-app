import { useCallback, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
      CreateProjectPayload,
      UpdateProjectPayload,
} from "../../domain/entities/Project";
import { getErrorMessage } from "../../shared/utils/errors";
import { queryKeys } from "../../shared/constants/queryKeys";
import { repositories } from "../di/container";
import { useAuth } from "./authContext";
import { ProjectContext } from "./projectContext";

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
      const { isAuthenticated } = useAuth();
      const queryClient = useQueryClient();

      const projectsQuery = useQuery({
            queryKey: queryKeys.projects,
            queryFn: () => repositories.projects.list(),
            enabled: isAuthenticated,
      });

      const invalidate = () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      };

      const createMutation = useMutation({
            mutationFn: (payload: CreateProjectPayload) => repositories.projects.create(payload),
            onSuccess: invalidate,
      });

      const updateMutation = useMutation({
            mutationFn: ({ id, payload }: { id: number; payload: UpdateProjectPayload }) =>
                  repositories.projects.update(id, payload),
            onSuccess: invalidate,
      });

      const deleteMutation = useMutation({
            mutationFn: (id: number) => repositories.projects.remove(id),
            onSuccess: invalidate,
      });

      const refresh = useCallback(async () => {
            await projectsQuery.refetch();
      }, [projectsQuery]);

      const createProject = useCallback(async (payload: CreateProjectPayload) => {
            if (!isAuthenticated) return false;

            try {
                  await createMutation.mutateAsync(payload);
                  return true;
            } catch {
                  return false;
            }
      }, [isAuthenticated, createMutation]);

      const updateProject = useCallback(async (id: number, payload: UpdateProjectPayload) => {
            if (!isAuthenticated) return false;

            try {
                  await updateMutation.mutateAsync({ id, payload });
                  return true;
            } catch {
                  return false;
            }
      }, [isAuthenticated, updateMutation]);

      const deleteProject = useCallback(async (id: number) => {
            if (!isAuthenticated) return false;

            try {
                  await deleteMutation.mutateAsync(id);
                  return true;
            } catch {
                  return false;
            }
      }, [isAuthenticated, deleteMutation]);

      const errorSource = projectsQuery.error
            ?? createMutation.error
            ?? updateMutation.error
            ?? deleteMutation.error;

      const value = useMemo(
            () => ({
                  projects: isAuthenticated ? (projectsQuery.data ?? []) : [],
                  loading:
                        projectsQuery.isLoading ||
                        createMutation.isPending ||
                        updateMutation.isPending ||
                        deleteMutation.isPending,
                  error: errorSource
                        ? getErrorMessage(errorSource, "Une erreur est survenue avec les projets.")
                        : null,
                  refresh,
                  createProject,
                  updateProject,
                  deleteProject,
            }),
            [
                  isAuthenticated,
                  projectsQuery.data,
                  projectsQuery.isLoading,
                  createMutation.isPending,
                  updateMutation.isPending,
                  deleteMutation.isPending,
                  errorSource,
                  refresh,
                  createProject,
                  updateProject,
                  deleteProject,
            ]
      );

      return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
