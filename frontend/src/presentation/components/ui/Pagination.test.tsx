import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Pagination from "./Pagination";

const baseProps = {
      page: 1,
      perPage: 5,
      total: 12,
      totalPages: 3,
      onPageChange: () => {},
      onPerPageChange: () => {},
};

describe("Pagination", () => {
      it("affiche la plage courante et le nombre de pages", () => {
            render(<Pagination {...baseProps} />);

            expect(screen.getByText("Affichage de 1 à 5 sur 12")).toBeTruthy();
            expect(screen.getByText("Page 1 / 3")).toBeTruthy();
      });

      it("désactive la page précédente sur la première page", () => {
            render(<Pagination {...baseProps} />);

            const previous = screen.getByLabelText("Page précédente") as HTMLButtonElement;
            const next = screen.getByLabelText("Page suivante") as HTMLButtonElement;

            expect(previous.disabled).toBe(true);
            expect(next.disabled).toBe(false);
      });

      it("propose des tailles de page de 5 et 10", () => {
            const onPerPageChange = vi.fn();
            render(<Pagination {...baseProps} onPerPageChange={onPerPageChange} />);

            const select = screen.getByLabelText("Nombre de résultats par page");
            const options = Array.from(select.querySelectorAll("option")).map(
                  (option) => option.getAttribute("value")
            );

            expect(options).toEqual(["5", "10"]);

            fireEvent.change(select, { target: { value: "10" } });
            expect(onPerPageChange).toHaveBeenCalledWith(10);
      });

      it("navigue vers la page suivante", () => {
            const onPageChange = vi.fn();
            render(<Pagination {...baseProps} onPageChange={onPageChange} />);

            fireEvent.click(screen.getByLabelText("Page suivante"));
            expect(onPageChange).toHaveBeenCalledWith(2);
      });
});
