'use client';

import { useState, useEffect } from 'react';
import ContentSection from '@/components/layout/content-section';
import DaySelector from '@/components/layout/DaySelector';
import RatingFilter from '@/components/layout/RatingFilter';
import { useDebouncedValue } from '@/components/layout/useDebouncedValue';

// Tipos para los filtros y tutores
type Filters = {
  subject: string;
  modality: string;
  name: string;
  days: string[];
  hourStart: string;
  hourEnd: string;
  minRating: number;
};

type Tutor = {
  id: number;
  name: string;
  subject: string;
  modality: string;
  schedule: string;
  days: string[];
  hourStart: number;
  hourEnd: number;
  rating: number;
};

// Simulación de datos...
const tutors: Tutor[] = [
  {
    id: 1,
    name: 'María Pérez',
    subject: 'Matemáticas',
    modality: 'virtual',
    schedule: 'Lunes 8-10am',
    days: ['Lunes'],
    hourStart: 8,
    hourEnd: 10,
    rating: 4.7,
  },
  // Más tutores...
];

const subjects = ['Matemáticas', 'Física', 'Química'];
const modalities = ['presencial', 'virtual', 'mixta'];

export default function FindTutorsPage() {
  const [filters, setFilters] = useState<Filters>({
    subject: '',
    modality: '',
    name: '',
    days: [],
    hourStart: '',
    hourEnd: '',
    minRating: 0,
  });
  const debouncedFilters = useDebouncedValue(filters, 300);

  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>(tutors);

  useEffect(() => {
    let result = tutors;

    if (debouncedFilters.subject) {
      result = result.filter(t => t.subject === debouncedFilters.subject);
    }
    if (debouncedFilters.modality) {
      result = result.filter(t => t.modality === debouncedFilters.modality);
    }
    if (debouncedFilters.name) {
      result = result.filter(t => t.name.toLowerCase().includes(debouncedFilters.name.toLowerCase()));
    }
    if (debouncedFilters.days.length > 0) {
      result = result.filter(t => t.days?.some(d => debouncedFilters.days.includes(d)));
    }
    if (debouncedFilters.hourStart) {
      result = result.filter(t => t.hourStart >= Number(debouncedFilters.hourStart));
    }
    if (debouncedFilters.hourEnd) {
      result = result.filter(t => t.hourEnd <= Number(debouncedFilters.hourEnd));
    }
    if (debouncedFilters.minRating) {
      result = result.filter(t => t.rating >= debouncedFilters.minRating);
    }

    setFilteredTutors(result);
  }, [debouncedFilters]);

  return (
    <ContentSection title="Buscar tutorías" desc="Utiliza los filtros para encontrar el tutor ideal.">
      <div>
        <div className="mb-4 p-4 bg-white rounded shadow">
          <form className="flex gap-4 flex-wrap">
            {/* Asignatura */}
            <div>
              <label className="block text-sm font-medium">Asignatura</label>
              <select
                value={filters.subject}
                onChange={e => setFilters(f => ({ ...f, subject: e.target.value }))}
                className="mt-1 block w-full border rounded"
              >
                <option value="">Todas</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            {/* Modalidad */}
            <div>
              <label className="block text-sm font-medium">Modalidad</label>
              <select
                value={filters.modality}
                onChange={e => setFilters(f => ({ ...f, modality: e.target.value }))}
                className="mt-1 block w-full border rounded"
              >
                <option value="">Todas</option>
                {modalities.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            {/* Nombre de tutor */}
            <div>
              <label className="block text-sm font-medium">Nombre de tutor</label>
              <input
                type="text"
                value={filters.name}
                onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
                className="mt-1 block w-full border rounded"
                placeholder="Buscar por nombre"
              />
            </div>
            {/* Filtro de días */}
            <DaySelector
              selectedDays={filters.days}
              onChange={(days: string[]) => setFilters(f => ({ ...f, days }))}
            />
            {/* Filtro de horario */}
            <div>
              <label className="block text-sm font-medium">Hora inicio</label>
              <input
                type="number"
                min={0}
                max={23}
                value={filters.hourStart}
                onChange={e => setFilters(f => ({ ...f, hourStart: e.target.value }))}
                className="mt-1 block w-20 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Hora fin</label>
              <input
                type="number"
                min={0}
                max={23}
                value={filters.hourEnd}
                onChange={e => setFilters(f => ({ ...f, hourEnd: e.target.value }))}
                className="mt-1 block w-20 border rounded"
              />
            </div>
            {/* Filtro de calificación */}
            <RatingFilter
              minRating={filters.minRating}
              onChange={(minRating: number) => setFilters(f => ({ ...f, minRating }))}
            />
          </form>
        </div>
        {/* Resultados */}
        <div>
          <h3 className="mb-2 font-semibold">Resultados:</h3>
          <ul className="space-y-2">
            {filteredTutors.length === 0 && (
              <li className="text-gray-500">No hay tutores que coincidan con los filtros.</li>
            )}
            {filteredTutors.map(tutor => (
              <li key={tutor.id} className="p-3 border rounded flex flex-col md:flex-row md:justify-between">
                <div>
                  <span className="font-bold">{tutor.name}</span> — {tutor.subject}
                  <div className="text-sm text-gray-600">{tutor.schedule}</div>
                </div>
                <div>
                  <span className="inline-block px-2 py-1 bg-blue-100 rounded mr-2">{tutor.modality}</span>
                  <span className="inline-block px-2 py-1 bg-yellow-100 rounded">⭐ {tutor.rating}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ContentSection>
  );
}