import type { AxiosInstance } from "axios";
import type { AuthSession, IAuthRepository, LoginCredentials, RegisterPayload } from "../../domain/repositories/IAuthRepository";
import type { LoginResponseDTO, RegisterResponseDTO } from "../dtos/AuthDTO";
import { ENDPOINTS } from "../api/endpoints";
import { UserMapper } from "../mappers/UserMapper";

export class HttpAuthRepository implements IAuthRepository {
      private readonly http: AxiosInstance;

      constructor(http: AxiosInstance) {
            this.http = http;
      }

      async login(credentials: LoginCredentials): Promise<AuthSession> {
            const { data } = await this.http.post<LoginResponseDTO>(ENDPOINTS.auth.login, credentials);

            return {
                  token: data.access_token,
                  user: UserMapper.toDomain(data.user),
            };
      }

      async register(payload: RegisterPayload) {
            const { data } = await this.http.post<RegisterResponseDTO>(ENDPOINTS.auth.register, payload);
            return UserMapper.toDomain(data.user);
      }
}
