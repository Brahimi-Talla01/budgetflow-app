const DEFAULT_API_ORIGIN = "http://127.0.0.1:5000";
export const API_PREFIX = "/api/v1";

/**
 * Normalise `VITE_API_URL` en une URL de base toujours suffixée par `/api/v1`.
 *
 * Les deux écritures sont acceptées :
 *  - `http://127.0.0.1:5000`          -> `http://127.0.0.1:5000/api/v1`
 *  - `http://127.0.0.1:5000/api/v1`   -> inchangé
 *
 * Cela évite le double préfixe (`/api/v1/api/v1/...`) qui cassait l'inscription.
 */
export const normalizeApiBaseUrl = (rawBaseUrl?: string): string => {
      const candidate = rawBaseUrl?.trim() || DEFAULT_API_ORIGIN;
      const withoutTrailingSlash = candidate.replace(/\/+$/, "");

      return withoutTrailingSlash.endsWith(API_PREFIX)
            ? withoutTrailingSlash
            : `${withoutTrailingSlash}${API_PREFIX}`;
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export const ENDPOINTS = {
      auth: {
            login: "/auth/login",
            register: "/auth/register",
      },
      expenses: {
            list: "/expenses/",
            byId: (expenseId: number) => `/expenses/${expenseId}`,
      },
      incomes: {
            list: "/incomes/",
            byId: (incomeId: number) => `/incomes/${incomeId}`,
      },
      projects: {
            list: "/projects/",
      },
} as const;
