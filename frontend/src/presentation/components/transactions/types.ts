import type { TransactionType } from "../../../domain/entities/Expense";

export type TransactionTypeFilter = "all" | TransactionType;

export interface TransactionRow {
      /** Identifiant unique préfixé par le type ("expense-12", "income-3"). */
      key: string;
      type: TransactionType;
      /** Description si présente, sinon catégorie / source. */
      label: string;
      category: string;
      amount: number;
      date: Date;
      description?: string;
      projectId?: number;
}
