import type { TransactionQuery } from "../../domain/entities/Transaction";

export const queryKeys = {
      transactions: (query: TransactionQuery) => ["transactions", query] as const,
      expenses: ["expenses"] as const,
      incomes: ["incomes"] as const,
      projects: ["projects"] as const,
      notifications: ["notifications"] as const,
};
