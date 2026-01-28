import { EllipsisVertical } from "lucide-react";
import React from "react";

export interface ParsedExpense {
      title: string;
      price: number;
      date: string;
      category: string;
      icon: React.ComponentType<{ className?: string }>;
}

interface RecentTransactionCardProps {
      expense: ParsedExpense;
      getCategoryColor: (category: string) => string;
}

const RecentTransactionCard: React.FC<RecentTransactionCardProps> = ({
      expense,
      getCategoryColor,
}) => {

      const Icon = expense.icon;

      return (
            <div className="shrink-0 w-[280px] rounded-md p-4 border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all">
                  
                  <div className="flex items-start justify-between w-full">
                        <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-primary-30 rounded-xl flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-gray-400" />
                              </div>

                              <div>
                                    <h3 className="font-semibold text-dark text-sm">{expense.title}</h3>
                                    <p className="text-xs text-gray-500">{expense.date}</p>
                              </div>
                        </div>

                        <button className=' cursor-pointer rounded-full p-2 hover:bg-gray-100 transition'>
                              <EllipsisVertical className=' w-5 h-5' />
                        </button>

                  </div>

                  <p className="text-xl font-bold text-gray-400">
                        -{expense.price.toFixed(2)} XAF
                  </p>

                  <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(
                  expense.category
                  )}`}
                  >
                        {expense.category}
                  </span>
            </div>
      );
};

export default RecentTransactionCard;
