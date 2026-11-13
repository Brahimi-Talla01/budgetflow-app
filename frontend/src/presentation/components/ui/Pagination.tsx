import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
      onPageChange: (page: number) => void;
      onPerPageChange: (perPage: number) => void;
      pageSizeOptions?: number[];
      disabled?: boolean;
}

const selectClassName =
      "h-9 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer";

const Pagination = ({
      page,
      perPage,
      total,
      totalPages,
      onPageChange,
      onPerPageChange,
      pageSizeOptions = [5, 10],
      disabled = false,
}: PaginationProps) => {
      const start = total === 0 ? 0 : (page - 1) * perPage + 1;
      const end = Math.min(page * perPage, total);

      return (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                        {total === 0
                              ? "Aucun résultat"
                              : `Affichage de ${start} à ${end} sur ${total}`}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                              Par page
                              <select
                                    aria-label="Nombre de résultats par page"
                                    value={perPage}
                                    onChange={(event) => onPerPageChange(Number(event.target.value))}
                                    disabled={disabled}
                                    className={selectClassName}
                              >
                                    {pageSizeOptions.map((option) => (
                                          <option key={option} value={option}>
                                                {option}
                                          </option>
                                    ))}
                              </select>
                        </label>

                        <div className="flex items-center gap-2">
                              <button
                                    type="button"
                                    aria-label="Page précédente"
                                    onClick={() => onPageChange(page - 1)}
                                    disabled={disabled || page <= 1}
                                    className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                              >
                                    <ChevronLeft className="w-4 h-4" />
                              </button>

                              <span className="text-sm text-gray-600 whitespace-nowrap">
                                    Page {page} / {totalPages}
                              </span>

                              <button
                                    type="button"
                                    aria-label="Page suivante"
                                    onClick={() => onPageChange(page + 1)}
                                    disabled={disabled || page >= totalPages}
                                    className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                              >
                                    <ChevronRight className="w-4 h-4" />
                              </button>
                        </div>
                  </div>
            </div>
      );
};

export default Pagination;
