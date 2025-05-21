type SortType = "relevance" | "hour" | "rating";

export default function SortSelector({ value, onChange }: { value: SortType; onChange: (v: SortType) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium">Ordenar por</label>
      <select value={value} onChange={e => onChange(e.target.value as SortType)} className="block w-full border rounded">
        <option value="relevance">Relevancia</option>
        <option value="hour">Horario</option>
        <option value="rating">Calificación</option>
      </select>
    </div>
  );
}