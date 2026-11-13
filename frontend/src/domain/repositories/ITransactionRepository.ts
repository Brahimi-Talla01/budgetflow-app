import type { PaginatedTransactions, TransactionQuery } from "../entities/Transaction";

export interface ITransactionRepository {
      list(query: TransactionQuery): Promise<PaginatedTransactions>;
}
