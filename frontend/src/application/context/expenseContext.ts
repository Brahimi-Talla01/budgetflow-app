import { createContext, useContext } from "react";
import type { CreateExpenseDTO, ExpenseProps } from "../../domain/entities/Expense";

export interface ExpenseContextType {
      expenses: ExpenseProps[];
      loading: boolean;
      error: string | null;
      fetchExpenses: () => Promise<void>;
      createExpense: (data: CreateExpenseDTO) => Promise<boolean>;
      updateExpense: (id: number, data: Partial<ExpenseProps>) => Promise<void>;
      deleteExpense: (id: number) => Promise<void>;
}

export const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = (): ExpenseContextType => {
      const context = useContext(ExpenseContext);

      if (!context) {
            throw new Error("useExpenses doit être utilisé à l'intérieur de <ExpenseProvider>");
      }

      return context;
};
