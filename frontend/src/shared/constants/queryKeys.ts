import type { TransactionQuery } from "../../domain/entities/Transaction";

export const queryKeys = {
      /** Préfixe commun pour invalider toutes les pages de transactions. */
      transactionsRoot: ["transactions"] as const,
      transactions: (query: TransactionQuery) => ["transactions", query] as const,
      expenses: ["expenses"] as const,
      incomes: ["incomes"] as const,
      projects: ["projects"] as const,
      notifications: ["notifications"] as const,
};
