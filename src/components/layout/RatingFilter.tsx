import React from "react";

type RatingFilterProps = {
  minRating: number;
  onChange: (minRating: number) => void;
};

const RatingFilter: React.FC<RatingFilterProps> = ({ minRating, onChange }) => (
  <div>
    <label className="block text-sm font-medium">Calificación mínima</label>
    <input
      type="number"
      min={0}
      max={5}
      step={0.1}
      value={minRating}
      className="mt-1 block w-20 border rounded"
      onChange={e => onChange(Number(e.target.value))}
    />
  </div>
);

export default RatingFilter;