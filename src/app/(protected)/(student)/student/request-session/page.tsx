'use client';

import { useState } from "react";

interface FormState {
  slot: string;
  topic: string;
  mode: string;
}

interface RequestData extends FormState {
  id: number;
  status: "pendiente" | "aprobada" | "cancelada";
}

const initialSlots = [
  "2025-05-22 10:00",
  "2025-05-22 12:00",
  "2025-05-23 09:00",
  "2025-05-23 15:00",
];

export default function RequestTutoring() {
  const [form, setForm] = useState<FormState>({
    slot: "",
    topic: "",
    mode: "virtual",
  });
  const [submitted, setSubmitted] = useState(false);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [counter, setCounter] = useState(1);

  // Calcular horarios disponibles
  const availableSlots = initialSlots.filter(
    (slot) => !blockedSlots.includes(slot)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRequests((prev) => [
      ...prev,
      {
        ...form,
        id: counter,
        status: "pendiente",
      },
    ]);
    setCounter(counter + 1);
    setSubmitted(true);
    setBlockedSlots((prev) => [...prev, form.slot]);
  };

  const handleNewRequest = () => {
    setForm({ slot: "", topic: "", mode: "virtual" });
    setSubmitted(false);
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: 12,
        background: "#fafbfc",
        boxShadow: "0 2px 8px #0001",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Solicitar Tutoría</h1>
      {submitted ? (
        <div
          style={{
            background: "#eaffea",
            padding: 20,
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <h2>¡Solicitud enviada!</h2>
          <p>
            Tu solicitud para el horario <b>{form.slot}</b> ha sido enviada y está pendiente de aprobación.
          </p>
          <button
            onClick={handleNewRequest}
            style={{
              marginTop: 14,
              padding: "10px 18px",
              borderRadius: 6,
              border: "none",
              background: "#1e90ff",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            Solicitar otra tutoría
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Horario */}
          <label>
            Horario disponible:
            <select
              name="slot"
              value={form.slot}
              onChange={handleChange}
              required
              disabled={availableSlots.length === 0}
              style={{
                width: "100%",
                padding: "8px 6px",
                borderRadius: 5,
                border: "1px solid #bbb",
                marginTop: 4,
              }}
            >
              <option value="">Selecciona un horario</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>

          {/* Temas */}
          <label>
            Temas a tratar:
            <input
              name="topic"
              type="text"
              value={form.topic}
              onChange={handleChange}
              required
              placeholder="Ej: Álgebra, Programación..."
              style={{
                width: "100%",
                padding: "8px 6px",
                borderRadius: 5,
                border: "1px solid #bbb",
                marginTop: 4,
              }}
            />
          </label>

          {/* Modalidad */}
          <label>
            Modalidad:
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 6px",
                borderRadius: 5,
                border: "1px solid #bbb",
                marginTop: 4,
              }}
            >
              <option value="virtual">Virtual</option>
              <option value="presencial">Presencial</option>
              <option value="mixta">Mixta</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={availableSlots.length === 0}
            style={{
              padding: "12px 0",
              borderRadius: 6,
              border: "none",
              background: "#28b463",
              color: "white",
              fontWeight: "bold",
              fontSize: 17,
              cursor: availableSlots.length === 0 ? "not-allowed" : "pointer",
              marginTop: 6,
            }}
          >
            Solicitar tutoría
          </button>
          {availableSlots.length === 0 && (
            <p style={{ color: "red", textAlign: "center" }}>No hay horarios disponibles.</p>
          )}
        </form>
      )}

      {/* Lista de solicitudes enviadas */}
      {requests.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{textAlign: "center", marginBottom: 10}}>Solicitudes enviadas</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {requests.map((req) => (
              <li
                key={req.id}
                style={{
                  background: "#fff",
                  marginBottom: 10,
                  borderRadius: 6,
                  padding: 14,
                  border: "1px solid #e5e7eb",
                }}
              >
                <b>Horario:</b> {req.slot} <br />
                <b>Tema:</b> {req.topic} <br />
                <b>Modalidad:</b> {req.mode.charAt(0).toUpperCase() + req.mode.slice(1)} <br />
                <b>Estado:</b> <span style={{color: "#e67e22"}}>{req.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}