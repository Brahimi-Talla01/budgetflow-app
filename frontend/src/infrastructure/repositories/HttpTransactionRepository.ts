import type { AxiosInstance } from "axios";
import type { PaginatedTransactions, TransactionQuery } from "../../domain/entities/Transaction";
import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { ENDPOINTS } from "../api/endpoints";
import type { TransactionsResponseDTO } from "../dtos/TransactionDTO";
import { TransactionMapper } from "../mappers/TransactionMapper";

export class HttpTransactionRepository implements ITransactionRepository {
      private readonly http: AxiosInstance;

      constructor(http: AxiosInstance) {
            this.http = http;
      }

      async list(query: TransactionQuery): Promise<PaginatedTransactions> {
            const { data } = await this.http.get<TransactionsResponseDTO>(
                  ENDPOINTS.transactions.list,
                  {
                        params: {
                              page: query.page,
                              perPage: query.perPage,
                              type: query.type,
                              search: query.search.trim() || undefined,
                              category: query.category,
                              period: query.period,
                        },
                  }
            );

            return TransactionMapper.toDomain(data);
      }
}
