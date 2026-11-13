import { createContext, useContext } from "react";
import type { CreateIncomeDTO, IncomeProps, UpdateIncomeDTO } from "../../domain/entities/Income";

export interface IncomeContextType {
      incomes: IncomeProps[];
      loading: boolean;
      error: string | null;
      fetchIncomes: () => Promise<void>;
      createIncome: (data: CreateIncomeDTO) => Promise<boolean>;
      updateIncome: (id: number, data: Partial<IncomeProps>) => Promise<void>;
      deleteIncome: (id: number) => Promise<void>;
}

export const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const useIncomes = (): IncomeContextType => {
      const context = useContext(IncomeContext);

      if (!context) {
            throw new Error("useIncomes doit être utilisé à l'intérieur de <IncomeProvider>");
      }

      return context;
};

export type { UpdateIncomeDTO };
