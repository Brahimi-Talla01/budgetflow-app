import type { User } from "../../domain/entities/User";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

const isAvailable = (): boolean => typeof window !== "undefined" && !!window.localStorage;

export const tokenStorage = {
      getToken(): string | null {
            if (!isAvailable()) return null;
            return window.localStorage.getItem(TOKEN_KEY);
      },

      setToken(token: string): void {
            if (!isAvailable()) return;
            window.localStorage.setItem(TOKEN_KEY, token);
      },

      getUser(): User | null {
            if (!isAvailable()) return null;
            const rawUser = window.localStorage.getItem(USER_KEY);
            if (!rawUser) return null;

            try {
                  return JSON.parse(rawUser) as User;
            } catch {
                  window.localStorage.removeItem(USER_KEY);
                  return null;
            }
      },

      setUser(user: User): void {
            if (!isAvailable()) return;
            window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      },

      clearSession(): void {
            if (!isAvailable()) return;
            window.localStorage.removeItem(TOKEN_KEY);
            window.localStorage.removeItem(USER_KEY);
      },
};
