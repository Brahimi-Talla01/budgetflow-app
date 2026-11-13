import type { CreateExpenseDTO, ExpenseProps } from "../../domain/entities/Expense";
import type { ExpenseDTO } from "../dtos/ExpenseDTO";

export class ExpenseMapper {
      // Conversion du JSON (API) vers le modèle du domaine
      static toDomain(dto: ExpenseDTO): ExpenseProps {
            return {
                  id: dto.expenseId,
                  amount: dto.amount,
                  category: dto.category,
                  description: dto.description ?? undefined,
                  date: new Date(dto.date),
                  createdAt: new Date(dto.createdAt),
                  isActive: dto.isActive,
                  userId: dto.userId,
                  projectId: dto.projectId ?? undefined,
            };
      }

      // Conversion du payload du domaine vers le corps attendu par l'API
      static toApi(payload: CreateExpenseDTO): CreateExpenseDTO {
            return {
                  amount: payload.amount,
                  category: payload.category,
                  description: payload.description,
                  date: payload.date,
                  projectId: payload.projectId,
            };
      }
}
