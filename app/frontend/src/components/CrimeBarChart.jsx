import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DescentSelector from "./DescentSelector";
import SexToggle from "./SexToggle";

const COLORS = [
  "#60a5fa", // blue
  "#f87171", // red
  "#34d399", // green
  "#facc15", // yellow
  "#a78bfa", // purple
  "#fb923c", // orange
  "#6ee7b7", // teal
];

function CrimeBarChart() {
  const [data, setData] = useState([]);
  const [weaponTypes, setWeaponTypes] = useState([]);
  const [selectedSexes, setSelectedSexes] = useState(["M", "F"]);
  const [selectedDescent, setSelectedDescent] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const params = { sex: selectedSexes, descent: selectedDescent }
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/crimes/weapons`, {
        params,
      });
      setData(response.data.data);
      setWeaponTypes(response.data.weaponTypes);
    };
    fetchData();
  }, [selectedSexes, selectedDescent]);

  return (
    <div className="space-y-4 mb-5">
      <h1 className="text-2xl font-bold mb-4">Most Common Weapons Used in Different Crimes</h1>

      <div className="flex gap-5 align-center mb-5">
        <SexToggle selectedSexes={selectedSexes} setSelectedSexes={setSelectedSexes} />
        <DescentSelector setSelectedDescent={setSelectedDescent} />
      </div>

      {data.length > 0 ?
        (<ResponsiveContainer width="100%" height={700}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
          >
            <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 30 }}/>
            <XAxis
              type="number"
            />
            <YAxis
              type="category"
              dataKey="crime"
              width={350}
            />
            <Tooltip />
            {weaponTypes?.map((weapon, index) => (
              <Bar
              key={weapon}
              dataKey={weapon}
              stackId="a"
              fill={COLORS[index % COLORS.length] || "#8884d8"}
              name={weapon}
              barSize={35}
            />
            ))}
          </BarChart>
        </ResponsiveContainer>)
        :
        <div className="h-[700px] text-center">No information available for selected filters</div>
      }
    </div>
  );
}

export default CrimeBarChart;
