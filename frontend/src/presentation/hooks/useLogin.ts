import { useCallback, useState } from "react";
import type { User } from "../../domain/entities/User";
import type { LoginCredentials } from "../../domain/repositories/IAuthRepository";
import { repositories } from "../../application/di/container";
import { getErrorMessage } from "../../shared/utils/errors";

export type LoginResult = { success: true; user: User } | { success: false; message: string };

export const useLogin = () => {
      const [loading, setLoading] = useState(false);

      const execute = useCallback(async (credentials: LoginCredentials): Promise<LoginResult> => {
            setLoading(true);

            try {
                  const user = await repositories.auth.login(credentials);
                  return { success: true, user };
            } catch (error) {
                  return {
                        success: false,
                        message: getErrorMessage(error, "Email ou mot de passe incorrect."),
                  };
            } finally {
                  setLoading(false);
            }
      }, []);

      return { execute, loading };
};
