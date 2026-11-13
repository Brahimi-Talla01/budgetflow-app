import { useCallback, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateIncomeDTO, IncomeProps } from "../../domain/entities/Income";
import { getErrorMessage } from "../../shared/utils/errors";
import { queryKeys } from "../../shared/constants/queryKeys";
import { repositories } from "../di/container";
import { useAuth } from "./authContext";
import { IncomeContext } from "./incomeContext";

const toUpdatePayload = (data: Partial<IncomeProps>) => ({
      amount: data.amount,
      source: data.source,
      description: data.description,
      date: data.date ? data.date.toISOString().split("T")[0] : undefined,
      projectId: data.projectId ?? null,
});

export const IncomeProvider = ({ children }: { children: ReactNode }) => {
      const { isAuthenticated } = useAuth();
      const queryClient = useQueryClient();

      const incomesQuery = useQuery({
            queryKey: queryKeys.incomes,
            queryFn: () => repositories.incomes.list(),
            enabled: isAuthenticated,
      });

      const createMutation = useMutation({
            mutationFn: (payload: CreateIncomeDTO) => repositories.incomes.create(payload),
            onSuccess: () => {
                  void queryClient.invalidateQueries({ queryKey: queryKeys.incomes });
                  void queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
            },
      });

      const updateMutation = useMutation({
            mutationFn: ({ id, payload }: { id: number; payload: ReturnType<typeof toUpdatePayload> }) =>
                  repositories.incomes.update(id, payload),
            onSuccess: () => {
                  void queryClient.invalidateQueries({ queryKey: queryKeys.incomes });
            },
      });

      const deleteMutation = useMutation({
            mutationFn: (id: number) => repositories.incomes.remove(id),
            onSuccess: () => {
                  void queryClient.invalidateQueries({ queryKey: queryKeys.incomes });
            },
      });

      const fetchIncomes = useCallback(async () => {
            await incomesQuery.refetch();
      }, [incomesQuery]);

      const createIncome = useCallback(async (data: CreateIncomeDTO): Promise<boolean> => {
            if (!isAuthenticated) return false;

            try {
                  await createMutation.mutateAsync(data);
                  return true;
            } catch {
                  return false;
            }
      }, [isAuthenticated, createMutation]);

      const updateIncome = useCallback(async (id: number, data: Partial<IncomeProps>) => {
            if (!isAuthenticated) return;

            try {
                  await updateMutation.mutateAsync({ id, payload: toUpdatePayload(data) });
            } catch {
                  // L'erreur est exposée via `error`.
            }
      }, [isAuthenticated, updateMutation]);

      const deleteIncome = useCallback(async (id: number) => {
            if (!isAuthenticated) return;

            try {
                  await deleteMutation.mutateAsync(id);
            } catch {
                  // L'erreur est exposée via `error`.
            }
      }, [isAuthenticated, deleteMutation]);

      const errorSource = incomesQuery.error
            ?? createMutation.error
            ?? updateMutation.error
            ?? deleteMutation.error;

      const value = useMemo(
            () => ({
                  incomes: isAuthenticated ? (incomesQuery.data ?? []) : [],
                  loading:
                        incomesQuery.isLoading ||
                        createMutation.isPending ||
                        updateMutation.isPending ||
                        deleteMutation.isPending,
                  error: errorSource
                        ? getErrorMessage(errorSource, "Une erreur est survenue avec les revenus.")
                        : null,
                  fetchIncomes,
                  createIncome,
                  updateIncome,
                  deleteIncome,
            }),
            [
                  isAuthenticated,
                  incomesQuery.data,
                  incomesQuery.isLoading,
                  createMutation.isPending,
                  updateMutation.isPending,
                  deleteMutation.isPending,
                  errorSource,
                  fetchIncomes,
                  createIncome,
                  updateIncome,
                  deleteIncome,
            ]
      );

      return <IncomeContext.Provider value={value}>{children}</IncomeContext.Provider>;
};
