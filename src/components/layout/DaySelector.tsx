type DaySelectorProps = {
  selectedDays: string[];
  onChange: (days: string[]) => void;
};

const daysOfWeek = [ 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo' ];

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDays, onChange }) => (
  <div>
    <label className="block text-sm font-medium">Días de la semana</label>
    <div className="flex flex-wrap gap-2 mt-1">
      {daysOfWeek.map((day) => (
        <label key={day} className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={selectedDays.includes(day)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([ ...selectedDays, day ]);
              } else {
                onChange(selectedDays.filter((d) => d !== day));
              }
            }}
          />
          {day}
        </label>
      ))}
    </div>
  </div>
);

export default DaySelector;