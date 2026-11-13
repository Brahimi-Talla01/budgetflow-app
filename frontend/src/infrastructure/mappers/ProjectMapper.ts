import type { ProjectProps } from "../../domain/entities/Project";
import type { ProjectDTO } from "../dtos/ProjectDTO";

export class ProjectMapper {
      static toDomain(dto: ProjectDTO): ProjectProps {
            return {
                  id: dto.projectId,
                  name: dto.name,
                  targetAmount: dto.targetAmount,
                  color: dto.color,
                  createdAt: new Date(dto.createdAt),
                  userId: dto.userId,
            };
      }
}
