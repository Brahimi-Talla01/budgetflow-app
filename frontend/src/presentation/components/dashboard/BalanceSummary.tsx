import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { useExpenses } from "../../../application/context/expenseContext";
import { useIncomes } from "../../../application/context/incomeContext";

const formatAmount = (value: number): string => `${value.toLocaleString("fr-FR")} XAF`;

const BalanceSummary = () => {
      const { expenses } = useExpenses();
      const { incomes } = useIncomes();

      const totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const balance = totalIncomes - totalExpenses;

      const cards = [
            {
                  label: "Revenus",
                  value: totalIncomes,
                  icon: <ArrowUpRight className="w-5 h-5" />,
                  className: "text-green-600",
            },
            {
                  label: "Dépenses",
                  value: totalExpenses,
                  icon: <ArrowDownRight className="w-5 h-5" />,
                  className: "text-red-600",
            },
            {
                  label: "Solde net",
                  value: balance,
                  icon: <Wallet className="w-5 h-5" />,
                  className: balance >= 0 ? "text-primary" : "text-red-600",
            },
      ];

      return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  {cards.map((card) => (
                        <div key={card.label} className="bg-white rounded-xl p-4 flex items-center justify-between">
                              <div>
                                    <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                                    <p className={`text-xl font-bold ${card.className}`}>
                                          {formatAmount(card.value)}
                                    </p>
                              </div>
                              <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                    {card.icon}
                              </span>
                        </div>
                  ))}
            </div>
      );
};

export default BalanceSummary;
