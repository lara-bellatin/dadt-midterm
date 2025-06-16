import { useEffect, useState } from 'react';
import axios from 'axios';
import CrimeSelector from './CrimeSelector';
import CrimePartToggle from './CrimePartToggle';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timesOfDay = ['Morning', 'Afternoon', 'Evening', 'Night']

function TimeHeatmap() {
  const [data, setData] = useState([]);
  const [selectedCrimeParts, setSelectedCrimeParts] = useState([1, 2]);
  const [selectedCrime, setSelectedCrime] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/crimes/time`, {
        params: { crimeParts: selectedCrimeParts, crime: selectedCrime }
      });
      setData(response.data);
    };
    fetchData();
  }, [selectedCrimeParts, selectedCrime]);

  const max = Math.max(...data.map(d => d.count || 0), 1);

  const matrix = days.map(day => {
    const row = { day };
    timesOfDay.forEach(time => {
      const match = data.find(d => d.day_of_week === day && d.time_of_day === time);
      row[time] = match ? match.count : 0;
    });
    return row;
  });

  return (
    <div className="space-y-4 my-6">
      <h1 className="text-2xl font-bold mb-4">Day of Week and Time of Day Distribution of Primary Crimes</h1>

      <div className="flex gap-5 align-center mb-5">
        <CrimePartToggle selectedCrimeParts={selectedCrimeParts} setSelectedCrimeParts={setSelectedCrimeParts} />
        <CrimeSelector setSelectedCrime={setSelectedCrime} primary={true} crimeParts={selectedCrimeParts} />
      </div>
      

      { data.length > 0 ?
        (<table className="table-auto border-collapse w-full text-xs">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="border px-2 py-1">Day \ Time of Day</th>
              {timesOfDay.map(h => (
                <th key={h} className="border px-1 py-1 text-center">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 font-medium bg-blue-50 text-blue-900 left-0 z-10">
                  {row.day}
                </td>
                {timesOfDay.map(h => {
                  const count = row[h];
                  const opacity = Math.min(1, count / max);
                  return (
                    <td
                      key={h}
                      className="border px-1 py-1 text-center"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                        color: opacity > 0.5 ? 'white' : 'black',
                      }}
                      title={`${count} crimes`}
                    >
                      {count > 0 ? count : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>)
        :
        <div className="h-[700px] text-center">No information available for selected filters</div>
      }
    </div>
  );
}

export default TimeHeatmap;
