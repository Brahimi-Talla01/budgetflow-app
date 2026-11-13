import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import PageTitle from "../../components/ui/PageTitle";
import AlertBanner from "../../components/ui/AlertBanner";
import Pagination from "../../components/ui/Pagination";
import { SkeletonList } from "../../components/ui/Skeleton";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionList from "../../components/transactions/TransactionList";
import type { TransactionTypeFilter } from "../../components/transactions/types";
import type { PaginationMeta, TransactionQuery } from "../../../domain/entities/Transaction";
import { repositories } from "../../../application/di/container";
import { queryKeys } from "../../../shared/constants/queryKeys";
import { getErrorMessage } from "../../../shared/utils/errors";
import type { PeriodValue } from "../../../shared/utils/dateUtils";
import { formatXAF } from "../../../shared/utils/currencyUtils";

const EMPTY_PAGINATION: PaginationMeta = {
      page: 1,
      perPage: 5,
      total: 0,
      totalPages: 1,
      hasPrevious: false,
      hasNext: false,
};

const TransactionPage = () => {
      const [search, setSearch] = useState("");
      const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all");
      const [period, setPeriod] = useState<PeriodValue>("all");
      const [category, setCategory] = useState("all");
      const [page, setPage] = useState(1);
      const [perPage, setPerPage] = useState(5);

      const query = useMemo<TransactionQuery>(
            () => ({ page, perPage, type: typeFilter, search, category, period }),
            [page, perPage, typeFilter, search, category, period]
      );

      const transactionsQuery = useQuery({
            queryKey: queryKeys.transactions(query),
            queryFn: () => repositories.transactions.list(query),
            placeholderData: keepPreviousData,
      });

      const data = transactionsQuery.data;
      const rows = data?.rows ?? [];
      const pagination = data?.pagination ?? EMPTY_PAGINATION;
      const summary = data?.summary ?? { incomes: 0, expenses: 0, balance: 0 };
      const categories = data?.categories ?? [];

      const hasFilters =
            search.trim() !== "" || typeFilter !== "all" || period !== "all" || category !== "all";

      // Toute modification de filtre ou de taille de page ramène à la première page.
      const handleSearchChange = (value: string) => {
            setSearch(value);
            setPage(1);
      };

      const handleTypeChange = (value: TransactionTypeFilter) => {
            setTypeFilter(value);
            setCategory("all");
            setPage(1);
      };

      const handlePeriodChange = (value: PeriodValue) => {
            setPeriod(value);
            setPage(1);
      };

      const handleCategoryChange = (value: string) => {
            setCategory(value);
            setPage(1);
      };

      const handlePerPageChange = (value: number) => {
            setPerPage(value);
            setPage(1);
      };

      return (
            <>
                  <PageTitle title="Transactions" />

                  <div className="flex flex-col gap-2">
                        <h1 className="text-xl md:text-3xl font-bold text-dark">Transactions</h1>
                        <p className="text-sm text-gray-600">
                              {pagination.total} transaction{pagination.total > 1 ? "s" : ""} enregistrée
                              {pagination.total > 1 ? "s" : ""}
                        </p>
                  </div>

                  <div className="mt-4">
                        <TransactionFilters
                              search={search}
                              onSearchChange={handleSearchChange}
                              type={typeFilter}
                              onTypeChange={handleTypeChange}
                              period={period}
                              onPeriodChange={handlePeriodChange}
                              category={category}
                              onCategoryChange={handleCategoryChange}
                              categories={categories}
                        />
                  </div>

                  <div className="bg-white rounded-xl p-4 md:p-6 mt-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <h2 className="text-lg font-semibold text-dark">
                                    {pagination.total} résultat{pagination.total > 1 ? "s" : ""}
                                    {transactionsQuery.isFetching && !transactionsQuery.isLoading ? (
                                          <span className="ml-2 text-xs font-normal text-gray-400">mise à jour…</span>
                                    ) : null}
                              </h2>

                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <span className="text-green-600 font-medium">
                                          Revenus {formatXAF(summary.incomes)}
                                    </span>
                                    <span className="text-red-600 font-medium">
                                          Dépenses {formatXAF(summary.expenses)}
                                    </span>
                                    <span className={`font-semibold ${summary.balance >= 0 ? "text-primary" : "text-red-600"}`}>
                                          Solde {formatXAF(summary.balance)}
                                    </span>
                              </div>
                        </div>

                        {transactionsQuery.isError && (
                              <AlertBanner
                                    kind="error"
                                    message={getErrorMessage(
                                          transactionsQuery.error,
                                          "Impossible de charger les transactions."
                                    )}
                                    className="my-2"
                              />
                        )}

                        {transactionsQuery.isLoading ? (
                              <SkeletonList rows={4} />
                        ) : (
                              <TransactionList
                                    rows={rows}
                                    emptyMessage={
                                          hasFilters
                                                ? "Aucune transaction ne correspond à ces filtres."
                                                : "Aucune transaction enregistrée pour le moment."
                                    }
                              />
                        )}

                        <Pagination
                              page={pagination.page}
                              perPage={pagination.perPage}
                              total={pagination.total}
                              totalPages={pagination.totalPages}
                              onPageChange={setPage}
                              onPerPageChange={handlePerPageChange}
                              disabled={transactionsQuery.isFetching}
                        />
                  </div>
            </>
      );
};

export default TransactionPage;
