import { useCallback, useState } from "react";
import { repositories } from "../../application/di/container";
import type { RegisterPayload } from "../../domain/repositories/IAuthRepository";
import type { User } from "../../domain/entities/User";
import { getErrorMessage } from "../../shared/utils/errors";

export type RegisterResult = { success: true; user: User } | { success: false; message: string };

export const useRegister = () => {
      const [loading, setLoading] = useState(false);

      const execute = useCallback(async (payload: RegisterPayload): Promise<RegisterResult> => {
            setLoading(true);

            try {
                  const user = await repositories.auth.register(payload);
                  return { success: true, user };
            } catch (error) {
                  return {
                        success: false,
                        message: getErrorMessage(error, "Erreur lors de l'inscription."),
                  };
            } finally {
                  setLoading(false);
            }
      }, []);

      return { execute, loading };
};
