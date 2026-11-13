import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { IncomeService } from "../../services/incomeService";
import type {
      IncomeProps,
      CreateIncomeDTO,
      UpdateIncomeDTO,
} from "../../domain/entities/Income";

/* Types du Context */
interface IncomeContextType {
      incomes: IncomeProps[];
      loading: boolean;
      error: string | null;
      fetchIncomes: () => Promise<void>;
      createIncome: (data: CreateIncomeDTO) => Promise<boolean>;
      updateIncome: (id: number, data: Partial<IncomeProps>) => Promise<void>;
      deleteIncome: (id: number) => Promise<void>;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

/* Provider */
export const IncomeProvider = ({
      children,
}: {
      children: React.ReactNode;
}) => {
      const { token } = useAuth();

      const [incomes, setIncomes] = useState<IncomeProps[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      /* Mapper API → Frontend */
      const mapIncomeFromApi = (income: any): IncomeProps => ({
            id: income.incomeId,
            amount: income.amount,
            source: income.source,
            description: income.description,
            date: new Date(income.date),
            createdAt: new Date(income.createdAt),
            isActive: income.isActive,
            userId: income.userId,
            projectId: income.projectId ?? undefined,
      });

      const mapIncomeToUpdateDTO = (
            data: Partial<IncomeProps>
      ): UpdateIncomeDTO => ({
            amount: data.amount,
            source: data.source,
            description: data.description,
            date: data.date ? data.date.toISOString().split("T")[0] : undefined,
            projectId: data.projectId ?? null,
      });


      /* Fetch all */
      const fetchIncomes = async () => {
            if (!token) return;

            setLoading(true);
            try {
                  const data = await IncomeService.getAll(token);
                  setIncomes(data.map(mapIncomeFromApi));
                  setError(null);
            } catch {
                  setError("Impossible de charger les revenus.");
            } finally {
                  setLoading(false);
            }
      };

      /* Create */
      const createIncome = async (
            dto: CreateIncomeDTO
      ): Promise<boolean> => {
            if (!token) return false;

            setLoading(true);
            try {
                  const res = await IncomeService.create(token, dto);
                  const newIncome = mapIncomeFromApi(res.income);

                  setIncomes((prev) => [...prev, newIncome]);
                  setError(null);
                  return true;
            } catch {
                  setError("Impossible de créer ce revenu.");
                  return false;
            } finally {
                  setLoading(false);
            }
      };

      /* Update */
      const updateIncome = async (
            id: number,
            data: Partial<IncomeProps>
      ) => {
            if (!token) return;

            setLoading(true);
            try {
                  const dto = mapIncomeToUpdateDTO(data);

                  const res = await IncomeService.update(token, id, dto);
                  const updatedIncome = mapIncomeFromApi(res.income);

                  setIncomes((prev) =>
                        prev.map((inc) => (inc.id === id ? updatedIncome : inc))
                  );
                  setError(null);
            } catch {
                  setError("Impossible de modifier ce revenu.");
            } finally {
                  setLoading(false);
            }
      };

      /* Delete */
      const deleteIncome = async (id: number) => {
            if (!token) return;

            setLoading(true);
            try {
                  await IncomeService.remove(token, id);
                  setIncomes((prev) => prev.filter((inc) => inc.id !== id));
                  setError(null);
            } catch {
                  setError("Impossible de supprimer ce revenu.");
            } finally {
                  setLoading(false);
            }
      };

      /* Auto-fetch à la connexion */
      useEffect(() => {
            if (token) fetchIncomes();
      }, [token]);

      return (
            <IncomeContext.Provider
                  value={{
                        incomes,
                        loading,
                        error,
                        fetchIncomes,
                        createIncome,
                        updateIncome,
                        deleteIncome,
                  }}
            >
                  {children}
            </IncomeContext.Provider>
      );
};

/* Hook */
export const useIncomes = () => {
      const ctx = useContext(IncomeContext);

      if (!ctx) {
            throw new Error("useIncomes must be used inside IncomeProvider");
      }
      return ctx;
};
