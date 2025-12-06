import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import StyledSelect from "./StyledSelect";

interface DataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

const COLORS = ["#26D0FF", "#00C49F", "#FFBB28", "#FF8042"];

// Données
const data: DataItem[] = [
  { name: "Alimentation", value: 400 },
  { name: "Shopping", value: 300 },
  { name: "Hobbies", value: 300 },
  { name: "Loisir", value: 200 },
];

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

// Fonction de rendu
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

const CategoryGraph = () => {
      return (
            <div className="flex flex-col items-center gap-2">

                  <div className="flex w-full items-center justify-between">

                        <h1 className="text-lg font-semibold text-dark">
                              Dépense par catégorie
                        </h1>

                        {/* Options de filtres */}
                        <StyledSelect />
                  </div>
                  <div 
                        style={{ width: '100%', maxWidth: '500px', maxHeight: '300px', aspectRatio: 1 }}
                  >
                        <ResponsiveContainer>
                              <PieChart>
                                    <Pie
                                          activeShape={renderActiveShape}
                                          data={data}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={45}
                                          outerRadius={80}
                                          dataKey="value"
                                    >
                                          {data.map((_, index) => (
                                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                          ))}
                                    </Pie>
                              </PieChart>
                        </ResponsiveContainer>

                  </div>

                  {/* Legend */}
                  <ul className="flex items-center gap-4 flex-wrap pb-4">
                        {data.map((item, index) => (
                              <li key={index} className="flex items-center gap-1">
                                    <div
                                          className="w-5 h-5 rounded-sm"
                                          style={{ backgroundColor: COLORS[index] }}
                                    />
                                    <span className="text-sm">{item.name}</span>
                              </li>
                        ))}
                  </ul>

            </div>
      );
}

export default CategoryGraph;