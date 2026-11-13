import axios, { AxiosError, type AxiosInstance } from "axios";
import { NetworkError, UnauthorizedError, ValidationError, DomainError } from "../../domain/errors/DomainErrors";
import { tokenStorage } from "../storage/TokenStorageService";
import { API_BASE_URL } from "./endpoints";

interface ApiErrorBody {
      message?: string;
      errors?: Record<string, string[] | string>;
}

/** Erreur HTTP normalisée, directement affichable par la présentation. */
export class ApiError extends DomainError {
      readonly status?: number;
      readonly details?: unknown;

      constructor(message: string, status?: number, details?: unknown) {
            super(message);
            this.name = "ApiError";
            this.status = status;
            this.details = details;
      }
}

const DEFAULT_MESSAGES: Record<number, string> = {
      400: "Les données envoyées sont invalides.",
      401: "Votre session a expiré, veuillez vous reconnecter.",
      403: "Vous n'avez pas les droits pour effectuer cette action.",
      404: "La ressource demandée est introuvable.",
      409: "Cette ressource existe déjà.",
      500: "Une erreur interne est survenue, veuillez réessayer.",
};

const firstValidationMessage = (errors: ApiErrorBody["errors"]): string | null => {
      if (!errors) return null;

      for (const value of Object.values(errors)) {
            if (Array.isArray(value) && value.length > 0) return String(value[0]);
            if (typeof value === "string" && value.length > 0) return value;
      }

      return null;
};

const toDomainError = (body: ApiErrorBody | undefined, status: number): DomainError => {
      const message = body?.message || firstValidationMessage(body?.errors) || DEFAULT_MESSAGES[status] || "Une erreur est survenue.";

      if (status === 401) return new UnauthorizedError(message);
      if (status === 400 || status === 422) return new ValidationError(message, body?.errors);
      return new ApiError(message, status, body);
};

let unauthorizedHandler: (() => void) | null = null;

/** Permet au provider d'authentification de réagir à une session expirée. */
export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
      unauthorizedHandler = handler;
};

export const createApiClient = (): AxiosInstance => {
      const client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 15000,
            headers: { "Content-Type": "application/json" },
      });

      client.interceptors.request.use((config) => {
            const token = tokenStorage.getToken();
            if (token) {
                  config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
      });

      client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiErrorBody>) => {
                  if (!error.response) {
                        return Promise.reject(new NetworkError(undefined, error.message));
                  }

                  const { status, data } = error.response;
                  const domainError = toDomainError(data, status);

                  if (status === 401) {
                        tokenStorage.clearSession();
                        unauthorizedHandler?.();
                  }

                  return Promise.reject(domainError);
            }
      );

      return client;
};

export const apiClient = createApiClient();
