import type { User } from "../entities/User";

export interface LoginCredentials {
      email: string;
      password: string;
}

export interface RegisterPayload {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      roleId: number;
}

export interface AuthSession {
      user: User;
      token: string;
}

export interface IAuthRepository {
      login(credentials: LoginCredentials): Promise<AuthSession>;
      register(payload: RegisterPayload): Promise<User>;
}
