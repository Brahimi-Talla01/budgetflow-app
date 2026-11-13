import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import StyledSelect from "./StyledSelect";
import { useState, useMemo } from "react";
import { useExpenses } from "../../../application/context/expenseContext";

const COLORS = ["#26D0FF", "#00C49F", "#FFBB28", "#FF8042", "#8b5cf6", "#f43f5e"];

interface DataItem {
      name: string;
      value: number;
      [key: string]: string | number;
}

// Interface pour les props de renderActiveShape
interface ActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: DataItem;
  percent: number;
  value: number;
}

const CategoryGraph = () => {
  const { expenses, loading } = useExpenses();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("last_6_months");

  // Filtrer selon période
  const filtered = useMemo(() => {
    const now = new Date();
    return expenses.filter(exp => {
      const date = new Date(exp.date);

      if (selectedPeriod === "last_7_days") {
        const diff = (now.getTime() - date.getTime()) / 86400000;
        return diff <= 7;
      }

      if (selectedPeriod === "this_month") {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }

      if (selectedPeriod === "last_6_months") {
        const months =
          (now.getFullYear() - date.getFullYear()) * 12 +
          (now.getMonth() - date.getMonth());
        return months <= 6;
      }

      if (selectedPeriod === "this_year") {
        return date.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [expenses, selectedPeriod]);

  // Regrouper par catégorie
  const chartData: DataItem[] = useMemo(() => {
    const map: Record<string, number> = {};

    filtered.forEach(exp => {
      map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  // Active shape (inchangé)
const renderActiveShape = (props: unknown) => {
  // Cast des props vers l'interface 
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props as ActiveShapeProps;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontWeight="semibold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Anneau extérieur au survol */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value} $`}</text>

      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


  if (loading) return <p>Chargement...</p>;

  if (expenses.length === 0) return (
      <div className="flex flex-col items-center justify-center py-8 opacity-70 min-h-80 h-full">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" viewBox="0 0 24 24" 
                        strokeWidth={1.5} stroke="currentColor"
                        className="w-8 h-8 text-gray-400"
                  >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M3 9h18M9 3v6" />
                  </svg>
            </div>

            <p className="text-sm text-gray-500 mb-6">
                  Aucune dépense enregistrée pour le moment.
            </p>
      </div>
  )

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold text-dark">Dépense par catégorie</h1>

        <StyledSelect onChange={setSelectedPeriod} />
      </div>

      <div style={{ width: '100%', maxWidth: '500px', maxHeight: '300px', aspectRatio: 1 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Légende */}
      <ul className="flex items-center gap-4 flex-wrap pb-4">
        {chartData.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <div
              className="w-5 h-5 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm">{item.name}</span>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default CategoryGraph;