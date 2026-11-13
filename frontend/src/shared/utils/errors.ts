import { DomainError } from "../../domain/errors/DomainErrors";

/** Récupère un message affichable à partir de n'importe quelle erreur. */
export const getErrorMessage = (error: unknown, fallback: string): string => {
      if (error instanceof DomainError) return error.message;
      if (error instanceof Error && error.message) return error.message;

      return fallback;
};
