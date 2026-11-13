import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CreateExpenseDTO, ExpenseProps } from "../../domain/entities/Expense";
import { getErrorMessage } from "../../shared/utils/errors";
import { repositories } from "../di/container";
import { useAuth } from "./authContext";
import { ExpenseContext } from "./expenseContext";

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
      const { isAuthenticated } = useAuth();
      const [expenses, setExpenses] = useState<ExpenseProps[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      const fetchExpenses = useCallback(async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                  const data = await repositories.expenses.list();
                  setExpenses(data);
                  setError(null);
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de charger les dépenses."));
            } finally {
                  setLoading(false);
            }
      }, [isAuthenticated]);

      const createExpense = useCallback(async (dto: CreateExpenseDTO): Promise<boolean> => {
            if (!isAuthenticated) return false;

            setLoading(true);
            try {
                  const created = await repositories.expenses.create(dto);
                  setExpenses((prev) => [...prev, created]);
                  setError(null);
                  return true;
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de créer cette dépense."));
                  return false;
            } finally {
                  setLoading(false);
            }
      }, [isAuthenticated]);

      const updateExpense = useCallback(async (id: number, data: Partial<ExpenseProps>) => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                  const updated = await repositories.expenses.update(id, {
                        amount: data.amount,
                        category: data.category,
                        description: data.description,
                        date: data.date?.toISOString().split("T")[0],
                        projectId: data.projectId,
                  });
                  setExpenses((prev) => prev.map((expense) => (expense.id === id ? updated : expense)));
                  setError(null);
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de modifier cette dépense."));
            } finally {
                  setLoading(false);
            }
      }, [isAuthenticated]);

      const deleteExpense = useCallback(async (id: number) => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                  await repositories.expenses.remove(id);
                  setExpenses((prev) => prev.filter((expense) => expense.id !== id));
                  setError(null);
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de supprimer cette dépense."));
            } finally {
                  setLoading(false);
            }
      }, [isAuthenticated]);

      useEffect(() => {
            void fetchExpenses();
      }, [fetchExpenses]);

      const value = useMemo(
            () => ({
                  // Aucune donnée ne doit rester visible après une déconnexion.
                  expenses: isAuthenticated ? expenses : [],
                  loading,
                  error,
                  fetchExpenses,
                  createExpense,
                  updateExpense,
                  deleteExpense,
            }),
            [isAuthenticated, expenses, loading, error, fetchExpenses, createExpense, updateExpense, deleteExpense]
      );

      return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};
