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

export interface IAuthRepository {
      /** Ouvre la session (cookie httpOnly) et renvoie l'utilisateur connecté. */
      login(credentials: LoginCredentials): Promise<User>;
      register(payload: RegisterPayload): Promise<User>;
      /** Restaure la session courante à partir du cookie. */
      me(): Promise<User>;
      logout(): Promise<void>;
}
