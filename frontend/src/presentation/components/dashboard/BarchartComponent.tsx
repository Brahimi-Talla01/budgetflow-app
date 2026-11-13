import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip, CartesianGrid, YAxis } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useExpenses } from "../../../application/context/expenseContext";
import { useIncomes } from "../../../application/context/incomeContext";

interface Props {
      view: "Revenu" | "Dépense";
      period: string;
}

interface ChartPoint {
      date: string;
      fullDate: string;
      value: number;
}

interface ChartSource {
      amount: number;
      createdAt: Date;
}

interface ChartTooltipProps {
      active?: boolean;
      payload?: ReadonlyArray<{ payload?: ChartPoint }>;
}

const PERIOD_LABELS: Record<string, string> = {
      last_7_days: "7 derniers jours",
      this_month: "Ce mois",
      last_6_months: "6 derniers mois",
      this_year: "Cette année",
};

const ChartTooltip = ({ active, payload }: ChartTooltipProps) => {
      const point = payload?.[0]?.payload;
      if (!active || !point) return null;

      return (
            <div className="bg-white border border-gray-200 text-dark p-4 rounded-xl shadow-2xl min-w-[200px]">
                  <p className="text-sm text-gray-600 mb-2">{point.fullDate}</p>
                  <p className="font-bold text-2xl text-gray-900">
                        {point.value.toLocaleString("fr-FR")} XAF
                  </p>
            </div>
      );
};

export const BarchartComponent = ({ view, period }: Props) => {
      const { expenses } = useExpenses();
      const { incomes } = useIncomes();
      const [hoveredData, setHoveredData] = useState<ChartPoint | null>(null);

      // La vue "Revenu" doit afficher les revenus, pas les dépenses.
      const items = useMemo<ChartSource[]>(
            () => (view === "Revenu" ? incomes : expenses),
            [view, incomes, expenses]
      );

      // Filtrer selon la période
      const filteredItems = useMemo(() => {
            const now = new Date();

            return items.filter((item) => {
                  const date = new Date(item.createdAt);

                  if (period === "last_7_days") {
                        const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
                        return diff <= 7;
                  }

                  if (period === "this_month") {
                        return (
                              date.getMonth() === now.getMonth() &&
                              date.getFullYear() === now.getFullYear()
                        );
                  }

                  if (period === "last_6_months") {
                        const months = (now.getFullYear() - date.getFullYear()) * 12 +
                                          (now.getMonth() - date.getMonth());
                        return months <= 6;
                  }

                  if (period === "this_year") {
                        return date.getFullYear() === now.getFullYear();
                  }

                  return true;
            });
      }, [items, period]);

      // Mapper pour recharts
      const graphData = useMemo(() => {
            return filteredItems.map((item) => ({
                  date: new Date(item.createdAt).toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
                  fullDate: new Date(item.createdAt).toLocaleDateString("fr-FR", {
                        month: "short",
                        year: "numeric"
                  }),
                  value: item.amount
            })).reverse();
      }, [filteredItems]);

      // Calculs statistiques
      const stats = useMemo(() => {
            const total = graphData.reduce((sum, item) => sum + item.value, 0);
            const firstValue = graphData.length > 0 ? graphData[0].value : 0;
            const lastValue = graphData.length > 0 ? graphData[graphData.length - 1].value : 0;
            const growth = firstValue > 0
                  ? ((lastValue - firstValue) / firstValue) * 100
                  : 0;

            return {
                  total,
                  lastValue,
                  growth,
                  count: graphData.length
            };
      }, [graphData]);

      // Handler pour le hover
      const handleMouseMove = (state: unknown) => {
            if (typeof state !== "object" || state === null) return;

            const activePayload = (state as { activePayload?: Array<{ payload?: ChartPoint }> }).activePayload;
            const point = activePayload?.[0]?.payload;

            if (point) {
                  setHoveredData(point);
            }
      };

      const handleMouseLeave = () => {
            setHoveredData(null);
      };

      const displayValue = hoveredData ? hoveredData.value : stats.lastValue;

      return (
            <div className="bg-white rounded-xl h-full relative">
                  {/* En-tête avec statistiques */}
                  <div className="flex items-start justify-between mb-6">
                        <div>
                              <p className="text-sm text-gray-500 mb-2">
                                    {hoveredData
                                          ? hoveredData.fullDate
                                          : `${view} · ${PERIOD_LABELS[period] ?? "Cette année"}`}
                              </p>
                              <p className="text-4xl font-bold text-gray-900">
                                    {displayValue.toLocaleString("fr-FR")} XAF
                              </p>
                        </div>

                        {/* Badge de croissance */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                              stats.growth >= 0
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                        }`}>
                              {stats.growth >= 0 ? (
                                    <TrendingUp className="w-4 h-4" />
                              ) : (
                                    <TrendingDown className="w-4 h-4" />
                              )}
                              <span className="font-bold text-sm">
                                    {stats.growth >= 0 ? '+' : ''}{stats.growth.toFixed(1)}%
                              </span>
                        </div>
                  </div>

                  {/* Statistiques supplémentaires */}
                  <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-100">
                        <div>
                              <p className="text-xs text-gray-500 mb-1">Volume</p>
                              <p className="text-lg font-semibold text-gray-900">
                                    {stats.count} transactions
                              </p>
                        </div>
                        <div>
                              <p className="text-xs text-gray-500 mb-1">Total</p>
                              <p className="text-lg font-semibold text-gray-900">
                                    {stats.total.toLocaleString("fr-FR")} XAF
                              </p>
                        </div>
                  </div>

                  {/* Graphique */}
                  <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                    data={graphData}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                              >
                                    <defs>
                                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#26D0FF" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#26D0FF" stopOpacity={0}/>
                                          </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                          strokeDasharray="3 3"
                                          stroke="#E5E7EB"
                                          vertical={false}
                                    />

                                    <XAxis
                                          dataKey="date"
                                          axisLine={false}
                                          tickLine={false}
                                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                          dy={10}
                                    />

                                    <YAxis
                                          axisLine={false}
                                          tickLine={false}
                                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                          tickFormatter={(value: number) => {
                                                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                                                return String(value);
                                          }}
                                    />

                                    <Tooltip
                                          content={<ChartTooltip />}
                                          cursor={{ stroke: "#26D0FF", strokeWidth: 2, strokeDasharray: "5 5" }}
                                    />

                                    <Area
                                          type="monotone"
                                          dataKey="value"
                                          stroke="#26D0FF"
                                          strokeWidth={3}
                                          fill="url(#colorValue)"
                                          dot={false}
                                          activeDot={{
                                                r: 6,
                                                fill: "#26D0FF",
                                                stroke: "#fff",
                                                strokeWidth: 3
                                          }}
                                    />
                              </AreaChart>
                        </ResponsiveContainer>
                  </div>
            </div>
      );
};

export default BarchartComponent;
