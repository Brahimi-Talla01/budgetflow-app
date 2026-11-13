import type { User } from "../../domain/entities/User";
import type { UserDTO } from "../dtos/AuthDTO";

export class UserMapper {
      static toDomain(dto: UserDTO): User {
            return {
                  id: dto.userId,
                  firstname: dto.firstname,
                  lastname: dto.lastname,
                  email: dto.email,
                  isActive: dto.isActive,
                  role: dto.role ?? undefined,
                  createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
                  lastLogin: dto.lastLogin ? new Date(dto.lastLogin) : undefined,
            };
      }
}
