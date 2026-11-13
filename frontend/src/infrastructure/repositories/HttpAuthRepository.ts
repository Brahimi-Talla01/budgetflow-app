import type { AxiosInstance } from "axios";
import type { User } from "../../domain/entities/User";
import type {
      IAuthRepository,
      LoginCredentials,
      RegisterPayload,
} from "../../domain/repositories/IAuthRepository";
import { ENDPOINTS } from "../api/endpoints";
import type {
      LoginResponseDTO,
      MeResponseDTO,
      RegisterResponseDTO,
} from "../dtos/AuthDTO";
import { UserMapper } from "../mappers/UserMapper";

export class HttpAuthRepository implements IAuthRepository {
      private readonly http: AxiosInstance;

      constructor(http: AxiosInstance) {
            this.http = http;
      }

      async login(credentials: LoginCredentials): Promise<User> {
            const { data } = await this.http.post<LoginResponseDTO>(
                  ENDPOINTS.auth.login,
                  credentials
            );
            return UserMapper.toDomain(data.user);
      }

      async register(payload: RegisterPayload): Promise<User> {
            const { data } = await this.http.post<RegisterResponseDTO>(
                  ENDPOINTS.auth.register,
                  payload
            );
            return UserMapper.toDomain(data.user);
      }

      async me(): Promise<User> {
            const { data } = await this.http.get<MeResponseDTO>(ENDPOINTS.auth.me, {
                  // Une absence de session est normale au démarrage : pas de redirection.
                  skipUnauthorizedHandler: true,
            });
            return UserMapper.toDomain(data.user);
      }

      async logout(): Promise<void> {
            await this.http.post(ENDPOINTS.auth.logout, undefined, {
                  skipUnauthorizedHandler: true,
            });
      }
}
