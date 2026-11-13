/**
 * Erreur métier de base : tout ce qui remonte à la présentation doit être
 * une instance de DomainError, afin d'afficher un message compréhensible.
 */
export class DomainError extends Error {
      constructor(message: string, options?: { cause?: unknown }) {
            super(message, options);
            this.name = "DomainError";
      }
}

/** L'utilisateur n'est plus authentifié (session expirée ou token invalide). */
export class UnauthorizedError extends DomainError {
      constructor(message = "Votre session a expiré, veuillez vous reconnecter.") {
            super(message);
            this.name = "UnauthorizedError";
      }
}

/** Les données envoyées à l'API sont refusées par la validation. */
export class ValidationError extends DomainError {
      readonly details: unknown;

      constructor(message: string, details?: unknown) {
            super(message);
            this.name = "ValidationError";
            this.details = details;
      }
}

/** Erreur de transport : API injoignable, timeout, erreur 5xx. */
export class NetworkError extends DomainError {
      constructor(message = "Service indisponible, veuillez réessayer plus tard.", cause?: unknown) {
            super(message, { cause });
            this.name = "NetworkError";
      }
}
