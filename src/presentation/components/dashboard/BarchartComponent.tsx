import { useState, useCallback } from 'react';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface DataItem {
  date: string;
  revenue: number;
}

const data: DataItem[] = [
  { date: "Jan 25", revenue: 2340 },
  { date: "Fév 25", revenue: 3110 },
  { date: "Mar 25", revenue: 4643 },
  { date: "Avr 25", revenue: 4650 },
  { date: "Mai 25", revenue: 3980 },
  { date: "Juin 25", revenue: 4702 },
  { date: "Juil 25", revenue: 5990 },
  { date: "Aoû 25", revenue: 5700 },
  { date: "Sep 25", revenue: 4250 },
  { date: "Oct 25", revenue: 4182 },
  { date: "Nov 25", revenue: 3812 },
];


const currencyFormatter = (number: number) =>
  `$${Intl.NumberFormat("fr-FR").format(number)}`;



export const BarchartComponent = () => {
  
      const [hoverData, setHoverData] = useState<DataItem | null>(null);

      const handleTooltipChange = useCallback((props: any) => {
            if (props.active && props.payload && props.payload.length) {
                  setHoverData(props.payload[0].payload as DataItem);

                  console.log(hoverData);
            } else {
                  setHoverData(null);
            }
      }, []);

      const valueToDisplay = hoverData ? hoverData.revenue : data[data.length - 1].revenue;
      const formattedValue = currencyFormatter(valueToDisplay);

      return (
            <div className="p-6 bg-white rounded-xl h-full">
                  
                  <p className="mt-2 text-3xl font-bold text-dark">
                        {formattedValue}
                  </p>

                  {hoverData && (
                        <div className="bg-blue-50/80 backdrop-blur-sm rounded-lg py-1 px-3 text-center mb-2 transition-opacity duration-200">
                              <p className="text-xs text-dark">{hoverData.date}</p>
                              <p className="text-base font-bold text-dark">
                                    {currencyFormatter(hoverData.revenue)}
                              </p>
                        </div>
                  )}

                  {/* Conteneur pour le graphique */}
                  <div className="w-full h-64 mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                    data={data}
                                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                                    onMouseMove={handleTooltipChange}
                                    onMouseLeave={() => setHoverData(null)}
                                    className='border-0'
                                    responsive
                              >
                                    <defs>
                                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#26D0FF" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#26D0FF" stopOpacity={0}/>
                                          </linearGradient>
                                    </defs>
                                    
                                    <XAxis 
                                          dataKey="date" 
                                          stroke="#26D0FF" 
                                          axisLine={false} 
                                          tickLine={false}
                                          interval="preserveStartEnd" 
                                          padding={{ left: 10, right: 10 }}
                                    />

                                    <Tooltip />

                                    <Area
                                          type="monotone" 
                                          dataKey="revenue"
                                          stroke="#26D0FF" 
                                          strokeWidth={2}
                                          fill="url(#colorRevenue)" 
                                          dot={false} 
                                    />


                              </AreaChart>
                        </ResponsiveContainer>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                        Affichage des données cumulées : {data[0].date} - {data[data.length - 1].date}
                  </p>
            </div>
      );
};

export default BarchartComponent;
