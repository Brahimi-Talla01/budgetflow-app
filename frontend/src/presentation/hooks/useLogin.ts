import { useCallback, useState } from "react";
import { repositories } from "../../application/di/container";
import type { AuthSession, LoginCredentials } from "../../domain/repositories/IAuthRepository";
import { getErrorMessage } from "../../shared/utils/errors";

export type LoginResult = ({ success: true } & AuthSession) | { success: false; message: string };

export const useLogin = () => {
      const [loading, setLoading] = useState(false);

      const execute = useCallback(async (credentials: LoginCredentials): Promise<LoginResult> => {
            setLoading(true);

            try {
                  const session = await repositories.auth.login(credentials);
                  return { success: true, ...session };
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
