import type { PaginatedTransactions, TransactionRow } from "../../domain/entities/Transaction";
import type { TransactionDTO, TransactionsResponseDTO } from "../dtos/TransactionDTO";

export class TransactionMapper {
      static toRow(dto: TransactionDTO): TransactionRow {
            return {
                  key: `${dto.type}-${dto.id}`,
                  type: dto.type,
                  label: dto.label,
                  category: dto.category,
                  amount: dto.amount,
                  date: new Date(dto.date),
                  description: dto.description ?? undefined,
                  projectId: dto.projectId ?? undefined,
            };
      }

      static toDomain(dto: TransactionsResponseDTO): PaginatedTransactions {
            return {
                  rows: dto.items.map(TransactionMapper.toRow),
                  pagination: dto.pagination,
                  summary: dto.summary,
                  categories: dto.categories,
            };
      }
}
