import { Search } from "lucide-react";
import Input from "../ui/Input";
import { PERIOD_OPTIONS, type PeriodValue } from "../../../shared/utils/dateUtils";
import type { TransactionTypeFilter } from "./types";

interface TransactionFiltersProps {
      search: string;
      onSearchChange: (value: string) => void;
      type: TransactionTypeFilter;
      onTypeChange: (value: TransactionTypeFilter) => void;
      period: PeriodValue;
      onPeriodChange: (value: PeriodValue) => void;
      category: string;
      onCategoryChange: (value: string) => void;
      categories: string[];
}

const selectClassName =
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer";

const TransactionFilters = ({
      search,
      onSearchChange,
      type,
      onTypeChange,
      period,
      onPeriodChange,
      category,
      onCategoryChange,
      categories,
}: TransactionFiltersProps) => {
      return (
            <div className="bg-white rounded-xl p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                        <div className="relative">
                              <Input
                                    label="Recherche"
                                    type="search"
                                    value={search}
                                    placeholder="Description, catégorie..."
                                    onChange={(event) => onSearchChange(event.target.value)}
                                    className="pl-9"
                              />
                              <Search className="absolute left-3 top-[38px] w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="space-y-1.5">
                              <label htmlFor="filter-type" className="text-sm font-medium text-gray-700">
                                    Type
                              </label>
                              <select
                                    id="filter-type"
                                    value={type}
                                    onChange={(event) => onTypeChange(event.target.value as TransactionTypeFilter)}
                                    className={selectClassName}
                              >
                                    <option value="all">Tous</option>
                                    <option value="expense">Dépenses</option>
                                    <option value="income">Revenus</option>
                              </select>
                        </div>

                        <div className="space-y-1.5">
                              <label htmlFor="filter-period" className="text-sm font-medium text-gray-700">
                                    Période
                              </label>
                              <select
                                    id="filter-period"
                                    value={period}
                                    onChange={(event) => onPeriodChange(event.target.value as PeriodValue)}
                                    className={selectClassName}
                              >
                                    {PERIOD_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>
                                                {option.label}
                                          </option>
                                    ))}
                              </select>
                        </div>

                        <div className="space-y-1.5">
                              <label htmlFor="filter-category" className="text-sm font-medium text-gray-700">
                                    Catégorie
                              </label>
                              <select
                                    id="filter-category"
                                    value={category}
                                    onChange={(event) => onCategoryChange(event.target.value)}
                                    className={selectClassName}
                              >
                                    <option value="all">Toutes</option>
                                    {categories.map((item) => (
                                          <option key={item} value={item}>
                                                {item}
                                          </option>
                                    ))}
                              </select>
                        </div>
                  </div>
            </div>
      );
};

export default TransactionFilters;
