import { describe, expect, it } from "vitest";
import { formatSignedXAF, formatXAF } from "./currencyUtils";

describe("formatXAF", () => {
      it("ajoute le suffixe XAF", () => {
            expect(formatXAF(1500)).toContain("XAF");
      });

      it("sépare les milliers", () => {
            expect(formatXAF(1500)).toMatch(/1\D?500\s?XAF/);
      });
});

describe("formatSignedXAF", () => {
      it("préfixe les entrées par +", () => {
            expect(formatSignedXAF(2500, "in").startsWith("+")).toBe(true);
      });

      it("préfixe les sorties par -", () => {
            expect(formatSignedXAF(2500, "out").startsWith("-")).toBe(true);
      });

      it("normalise le montant absolu", () => {
            expect(formatSignedXAF(-2500, "out").startsWith("-")).toBe(true);
            expect(formatSignedXAF(-2500, "out")).not.toContain("--");
      });
});
