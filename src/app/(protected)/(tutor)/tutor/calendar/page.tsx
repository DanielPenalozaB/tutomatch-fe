'use client';

import { useState } from 'react';
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay
} from 'date-fns';
import { motion } from 'framer-motion';
import { createAvailability, CreateAvailabilityDto } from '@/lib/api/tutor/availability/create-availability';
import { useSession } from '@/hooks/use-session';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Availability, getAvailabilities } from '@/lib/api/tutor/availability/get-availabilities';
import { updateAvailability } from '@/lib/api/tutor/availability/update-availability';
import { deleteAvailability } from '@/lib/api/tutor/availability/delete-availability';



export default function Calendar() {
  const user = useSession();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string>('10');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [scheduledSession, setScheduledSession] = useState<Date | null>(null);
  const [fetchedAvailability, setFetchedAvailability] = useState<Record<string, { startTime: string, endTime: string }[]>>({});
  const [daySlots, setDaySlots] = useState<Availability[]>([]);





  // Actualización 14/05/2025

  useEffect(() => {
    const loadAvailabilities = async () => {
      if (!user?.accessToken || !selectedDate) return;

      const allAvailabilities = await getAvailabilities(user.accessToken);
      const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase();

      const filtered = allAvailabilities.filter(
        (av) => av.day.toLowerCase() === dayOfWeek
      );

      setDaySlots(filtered); // Guarda slots con id, startTime, endTime, etc.
    };

    loadAvailabilities();
  }, [user, selectedDate]); useEffect(() => {
    const loadAvailability = async () => {
      if (!user.user?.id || !user.accessToken) return;

      try {
        const availabilities = await getAvailabilities(user.accessToken);
        const grouped: Record<string, { startTime: string, endTime: string }[]> = {};

        availabilities.forEach((item) => {
          const day = item.day.charAt(0).toUpperCase() + item.day.slice(1); // 'monday' -> 'Monday'
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push({ startTime: item.startTime, endTime: item.endTime });
        });

        setFetchedAvailability(grouped);
      } catch (err) {
        console.error('Error loading availability:', err);
      }
    };


    loadAvailability();
  }, [user]);

  // Disponibilidad por día de la semana
  const availability: Record<string, string[]> = {
    Monday: ['08:00', '09:00', '10:00', '11:00'],
    Tuesday: ['14:00', '15:00'],
    Wednesday: ['08:00', '09:00'],
    Thursday: [],
    Friday: ['10:00', '11:00', '12:00'],
    Saturday: ['09:00', '10:00'],
    Sunday: [],
  };

  const handleCreate = async (date: Date) => {
    if (!date || !user.user?.id || !user.accessToken) return;

    const h = parseInt(selectedHour, 10);
    const m = parseInt(selectedMinute, 10);
    const newDate = new Date(date);
    newDate.setHours(h, m, 0, 0);

    const startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const endTime = `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const dayOfWeek = format(newDate, 'EEEE') as CreateAvailabilityDto['day'];
    const availableForDay = availability[dayOfWeek] || [];
    const dateString = format(newDate, 'yyyy-MM-dd');

    if (blockedDates.includes(dateString)) {
      toast.error('Esta fecha está bloqueada');
      return;
    }

    if (!availableForDay.includes(startTime)) {
      toast.error('Esta hora no está disponible para este día');
      return;
    }

    // 🚨 Validación de conflicto de horarios
    // 🚨 Validación de conflicto de horarios
    const dayAvailabilities: { startTime: string, endTime: string }[] = fetchedAvailability[dayOfWeek] || [];
    const newStart = h * 60 + m;
    const newEnd = (h + 1) * 60 + m;

    const hasConflict = dayAvailabilities.some((av) => {
      const [startH, startM] = av.startTime.split(':').map(Number);
      const [endH, endM] = av.endTime.split(':').map(Number);

      const existingStart = startH * 60 + startM;
      const existingEnd = endH * 60 + endM;

      return !(newEnd <= existingStart || newStart >= existingEnd); // Si no hay conflicto, el horario es válido
    });

    if (hasConflict) {
      toast.error('Ya existe una disponibilidad en ese horario');
      return;
    }


    try {
      const response = await createAvailability({
        tutorId: user.user.id,
        day: dayOfWeek.toLowerCase() as CreateAvailabilityDto['day'],
        startTime,
        endTime,
      }, user.accessToken);

      setScheduledSession(newDate);
      toast.success('Disponibilidad Registrada', {
        description: `Disponibilidad creada para el ${dayOfWeek} de ${startTime} a ${endTime}`
      });
    } catch (error) {
      console.error(error);
      toast.error('Error de agendamiento');
    }
  };



  // Fechas bloqueadas//
  const blockedDates = ['2025-05-11'];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => (
    <div className="flex justify-between items-center py-4">
      <button onClick={prevMonth} className="bg-blue-200 px-4 py-2 rounded-xl">&#60;</button>
      <h2 className="text-xl font-bold text-blue-700">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={nextMonth} className="bg-blue-200 px-4 py-2 rounded-xl">&#62;</button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = new Date();
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-blue-600 font-semibold">
          {format(addDays(startOfWeek(date), i), 'EEE')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);



    const rows = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const dateString = format(day, 'yyyy-MM-dd');
        const cloneDay: Date = new Date(day.getTime());
        const isBlocked = blockedDates.includes(dateString);
        const hasAvailability = fetchedAvailability[format(day, 'EEEE')]?.length > 0;

        weekDays.push(
          <div
            className={`p-2 h-20 border text-center rounded-lg transition-all duration-150 cursor-pointer 
            ${!isSameMonth(day, monthStart) ? 'text-gray-400' : ''} 
            ${selectedDate && isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'} 
            ${isBlocked ? 'bg-red-100 text-red-500 cursor-not-allowed' : ''} 
            ${hasAvailability ? 'border-2 border-green-400' : ''}`
            }
            key={day.toISOString()}
            onClick={() => {
              if (!isBlocked) {
                setSelectedDate(cloneDay);
                setScheduledSession(null);
              }
            }}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toISOString()}>
          {weekDays}
        </div>
      );
    }
    return <div>{rows}</div>;
  };

  const renderFooter = () => {
    const dayOfWeek = selectedDate ? format(selectedDate, 'EEEE') : '';
    const availableHours = dayOfWeek ? availability[dayOfWeek] || [] : [];
    const slotsForDay = fetchedAvailability[dayOfWeek] || [];

    return (
      <div className="mt-4">
        {selectedDate && !scheduledSession && (
          <div className="text-blue-800 font-semibold space-y-4">

            <div>Fecha seleccionada: {format(selectedDate, 'dd/MM/yyyy')}</div>

            {/* Formulario de creación de disponibilidad */}
            {availableHours.length > 0 ? (
              <div className="flex gap-2 items-center">
                <label htmlFor="hour">Hora:</label>
                <select
                  id="hour"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-blue-300"
                >
                  {availableHours.map((hour) => (
                    <option key={hour} value={hour.split(':')[0]}>
                      {hour.split(':')[0]}
                    </option>
                  ))}
                </select>
                :
                <select
                  id="minute"
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-blue-300"
                >
                  {['00', '15', '30', '45'].map((min) => (
                    <option key={min} value={min}>{min}</option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-red-600">No hay disponibilidad para este día.</p>
            )}

            <center>
              <button
                className="mt-2 bg-blue-400 text-white px-4 py-2 rounded-xl hover:bg-blue-500"
                onClick={() => {
                  if (selectedDate) {
                    const h = parseInt(selectedHour, 10);
                    const m = parseInt(selectedMinute, 10);
                    const newDate = new Date(selectedDate);
                    newDate.setHours(h, m, 0, 0);
                    handleCreate(newDate);
                  }
                }}
              >
                Agendar Sesión
              </button>
            </center>

            {/* Horarios existentes */}
            {daySlots.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800 mt-4">
                  Horarios existentes para {dayOfWeek}
                </h4>
                {daySlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between border p-2 rounded-lg bg-white">
                    <span>{slot.startTime} - {slot.endTime}</span>
                    <div className="flex gap-2">
                      <button
                        className="text-sm bg-yellow-300 px-2 py-1 rounded"
                        onClick={() => {
                          setSelectedHour(slot.startTime.split(':')[0]);
                          setSelectedMinute(slot.startTime.split(':')[1]);
                          toast.info('Edita el horario y presiona "Guardar cambios"');
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={async () => {
                          if (!user?.accessToken) {
                            toast.error('No hay token de acceso disponible');
                            return;
                          }

                          try {
                            await deleteAvailability(slot.id, user.accessToken);
                            toast.success('Disponibilidad eliminada');
                            setDaySlots((prev) => prev.filter((s) => s.id !== slot.id));
                          } catch (err) {
                            toast.error('Error al eliminar la disponibilidad');
                            console.error(err);
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {/* Botón para guardar edición (actualizar horario) */}
            <center>
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                onClick={async () => {
                  if (!user?.accessToken) {
                    toast.error('No hay token de acceso disponible');
                    return;
                  }

                  const allAvailabilities = await getAvailabilities(user.accessToken);
                  const target = allAvailabilities.find(
                    (a) =>
                      a.day.toLowerCase() === dayOfWeek.toLowerCase() &&
                      a.startTime === `${selectedHour}:${selectedMinute}`
                  );
                  if (!target) return toast.error('No se encontró disponibilidad para editar');

                  const newStartTime = `${selectedHour}:${selectedMinute}`;
                  const newEndTime = `${String(parseInt(selectedHour, 10) + 1).padStart(2, '0')}:${selectedMinute}`;

                  try {
                    await updateAvailability(target.id, {
                      startTime: newStartTime,
                      endTime: newEndTime,
                    }, user.accessToken);

                    toast.success('Disponibilidad actualizada');

                    const updated = await getAvailabilities(user.accessToken);
                    const grouped: Record<string, { startTime: string, endTime: string }[]> = {};
                    updated.forEach((item) => {
                      const day = item.day.charAt(0).toUpperCase() + item.day.slice(1);
                      if (!grouped[day]) grouped[day] = [];
                      grouped[day].push({ startTime: item.startTime, endTime: item.endTime });
                    });
                    setFetchedAvailability(grouped);
                  } catch (err) {
                    toast.error('Error al actualizar disponibilidad');
                  }
                }}
              >
                Guardar cambios
              </button>
            </center>

          </div>
        )}

        {scheduledSession && (
          <div className="text-blue-700 font-semibold text-center">
            ✅ Sesión agendada para el {format(scheduledSession, 'dd/MM/yyyy')} a las {format(scheduledSession, 'HH:mm')}
          </div>
        )}

        {!selectedDate && !scheduledSession && (
          <p className="text-gray-600">Selecciona una fecha para agendar.</p>
        )}
      </div>
    );
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl w-full mx-auto p-6 bg-blue-50 rounded-2xl shadow-lg"
    >
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <div className="min-h-[120px] transition-all duration-300 ease-in-out">
      {renderFooter()}
      </div>
    </motion.div>
  );
}
