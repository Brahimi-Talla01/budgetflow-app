import type { IncomeProps } from "../../domain/entities/Income";
import type { IncomeDTO } from "../dtos/IncomeDTO";

export class IncomeMapper {
      static toDomain(dto: IncomeDTO): IncomeProps {
            return {
                  id: dto.incomeId,
                  amount: dto.amount,
                  source: dto.source,
                  description: dto.description ?? undefined,
                  date: new Date(dto.date),
                  createdAt: new Date(dto.createdAt),
                  isActive: dto.isActive,
                  userId: dto.userId,
                  projectId: dto.projectId ?? undefined,
            };
      }
}
