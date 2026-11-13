import { ArrowDownRight, ArrowUpRight, Receipt } from "lucide-react";
import { formatDate } from "../../../shared/utils/dateUtils";
import { formatSignedXAF } from "../../../shared/utils/currencyUtils";
import type { TransactionRow } from "./types";

interface TransactionListProps {
      rows: TransactionRow[];
      emptyMessage: string;
}

const TransactionList = ({ rows, emptyMessage }: TransactionListProps) => {
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

                        return (
                              <li key={row.key} className="flex items-center gap-3 py-3">
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
                              </li>
                        );
                  })}
            </ul>
      );
};

export default TransactionList;
