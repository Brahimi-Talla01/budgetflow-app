import { useMemo, useState } from "react";
import {
      Bar,
      BarChart,
      CartesianGrid,
      Cell,
      Pie,
      PieChart,
      ResponsiveContainer,
      Tooltip,
      XAxis,
      YAxis,
} from "recharts";
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import PageTitle from "../../components/ui/PageTitle";
import { useExpenses } from "../../../application/context/expenseContext";
import { useIncomes } from "../../../application/context/incomeContext";
import { isDateInPeriod, PERIOD_OPTIONS, type PeriodValue } from "../../../shared/utils/dateUtils";
import { formatXAF } from "../../../shared/utils/currencyUtils";

const COLORS = ["#26D0FF", "#00C49F", "#FFBB28", "#FF8042", "#8b5cf6", "#f43f5e", "#0ea5e9"];

interface MonthlyPoint {
      label: string;
      incomes: number;
      expenses: number;
}

interface CategoryPoint {
      name: string;
      value: number;
      [key: string]: string | number;
}

interface MonthlyTooltipProps {
      active?: boolean;
      payload?: ReadonlyArray<{ payload?: MonthlyPoint }>;
}

const MonthlyTooltip = ({ active, payload }: MonthlyTooltipProps) => {
      const point = payload?.[0]?.payload;
      if (!active || !point) return null;

      return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
                  <p className="font-semibold text-dark mb-2">{point.label}</p>
                  <p className="text-green-600">Revenus : {formatXAF(point.incomes)}</p>
                  <p className="text-red-600">Dépenses : {formatXAF(point.expenses)}</p>
            </div>
      );
};

const AnalysePage = () => {
      const { expenses } = useExpenses();
      const { incomes } = useIncomes();
      const [period, setPeriod] = useState<PeriodValue>("last_6_months");

      const filteredIncomes = useMemo(
            () => incomes.filter((income) => isDateInPeriod(income.date, period)),
            [incomes, period]
      );

      const filteredExpenses = useMemo(
            () => expenses.filter((expense) => isDateInPeriod(expense.date, period)),
            [expenses, period]
      );

      const totalIncomes = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
      const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const balance = totalIncomes - totalExpenses;
      const savingsRate = totalIncomes > 0 ? (balance / totalIncomes) * 100 : 0;

      // Évolution sur les 6 derniers mois, indépendante du filtre de période.
      const monthlyData = useMemo<MonthlyPoint[]>(() => {
            const now = new Date();
            const buckets = new Map<string, MonthlyPoint>();
            const points: MonthlyPoint[] = [];

            for (let index = 5; index >= 0; index -= 1) {
                  const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
                  const point: MonthlyPoint = {
                        label: date.toLocaleDateString("fr-FR", { month: "short" }),
                        incomes: 0,
                        expenses: 0,
                  };
                  buckets.set(`${date.getFullYear()}-${date.getMonth()}`, point);
                  points.push(point);
            }

            const add = (date: Date, type: "incomes" | "expenses", amount: number) => {
                  const bucket = buckets.get(`${date.getFullYear()}-${date.getMonth()}`);
                  if (bucket) bucket[type] += amount;
            };

            incomes.forEach((income) => add(income.date, "incomes", income.amount));
            expenses.forEach((expense) => add(expense.date, "expenses", expense.amount));

            return points;
      }, [incomes, expenses]);

      const categoryData = useMemo<CategoryPoint[]>(() => {
            const totals = new Map<string, number>();

            for (const expense of filteredExpenses) {
                  totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
            }

            return [...totals.entries()]
                  .map(([name, value]) => ({ name, value }))
                  .sort((a, b) => b.value - a.value);
      }, [filteredExpenses]);

      const cards = [
            { label: "Revenus", value: formatXAF(totalIncomes), icon: TrendingUp, className: "text-green-600" },
            { label: "Dépenses", value: formatXAF(totalExpenses), icon: TrendingDown, className: "text-red-600" },
            { label: "Solde", value: formatXAF(balance), icon: Wallet, className: balance >= 0 ? "text-primary" : "text-red-600" },
            {
                  label: "Taux d'épargne",
                  value: `${savingsRate.toFixed(0)} %`,
                  icon: PiggyBank,
                  className: savingsRate >= 0 ? "text-primary" : "text-red-600",
            },
      ];

      return (
            <>
                  <PageTitle title="Analyse financière" />

                  <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                              <h1 className="text-xl md:text-3xl font-bold text-dark">Analyse financière</h1>
                              <p className="text-sm text-gray-600 mt-2">
                                    Répartition de vos dépenses et évolution de votre budget.
                              </p>
                        </div>

                        <div className="space-y-1.5">
                              <label htmlFor="analyse-period" className="text-sm font-medium text-gray-700">
                                    Période
                              </label>
                              <select
                                    id="analyse-period"
                                    value={period}
                                    onChange={(event) => setPeriod(event.target.value as PeriodValue)}
                                    className="flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                              >
                                    {PERIOD_OPTIONS.filter((option) => option.value !== "all").map((option) => (
                                          <option key={option.value} value={option.value}>
                                                {option.label}
                                          </option>
                                    ))}
                              </select>
                        </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
                        {cards.map((card) => {
                              const Icon = card.icon;
                              return (
                                    <div key={card.label} className="bg-white rounded-xl p-4 flex items-center justify-between">
                                          <div>
                                                <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                                                <p className={`text-xl font-bold ${card.className}`}>{card.value}</p>
                                          </div>
                                          <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                                <Icon className="w-5 h-5" />
                                          </span>
                                    </div>
                              );
                        })}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
                        <section className="bg-white rounded-xl p-4 md:p-6">
                              <h2 className="text-lg font-semibold text-dark">Évolution sur 6 mois</h2>
                              <p className="text-xs text-gray-500 mb-4">Revenus et dépenses par mois</p>

                              <div className="w-full h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                          <BarChart data={monthlyData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                                                <YAxis
                                                      axisLine={false}
                                                      tickLine={false}
                                                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                                      tickFormatter={(value: number) =>
                                                            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
                                                      }
                                                />
                                                <Tooltip content={<MonthlyTooltip />} cursor={{ fill: "#F9FAFB" }} />
                                                <Bar dataKey="incomes" name="Revenus" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="expenses" name="Dépenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                          </BarChart>
                                    </ResponsiveContainer>
                              </div>
                        </section>

                        <section className="bg-white rounded-xl p-4 md:p-6">
                              <h2 className="text-lg font-semibold text-dark">Dépenses par catégorie</h2>
                              <p className="text-xs text-gray-500 mb-4">
                                    {period === "last_7_days" ? "7 derniers jours" : "Sur la période sélectionnée"}
                              </p>

                              {categoryData.length === 0 ? (
                                    <div className="flex items-center justify-center h-48 text-sm text-gray-500">
                                          Aucune dépense sur cette période.
                                    </div>
                              ) : (
                                    <>
                                          <div className="w-full h-56">
                                                <ResponsiveContainer width="100%" height="100%">
                                                      <PieChart>
                                                            <Pie
                                                                  data={categoryData}
                                                                  dataKey="value"
                                                                  nameKey="name"
                                                                  cx="50%"
                                                                  cy="50%"
                                                                  innerRadius={50}
                                                                  outerRadius={85}
                                                            >
                                                                  {categoryData.map((entry, index) => (
                                                                        <Cell
                                                                              key={entry.name}
                                                                              fill={COLORS[index % COLORS.length]}
                                                                        />
                                                                  ))}
                                                            </Pie>
                                                      </PieChart>
                                                </ResponsiveContainer>
                                          </div>

                                          <ul className="space-y-2">
                                                {categoryData.slice(0, 5).map((entry, index) => (
                                                      <li key={entry.name} className="flex items-center justify-between text-sm">
                                                            <span className="flex items-center gap-2 text-gray-600">
                                                                  <span
                                                                        className="w-3 h-3 rounded-sm"
                                                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                                  />
                                                                  {entry.name}
                                                            </span>
                                                            <span className="font-semibold text-dark">
                                                                  {formatXAF(entry.value)}
                                                            </span>
                                                      </li>
                                                ))}
                                          </ul>
                                    </>
                              )}
                        </section>
                  </div>
            </>
      );
};

export default AnalysePage;
