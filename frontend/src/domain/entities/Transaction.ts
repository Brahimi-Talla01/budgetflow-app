import type { PeriodValue } from "../../shared/utils/dateUtils";
import type { TransactionType } from "./Expense";

export type TransactionTypeFilter = "all" | TransactionType;

/** Ligne affichée par la liste des transactions. */
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

export interface TransactionSummary {
      incomes: number;
      expenses: number;
      balance: number;
}

export interface PaginationMeta {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
      hasPrevious: boolean;
      hasNext: boolean;
}

/** Paramètres envoyés à l'API paginée : le filtrage est fait côté serveur. */
export interface TransactionQuery {
      page: number;
      perPage: number;
      type: TransactionTypeFilter;
      search: string;
      category: string;
      period: PeriodValue;
}

export interface PaginatedTransactions {
      rows: TransactionRow[];
      pagination: PaginationMeta;
      summary: TransactionSummary;
      categories: string[];
}
