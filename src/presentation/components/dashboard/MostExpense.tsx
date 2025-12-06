import type React from "react";
import type { ExpenseProps } from "../../../domain/entities/Expense";
import { Car, Home, ListOrdered, ServerIcon, ShoppingBag } from "lucide-react";

interface MostExpenseProps {
      expense: ExpenseProps;
}

const MostExpense: React.FC<MostExpenseProps> = ({ expense }) => {


      // Obtenir l'icone de la catégorie
      const getCategoryIcon = (category: string, className: string) => {
            switch (category) {
                  case "Alimentation": return <ShoppingBag className={className} />;
                  case "Transport": return <Car className={className} />;
                  case "Logement": return <Home className={className} />;
                  case "Services": return <ServerIcon className={className} />;
                  default: return <ListOrdered className={className} />;
            }
      };
      
      return (
            <div className="p-3 rounded-md flex items-center justify-between w-full border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                  <div className="flex flex-col">
                        <div className=" flex gap-2 items-center">

                              <div className="w-10 h-10 bg-primary-30 rounded-xl flex items-center justify-center shadow-sm mb-2 transition-shadow">
                                    {getCategoryIcon(expense.category, "w-5 h-5 text-gray-400")}
                              </div>
                              <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-dark">{expense.category}</span>
                                    <span className="text-xs text-gray-400">
                                          {expense.date.toLocaleDateString()}
                                    </span>

                              </div>

                        </div>
                        {expense.description && (
                        <span className="text-xs text-gray-500 py-2">{expense.description}</span>
                        )}
                  </div>

                  <span className="font-bold text-primary text-sm">{expense.amount} $</span>
            </div>
      );
}

export default MostExpense;
