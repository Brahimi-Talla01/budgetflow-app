import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CreateIncomeDTO, IncomeProps } from "../../domain/entities/Income";
import { getErrorMessage } from "../../shared/utils/errors";
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
      const [incomes, setIncomes] = useState<IncomeProps[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      const fetchIncomes = useCallback(async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                  const data = await repositories.incomes.list();
                  setIncomes(data);
                  setError(null);
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de charger les revenus."));
            } finally {
                  setLoading(false);
            }
      }, [isAuthenticated]);

      const createIncome = useCallback(async (dto: CreateIncomeDTO): Promise<boolean> => {
            if (!isAuthenticated) return false;

            setLoading(true);
            try {
                  const created = await repositories.incomes.create(dto);
                  setIncomes((prev) => [...prev, created]);
                  setError(null);
                  return true;
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de créer ce revenu."));
                  return false;
            } finally {
                  setLoading(false);
            }
      }, [isAuthenticated]);

      const updateIncome = useCallback(async (id: number, data: Partial<IncomeProps>) => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                  const updated = await repositories.incomes.update(id, toUpdatePayload(data));
                  setIncomes((prev) => prev.map((income) => (income.id === id ? updated : income)));
                  setError(null);
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de modifier ce revenu."));
            } finally {
                  setLoading(false);
            }
      }, [isAuthenticated]);

      const deleteIncome = useCallback(async (id: number) => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                  await repositories.incomes.remove(id);
                  setIncomes((prev) => prev.filter((income) => income.id !== id));
                  setError(null);
            } catch (err) {
                  setError(getErrorMessage(err, "Impossible de supprimer ce revenu."));
            } finally {
                  setLoading(false);
            }
      }, [isAuthenticated]);

      useEffect(() => {
            void fetchIncomes();
      }, [fetchIncomes]);

      const value = useMemo(
            () => ({
                  incomes: isAuthenticated ? incomes : [],
                  loading,
                  error,
                  fetchIncomes,
                  createIncome,
                  updateIncome,
                  deleteIncome,
            }),
            [isAuthenticated, incomes, loading, error, fetchIncomes, createIncome, updateIncome, deleteIncome]
      );

      return <IncomeContext.Provider value={value}>{children}</IncomeContext.Provider>;
};
