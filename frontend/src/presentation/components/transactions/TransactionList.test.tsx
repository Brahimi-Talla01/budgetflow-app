import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TransactionList from "./TransactionList";
import type { TransactionRow } from "./types";

const rows: TransactionRow[] = [
      {
            key: "income-1",
            type: "income",
            label: "Salaire mensuel",
            category: "Salaire",
            amount: 90000,
            date: new Date(2026, 0, 5),
      },
      {
            key: "expense-2",
            type: "expense",
            label: "Courses",
            category: "Alimentation",
            amount: 1500,
            date: new Date(2026, 0, 6),
            projectId: 2,
      },
];

describe("TransactionList", () => {
      it("affiche chaque transaction avec son libellé et sa catégorie", () => {
            render(<TransactionList rows={rows} emptyMessage="Vide" />);

            expect(screen.getByText("Salaire mensuel")).toBeTruthy();
            expect(screen.getByText(/Alimentation/)).toBeTruthy();
      });

      it("signe les montants selon le type", () => {
            render(<TransactionList rows={rows} emptyMessage="Vide" />);

            const amounts = screen.getAllByText(/XAF/).map((node) => node.textContent ?? "");
            const income = amounts.find((text) => text.includes("90"));
            const expense = amounts.find((text) => text.includes("1"));

            expect(income?.startsWith("+")).toBe(true);
            expect(expense?.startsWith("-")).toBe(true);
      });

      it("affiche le message vide quand aucune ligne", () => {
            render(<TransactionList rows={[]} emptyMessage="Aucune transaction." />);

            expect(screen.getByText("Aucune transaction.")).toBeTruthy();
      });
});
