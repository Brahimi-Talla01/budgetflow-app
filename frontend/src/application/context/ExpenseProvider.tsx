import { useCallback, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateExpenseDTO, ExpenseProps } from "../../domain/entities/Expense";
import { getErrorMessage } from "../../shared/utils/errors";
import { queryKeys } from "../../shared/constants/queryKeys";
import { repositories } from "../di/container";
import { useAuth } from "./authContext";
import { ExpenseContext } from "./expenseContext";

const toUpdatePayload = (data: Partial<ExpenseProps>): Partial<CreateExpenseDTO> => ({
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: data.date?.toISOString().split("T")[0],
      projectId: data.projectId,
});

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
      const { isAuthenticated } = useAuth();
      const queryClient = useQueryClient();

      const expensesQuery = useQuery({
            queryKey: queryKeys.expenses,
            queryFn: () => repositories.expenses.list(),
            enabled: isAuthenticated,
      });

      const invalidateNotifications = useCallback(() => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      }, [queryClient]);

      const createMutation = useMutation({
            mutationFn: (payload: CreateExpenseDTO) => repositories.expenses.create(payload),
            onSuccess: () => {
                  void queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
                  invalidateNotifications();
            },
      });

      const updateMutation = useMutation({
            mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateExpenseDTO> }) =>
                  repositories.expenses.update(id, payload),
            onSuccess: () => {
                  void queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
            },
      });

      const deleteMutation = useMutation({
            mutationFn: (id: number) => repositories.expenses.remove(id),
            onSuccess: () => {
                  void queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
            },
      });

      const fetchExpenses = useCallback(async () => {
            await expensesQuery.refetch();
      }, [expensesQuery]);

      const createExpense = useCallback(async (data: CreateExpenseDTO): Promise<boolean> => {
            if (!isAuthenticated) return false;

            try {
                  await createMutation.mutateAsync(data);
                  return true;
            } catch {
                  return false;
            }
      }, [isAuthenticated, createMutation]);

      const updateExpense = useCallback(async (id: number, data: Partial<ExpenseProps>) => {
            if (!isAuthenticated) return;

            try {
                  await updateMutation.mutateAsync({ id, payload: toUpdatePayload(data) });
            } catch {
                  // L'erreur est exposée via `error`.
            }
      }, [isAuthenticated, updateMutation]);

      const deleteExpense = useCallback(async (id: number) => {
            if (!isAuthenticated) return;

            try {
                  await deleteMutation.mutateAsync(id);
            } catch {
                  // L'erreur est exposée via `error`.
            }
      }, [isAuthenticated, deleteMutation]);

      const errorSource = expensesQuery.error
            ?? createMutation.error
            ?? updateMutation.error
            ?? deleteMutation.error;

      const value = useMemo(
            () => ({
                  expenses: isAuthenticated ? (expensesQuery.data ?? []) : [],
                  loading:
                        expensesQuery.isLoading ||
                        createMutation.isPending ||
                        updateMutation.isPending ||
                        deleteMutation.isPending,
                  error: errorSource
                        ? getErrorMessage(errorSource, "Une erreur est survenue avec les dépenses.")
                        : null,
                  fetchExpenses,
                  createExpense,
                  updateExpense,
                  deleteExpense,
            }),
            [
                  isAuthenticated,
                  expensesQuery.data,
                  expensesQuery.isLoading,
                  createMutation.isPending,
                  updateMutation.isPending,
                  deleteMutation.isPending,
                  errorSource,
                  fetchExpenses,
                  createExpense,
                  updateExpense,
                  deleteExpense,
            ]
      );

      return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};
