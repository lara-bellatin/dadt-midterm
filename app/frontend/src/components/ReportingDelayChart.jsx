import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import AgeSlider from "./AgeSlider";
import CrimePartToggle from "./CrimePartToggle";

function ReportingDelayChart() {
  const [data, setData] = useState([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState([0, 100]);
  const [selectedCrimeParts, setSelectedCrimeParts] = useState([1, 2]);

  useEffect(() => {
    const fetchData = async () => {
      const params = { ageRange: selectedAgeRange, crimeParts: selectedCrimeParts }
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/crimes/delay`, {
        params,
      });
      setData(response.data);
      // console.log(Math.max(...response.data.map(d => parseFloat(d.avg_delay_days))));
    };
    fetchData();
  }, [selectedAgeRange, selectedCrimeParts]);

  return (
    <div className="space-y-4 mb-5">
      <h1 className="text-2xl font-bold mb-4">Average Reporting Delay for Different Crimes</h1>

      <div className="flex gap-5 align-center mb-5">
        <CrimePartToggle selectedCrimeParts={selectedCrimeParts} setSelectedCrimeParts={setSelectedCrimeParts} />
        <AgeSlider selectedAgeRange={selectedAgeRange} setSelectedAgeRange={setSelectedAgeRange}/>
      </div>

      {data.length > 0 ?
        (<ResponsiveContainer width="100%" height={700}>
          <BarChart
            layout="vertical"
            data={data.map(r => { return { crime: r.crime, avg_delay_days: parseFloat(r.avg_delay_days) }})}
            margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
          >
            <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 30 }}/>
            <XAxis
              type="number"
            />
            <YAxis
              type="category"
              dataKey="crime"
              textAnchor="end"
              width={350}
            />
            <Tooltip />
            <Bar
              key="avg_delay_days"
              dataKey="avg_delay_days"
              fill="#5995F8"
              name="Average Reporting Delay (days)"
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>)
        :
        <div className="h-[700px] text-center">No information available for selected filters</div>
      }
    </div>
  );
}

export default ReportingDelayChart;