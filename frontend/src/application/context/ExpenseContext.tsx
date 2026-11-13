import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { ExpenseService } from "../../services/expenseService";
import type { CreateExpenseDTO, ExpenseProps } from "../../domain/entities/Expense";


interface ExpenseContextType {
    expenses: ExpenseProps[];
    loading: boolean;
    error: string | null;
    fetchExpenses: () => Promise<void>;
    createExpense: (data: CreateExpenseDTO) => Promise<boolean>;
    updateExpense: (id: number, data: Partial<ExpenseProps>) => Promise<void>;
    deleteExpense: (id: number) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
      const { token } = useAuth();
      const [expenses, setExpenses] = useState<ExpenseProps[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      /** Charger toutes les dépenses */
      const fetchExpenses = async () => {
            if (!token) return;

            setLoading(true);

            try {
                  const data = await ExpenseService.getAll(token);
                  setExpenses(data);
                  console.log(data);
                  
                  setError(null);
            } catch (err: any) {
                  setError("Impossible de charger les dépenses.");
            } finally {
                  setLoading(false);
            }
      };

      /** Créer une dépense */
      const createExpense = async (dto: CreateExpenseDTO): Promise<boolean> => {
            if (!token) return false;

            setLoading(true);

            try {
                  const res = await ExpenseService.create(token, dto);

                  // Convertir la date string → Date
                  const newExpense: ExpenseProps = {
                        ...res.expense,
                        date: new Date(res.expense.date),
                        createdAt: new Date(res.expense.createdAt),
                  };

                  setExpenses(prev => [...prev, newExpense]);
                  
                  return true;

            } catch {
                  setError("Impossible de créer cette dépense.");
                  return false;

            } finally {
                  setLoading(false);
            }
      };


      /** Modifier une dépense */
      const updateExpense = async (id: number, data: Partial<ExpenseProps>) => {
            if (!token) return;

            setLoading(true);
            try {
                  const res = await ExpenseService.update(token, id, data);
                  setExpenses(prev =>
                        prev.map(exp => (exp.id === id ? res.expense : exp))
                  );
            } catch {
                  setError("Impossible de modifier cette dépense.");
            } finally {
                  setLoading(false);
            }
      };

      /** Supprimer une dépense */
      const deleteExpense = async (id: number) => {
            if (!token) return;

            setLoading(true);
            try {
                  await ExpenseService.remove(token, id);
                  setExpenses(prev => prev.filter(exp => exp.id !== id));
            } catch {
                  setError("Impossible de supprimer cette dépense.");
            } finally {
                  setLoading(false);
            }
      };

      /** Charger dès que l’utilisateur est connecté */
      useEffect(() => {
            if (token) fetchExpenses();
      }, [token]);

      return (
            <ExpenseContext.Provider
                  value={{
                        expenses,
                        loading,
                        error,
                        fetchExpenses,
                        createExpense,
                        updateExpense,
                        deleteExpense,
                  }}
            >
                  {children}
            </ExpenseContext.Provider>
      );
};

export const useExpenses = () => {
      const ctx = useContext(ExpenseContext);
      if (!ctx) throw new Error("useExpenses must be used inside ExpenseProvider");
      return ctx;
};
