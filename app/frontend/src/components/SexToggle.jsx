import { Toggle } from "radix-ui";

function SexToggle({ selectedSexes, setSelectedSexes }) {
  const handleChange = (value) => {
    setSelectedSexes((prev) => prev.includes(value) ? prev.filter((v) => v!== value ) : [...prev, value])
  };

  return (
    <div className="flex gap-4">
      <label>Sex:</label>
      <Toggle.Root
        value="M"
        className="bg-white text-blue-900 px-4 h-[35px] rounded flex items-center justify-center text-[15px] leading-none shadow-md hover:bg-blue-50 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900"
        aria-label="Male"
        pressed={selectedSexes?.includes('M')}
        onPressedChange={() => handleChange("M")}
      >
        Male
      </Toggle.Root>

      <Toggle.Root
        value="F"
        className="bg-white text-blue-900 px-4 h-[35px] rounded flex items-center justify-center text-[15px] leading-none shadow-md hover:bg-blue-50 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900"
        aria-label="Female"
        pressed={selectedSexes?.includes('F')}
        onPressedChange={() => handleChange("F")}
      >
        Female
      </Toggle.Root>

      
    </div>
  );
}

export default SexToggle;
