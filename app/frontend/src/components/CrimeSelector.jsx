import { useEffect, useState } from "react";
import axios from "axios";
import { Select, SelectItem } from "./ui/Select";

function CrimeSelector({ setSelectedCrime, primary, crimeParts }) {
  const [crimes, setCrimes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/crimes`, {
        params: { primary, crimeParts }
      });
      setCrimes(response.data);
    };
    fetchData();
  }, [crimeParts]);

  const handleChange = (value) => {
    if (value === "all") {
      setSelectedCrime(null)
    } else {
      setSelectedCrime(value)
    }
  };

  return (
    <div className="flex gap-4">
      <label>{`${primary ? ' Primary' : ''} Crime:`}</label>
      <Select
        onValueChange={handleChange}
        defaultValue="all"
        placeholder={`Select${primary ? ' Primary' : ''} Crime`}
      >
        <SelectItem key="all" value="all">All Crimes</SelectItem>
        {crimes?.filter((c) => crimeParts ? crimeParts.includes(c.crime_part) : c).map((c) => {
          return (
            <SelectItem key={c.crime_code} value={c.crime_code}>
              {c.description}
            </SelectItem>
          )
        })}
      </Select>
    </div>
  );
}

export default CrimeSelector;
