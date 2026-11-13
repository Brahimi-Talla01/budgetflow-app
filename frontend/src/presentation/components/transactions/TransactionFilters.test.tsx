import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransactionFilters from "./TransactionFilters";

const setup = () => {
      const handlers = {
            onSearchChange: vi.fn(),
            onTypeChange: vi.fn(),
            onPeriodChange: vi.fn(),
            onCategoryChange: vi.fn(),
      };

      // Reproduit un parent contrôlé : la saisie doit rester affichée.
      const Harness = () => {
            const [search, setSearch] = useState("");

            return (
                  <TransactionFilters
                        search={search}
                        type="all"
                        period="all"
                        category="all"
                        categories={["Alimentation", "Transport"]}
                        onSearchChange={(value) => {
                              handlers.onSearchChange(value);
                              setSearch(value);
                        }}
                        onTypeChange={handlers.onTypeChange}
                        onPeriodChange={handlers.onPeriodChange}
                        onCategoryChange={handlers.onCategoryChange}
                  />
            );
      };

      render(<Harness />);

      return handlers;
};

describe("TransactionFilters", () => {
      it("propage la recherche saisie", async () => {
            const handlers = setup();
            const user = userEvent.setup();

            await user.type(screen.getByLabelText("Recherche"), "courses");

            expect(handlers.onSearchChange).toHaveBeenCalled();
            expect(handlers.onSearchChange.mock.calls.at(-1)?.[0]).toBe("courses");
      });

      it("propage le changement de type", async () => {
            const handlers = setup();
            const user = userEvent.setup();

            await user.selectOptions(screen.getByLabelText("Type"), "income");

            expect(handlers.onTypeChange).toHaveBeenCalledWith("income");
      });

      it("propage le changement de période", async () => {
            const handlers = setup();
            const user = userEvent.setup();

            await user.selectOptions(screen.getByLabelText("Période"), "this_month");

            expect(handlers.onPeriodChange).toHaveBeenCalledWith("this_month");
      });

      it("propose les catégories fournies", async () => {
            const handlers = setup();
            const user = userEvent.setup();

            await user.selectOptions(screen.getByLabelText("Catégorie"), "Transport");

            expect(handlers.onCategoryChange).toHaveBeenCalledWith("Transport");
      });
});
