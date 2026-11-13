import { describe, expect, it } from "vitest";
import { formatDate, formatRelativeTime, isDateInPeriod } from "./dateUtils";

const NOW = new Date(2026, 4, 15, 12, 0, 0); // 15 mai 2026

describe("isDateInPeriod", () => {
      it("accepte toutes les dates pour la période 'all'", () => {
            expect(isDateInPeriod(new Date(2020, 0, 1), "all", NOW)).toBe(true);
      });

      it("filtre les 7 derniers jours", () => {
            expect(isDateInPeriod(new Date(2026, 4, 12), "last_7_days", NOW)).toBe(true);
            expect(isDateInPeriod(new Date(2026, 3, 1), "last_7_days", NOW)).toBe(false);
            expect(isDateInPeriod(new Date(2026, 4, 20), "last_7_days", NOW)).toBe(false);
      });

      it("filtre le mois courant", () => {
            expect(isDateInPeriod(new Date(2026, 4, 1), "this_month", NOW)).toBe(true);
            expect(isDateInPeriod(new Date(2026, 3, 30), "this_month", NOW)).toBe(false);
      });

      it("filtre les 6 derniers mois", () => {
            expect(isDateInPeriod(new Date(2026, 0, 15), "last_6_months", NOW)).toBe(true);
            expect(isDateInPeriod(new Date(2025, 9, 1), "last_6_months", NOW)).toBe(false);
      });

      it("filtre l'année courante", () => {
            expect(isDateInPeriod(new Date(2026, 0, 1), "this_year", NOW)).toBe(true);
            expect(isDateInPeriod(new Date(2025, 11, 31), "this_year", NOW)).toBe(false);
      });

      it("rejette une date invalide", () => {
            expect(isDateInPeriod(new Date("invalide"), "all", NOW)).toBe(false);
      });
});

describe("formatDate", () => {
      it("affiche le jour, le mois et l'année", () => {
            const formatted = formatDate(new Date(2026, 0, 5));
            expect(formatted).toContain("2026");
            expect(formatted).toContain("05");
      });
});

describe("formatRelativeTime", () => {
      it("gère les secondes", () => {
            expect(formatRelativeTime(new Date(NOW.getTime() - 20_000), NOW)).toBe("à l'instant");
      });

      it("gère les minutes et les heures", () => {
            expect(formatRelativeTime(new Date(NOW.getTime() - 5 * 60_000), NOW)).toBe("il y a 5 min");
            expect(formatRelativeTime(new Date(NOW.getTime() - 3 * 3_600_000), NOW)).toBe("il y a 3 h");
      });

      it("gère les jours", () => {
            expect(formatRelativeTime(new Date(NOW.getTime() - 3 * 86_400_000), NOW)).toBe("il y a 3 j");
      });

      it("repasse à la date complète au-delà d'une semaine", () => {
            const formatted = formatRelativeTime(new Date(NOW.getTime() - 30 * 86_400_000), NOW);
            expect(formatted).toContain("2026");
            expect(formatted).not.toContain("il y a");
      });
});
