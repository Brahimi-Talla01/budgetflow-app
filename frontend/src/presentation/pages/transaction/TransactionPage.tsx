import { useMemo, useState } from "react";
import PageTitle from "../../components/ui/PageTitle";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionList from "../../components/transactions/TransactionList";
import type { TransactionRow, TransactionTypeFilter } from "../../components/transactions/types";
import { useExpenses } from "../../../application/context/expenseContext";
import { useIncomes } from "../../../application/context/incomeContext";
import { isDateInPeriod, type PeriodValue } from "../../../shared/utils/dateUtils";
import { formatXAF } from "../../../shared/utils/currencyUtils";

const TransactionPage = () => {
      const { expenses, loading: expensesLoading } = useExpenses();
      const { incomes, loading: incomesLoading } = useIncomes();

      const [search, setSearch] = useState("");
      const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all");
      const [period, setPeriod] = useState<PeriodValue>("all");
      const [category, setCategory] = useState("all");

      // Fusionne dépenses et revenus en une seule liste triée du plus récent au plus ancien.
      const rows = useMemo<TransactionRow[]>(() => {
            const expenseRows: TransactionRow[] = expenses.map((expense) => ({
                  key: `expense-${expense.id}`,
                  type: "expense",
                  label: expense.description || expense.category,
                  category: expense.category,
                  amount: expense.amount,
                  date: expense.date,
                  description: expense.description,
                  projectId: expense.projectId,
            }));

            const incomeRows: TransactionRow[] = incomes.map((income) => ({
                  key: `income-${income.id}`,
                  type: "income",
                  label: income.description || income.source,
                  category: income.source,
                  amount: income.amount,
                  date: income.date,
                  description: income.description,
                  projectId: income.projectId,
            }));

            return [...expenseRows, ...incomeRows].sort(
                  (a, b) => b.date.getTime() - a.date.getTime()
            );
      }, [expenses, incomes]);

      const categories = useMemo(
            () => Array.from(new Set(rows.map((row) => row.category))).sort((a, b) => a.localeCompare(b, "fr")),
            [rows]
      );

      const filteredRows = useMemo(() => {
            const query = search.trim().toLowerCase();

            return rows.filter((row) => {
                  if (typeFilter !== "all" && row.type !== typeFilter) return false;
                  if (category !== "all" && row.category !== category) return false;
                  if (!isDateInPeriod(row.date, period)) return false;

                  if (query) {
                        const haystack = `${row.label} ${row.category} ${row.description ?? ""}`.toLowerCase();
                        if (!haystack.includes(query)) return false;
                  }

                  return true;
            });
      }, [rows, typeFilter, category, period, search]);

      const totals = useMemo(
            () =>
                  filteredRows.reduce(
                        (acc, row) => {
                              if (row.type === "income") acc.incomes += row.amount;
                              else acc.expenses += row.amount;
                              return acc;
                        },
                        { incomes: 0, expenses: 0 }
                  ),
            [filteredRows]
      );

      const balance = totals.incomes - totals.expenses;
      const loading = expensesLoading || incomesLoading;
      const hasAnyTransaction = rows.length > 0;

      const handleTypeChange = (value: TransactionTypeFilter) => {
            setTypeFilter(value);
            setCategory("all");
      };

      return (
            <>
                  <PageTitle title="Transactions" />

                  <div className="flex flex-col gap-2">
                        <h1 className="text-xl md:text-3xl font-bold text-dark">Transactions</h1>
                        <p className="text-sm text-gray-600">
                              {rows.length} transaction{rows.length > 1 ? "s" : ""} enregistrée
                              {rows.length > 1 ? "s" : ""}
                        </p>
                  </div>

                  <div className="mt-4">
                        <TransactionFilters
                              search={search}
                              onSearchChange={setSearch}
                              type={typeFilter}
                              onTypeChange={handleTypeChange}
                              period={period}
                              onPeriodChange={setPeriod}
                              category={category}
                              onCategoryChange={setCategory}
                              categories={categories}
                        />
                  </div>

                  <div className="bg-white rounded-xl p-4 md:p-6 mt-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <h2 className="text-lg font-semibold text-dark">
                                    {filteredRows.length} résultat{filteredRows.length > 1 ? "s" : ""}
                              </h2>

                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <span className="text-green-600 font-medium">
                                          Revenus {formatXAF(totals.incomes)}
                                    </span>
                                    <span className="text-red-600 font-medium">
                                          Dépenses {formatXAF(totals.expenses)}
                                    </span>
                                    <span className={`font-semibold ${balance >= 0 ? "text-primary" : "text-red-600"}`}>
                                          Solde {formatXAF(balance)}
                                    </span>
                              </div>
                        </div>

                        {loading && !hasAnyTransaction ? (
                              <div className="flex justify-center items-center py-12">
                                    <span className="w-9 h-9 rounded-full border-2 border-t-transparent border-primary animate-spin" />
                              </div>
                        ) : (
                              <TransactionList
                                    rows={filteredRows}
                                    emptyMessage={
                                          hasAnyTransaction
                                                ? "Aucune transaction ne correspond à ces filtres."
                                                : "Aucune transaction enregistrée pour le moment."
                                    }
                              />
                        )}
                  </div>
            </>
      );
};

export default TransactionPage;
