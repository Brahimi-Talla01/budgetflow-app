import { describe, expect, it } from "vitest";
import { ENDPOINTS, normalizeApiBaseUrl } from "./endpoints";

describe("normalizeApiBaseUrl", () => {
      it("utilise l'API locale par défaut", () => {
            expect(normalizeApiBaseUrl()).toBe("http://127.0.0.1:5000/api/v1");
      });

      it("ajoute le préfixe /api/v1 à une origine seule", () => {
            expect(normalizeApiBaseUrl("http://127.0.0.1:5000")).toBe(
                  "http://127.0.0.1:5000/api/v1"
            );
      });

      it("ne duplique pas un préfixe déjà présent", () => {
            expect(normalizeApiBaseUrl("http://127.0.0.1:5000/api/v1")).toBe(
                  "http://127.0.0.1:5000/api/v1"
            );
      });

      it("supprime les slashs de fin et les espaces", () => {
            expect(normalizeApiBaseUrl("  https://api.budgetflow.dev/  ")).toBe(
                  "https://api.budgetflow.dev/api/v1"
            );
      });

      it("ignore une valeur vide", () => {
            expect(normalizeApiBaseUrl("   ")).toBe("http://127.0.0.1:5000/api/v1");
      });
});

describe("ENDPOINTS", () => {
      it("construit les chemins paramétrés", () => {
            expect(ENDPOINTS.expenses.byId(12)).toBe("/expenses/12");
            expect(ENDPOINTS.incomes.byId(3)).toBe("/incomes/3");
            expect(ENDPOINTS.projects.byId(7)).toBe("/projects/7");
            expect(ENDPOINTS.notifications.byId(4)).toBe("/notifications/4");
      });

      it("expose les routes de collection", () => {
            expect(ENDPOINTS.auth.login).toBe("/auth/login");
            expect(ENDPOINTS.expenses.list).toBe("/expenses/");
            expect(ENDPOINTS.notifications.list).toBe("/notifications/");
      });
});
