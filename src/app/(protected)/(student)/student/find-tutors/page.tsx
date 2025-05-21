'use client';

import { useState, useEffect } from 'react';
import ContentSection from '@/components/layout/content-section';
import DaySelector from '@/components/layout/DaySelector';
import RatingFilter from '@/components/layout/RatingFilter';
import { useDebouncedValue } from '@/components/layout/useDebouncedValue';

// ------------- Componentes auxiliares -----------------

// Paginador
type PaginatorProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};
function Paginator({ page, totalPages, onChange }: PaginatorProps) {
  return (
    <div className="flex gap-2 my-4 items-center">
      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>
      <span className="mx-2">Página {page} de {totalPages}</span>
      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}

// Selector de orden
type SortType = 'relevance' | 'hour' | 'rating';
function SortSelector({ value, onChange }: { value: SortType; onChange: (v: SortType) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium">Ordenar por</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value as SortType)}
        className="block w-full border rounded"
      >
        <option value="relevance">Relevancia</option>
        <option value="hour">Horario</option>
        <option value="rating">Calificación</option>
      </select>
    </div>
  );
}

// Modal de detalles del tutor
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
function TutorDetailModal({ tutor, onClose }: { tutor: Tutor | null; onClose: () => void }) {
  if (!tutor) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">{tutor.name}</h2>
        <p><b>Materia:</b> {tutor.subject}</p>
        <p><b>Modalidad:</b> {tutor.modality}</p>
        <p><b>Horario:</b> {tutor.schedule}</p>
        <p><b>Días:</b> {tutor.days.join(', ')}</p>
        <p><b>Calificación:</b> {tutor.rating}</p>
        <p><b>Hora inicio:</b> {tutor.hourStart}:00</p>
        <p><b>Hora fin:</b> {tutor.hourEnd}:00</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------

// Tipos para los filtros
type Filters = {
  subject: string;
  modality: string;
  name: string;
  days: string[];
  hourStart: string;
  hourEnd: string;
  minRating: number;
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
  {
    id: 2,
    name: 'Juan López',
    subject: 'Física',
    modality: 'presencial',
    schedule: 'Martes 2-4pm',
    days: ['Martes'],
    hourStart: 14,
    hourEnd: 16,
    rating: 4.2,
  },
  // Puedes agregar más tutores aquí...
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
  const [sort, setSort] = useState<SortType>('relevance');
  const debouncedFilters = useDebouncedValue(filters, 300);

  // Paginación
  const [page, setPage] = useState(1);
  const tutorsPerPage = 5;

  // Detalle de tutor
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  // Filtros y orden
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

    // Ordenar resultados
    if (sort === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sort === 'hour') {
      result = [...result].sort((a, b) => a.hourStart - b.hourStart);
    } // 'relevance' mantiene el orden original

    setFilteredTutors(result);
    setPage(1); // Resetear a la primera página cada vez que cambian los filtros/orden
  }, [debouncedFilters, sort]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredTutors.length / tutorsPerPage));
  const paginatedTutors = filteredTutors.slice(
    (page - 1) * tutorsPerPage,
    page * tutorsPerPage
  );

  // Asegúrate de que la página sea válida si cambian los resultados
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

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
            {/* Selector de orden */}
            <SortSelector value={sort} onChange={setSort} />
          </form>
        </div>
        {/* Resultados paginados */}
        <div>
          <h3 className="mb-2 font-semibold">Resultados:</h3>
          <Paginator page={page} totalPages={totalPages} onChange={setPage} />
          <ul className="space-y-2">
            {paginatedTutors.length === 0 && (
              <li className="text-gray-500">No hay tutores que coincidan con los filtros.</li>
            )}
            {paginatedTutors.map(tutor => (
              <li
                key={tutor.id}
                className="p-3 border rounded flex flex-col md:flex-row md:justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedTutor(tutor)}
                title="Ver detalles del tutor"
              >
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
          <Paginator page={page} totalPages={totalPages} onChange={setPage} />
        </div>
        {/* Modal detalle tutor */}
        <TutorDetailModal tutor={selectedTutor} onClose={() => setSelectedTutor(null)} />
      </div>
    </ContentSection>
  );
}