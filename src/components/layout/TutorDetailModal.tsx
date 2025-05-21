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
  // ...otros campos
};

export default function TutorDetailModal({ tutor, onClose }: { tutor: Tutor | null; onClose: () => void }) {
  if (!tutor) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">{tutor.name}</h2>
        <p><b>Materia:</b> {tutor.subject}</p>
        <p><b>Modalidad:</b> {tutor.modality}</p>
        <p><b>Horario:</b> {tutor.schedule}</p>
        <p><b>Días:</b> {tutor.days.join(", ")}</p>
        <p><b>Calificación:</b> {tutor.rating}</p>
        {/* Agrega más detalles aquí */}
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-3 py-1 rounded">Cerrar</button>
      </div>
    </div>
  );
}