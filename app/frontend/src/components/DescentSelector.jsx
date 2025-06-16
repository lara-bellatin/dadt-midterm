import { useEffect, useState } from "react";
import axios from "axios";
import { Select, SelectItem } from "./ui/Select";

function DescentSelector({ setSelectedDescent }) {
  const [descents, setDescents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/descents`);
      setDescents(response.data);
    };
    fetchData();
  }, []);

  const handleChange = (value) => {
    if (value === "all") {
      setSelectedDescent(null)
    } else {
      setSelectedDescent(value)
    }
  };

  return (
    <div className="flex gap-4">
      <label>Descent:</label>
      <Select
        onValueChange={handleChange}
        defaultValue="all"
        placeholder={`Select Victim Descent`}
      >
        <SelectItem key="all" value="all">All Descents</SelectItem>
        {descents?.map((d) => {
          return (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          )
        })}
      </Select>
    </div>
  );
}

export default DescentSelector;
