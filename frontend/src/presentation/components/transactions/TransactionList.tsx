import { ArrowDownRight, ArrowUpRight, Receipt } from "lucide-react";
import { formatDate } from "../../../shared/utils/dateUtils";
import { formatSignedXAF } from "../../../shared/utils/currencyUtils";
import type { TransactionRow } from "./types";

interface TransactionListProps {
      rows: TransactionRow[];
      emptyMessage: string;
      onSelect?: (row: TransactionRow) => void;
}

const TransactionList = ({ rows, emptyMessage, onSelect }: TransactionListProps) => {
      if (rows.length === 0) {
            return (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                              <Receipt className="w-7 h-7 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">{emptyMessage}</p>
                  </div>
            );
      }

      return (
            <ul className="divide-y divide-gray-100">
                  {rows.map((row) => {
                        const isIncome = row.type === "income";
                        const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

                        const content = (
                              <>
                                    <span
                                          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                                                isIncome
                                                      ? "bg-green-50 text-green-600"
                                                      : "bg-red-50 text-red-600"
                                          }`}
                                    >
                                          <Icon className="w-5 h-5" />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                          <p className="text-sm font-semibold text-dark truncate">{row.label}</p>
                                          <p className="text-xs text-gray-500">
                                                {formatDate(row.date)} · {row.category}
                                                {row.projectId ? " · Projet" : ""}
                                          </p>
                                    </div>

                                    <span
                                          className={`text-sm font-bold whitespace-nowrap ${
                                                isIncome ? "text-green-600" : "text-red-600"
                                          }`}
                                    >
                                          {formatSignedXAF(row.amount, isIncome ? "in" : "out")}
                                    </span>
                              </>
                        );

                        return (
                              <li key={row.key}>
                                    {onSelect ? (
                                          <button
                                                type="button"
                                                onClick={() => onSelect(row)}
                                                aria-label={`Voir le détail de ${row.label}`}
                                                className="w-full flex items-center gap-3 py-3 text-left px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                          >
                                                {content}
                                          </button>
                                    ) : (
                                          <div className="flex items-center gap-3 py-3">{content}</div>
                                    )}
                              </li>
                        );
                  })}
            </ul>
      );
};

export default TransactionList;
