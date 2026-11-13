import { Expense, type CreateExpenseProps } from "../../domain/entities/Expense";
import type { ExpenseDTO } from "../dtos/ExpenseDTO";

export class ExpenseMapper {
      // Conversion du JSON (API) vers l'Entité (Domaine)
      static toDomain(dto: ExpenseDTO): Expense {
            return new Expense({
                  id: dto.expenseId,
                  amount: dto.amount,
                  category: dto.category,
                  description: dto.description || undefined, 
                  date: new Date(dto.date),         
                  createdAt: new Date(dto.createdAt),
                  isActive: dto.isActive,
                  userId: dto.userId,
                  projectId: dto.projectId || undefined,
            });
      }

      // Conversion de l'Entité (Domaine) vers le JSON (API) pour l'envoi
      static toApi(expense: CreateExpenseProps): any {
            return {
                  amount: expense.amount,
                  category: expense.category,
                  description: expense.description,
                  date: expense.date.toISOString().split('T')[0], 
                  userId: expense.userId,
                  projectId: expense.projectId
            };
      }
}