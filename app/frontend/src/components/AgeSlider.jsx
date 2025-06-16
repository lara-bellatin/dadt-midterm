import { Slider } from "./ui/Slider";

function AgeSlider({ selectedAgeRange, setSelectedAgeRange }) {
  const handleChange = (value) => {
    setSelectedAgeRange(value)
  };

return (
    <div className="flex gap-4">
      <label>Victim Age:</label>
      <span>{selectedAgeRange[0]}</span>
      <Slider
        defaultValue={[0, 100]}
        min={0} max={100}
        minStepsBetweenThumbs={1}
        onValueChange={handleChange}
      />
      <span>{selectedAgeRange[1]}</span>
    </div>
  );
}

export default AgeSlider;
