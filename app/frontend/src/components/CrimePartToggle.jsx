import { Toggle } from "./ui/Toggle";

function CrimePartToggle({ selectedCrimeParts, setSelectedCrimeParts }) {
  const handleChange = (value) => {
    setSelectedCrimeParts((prev) => prev.includes(value) ? prev.filter((v) => v!== value ) : [...prev, value])
  };

  return (
    <div className="flex gap-4">
      <label>Crime Part:</label>
      <Toggle
        value={1}
        pressed={selectedCrimeParts?.includes(1)}
        onPressedChange={() => handleChange(1)}
      >
        1
      </Toggle>

      <Toggle
        value={2}
        pressed={selectedCrimeParts?.includes(2)}
        onPressedChange={() => handleChange(2)}
      >
        2
      </Toggle>

      
    </div>
  );
}

export default CrimePartToggle;
