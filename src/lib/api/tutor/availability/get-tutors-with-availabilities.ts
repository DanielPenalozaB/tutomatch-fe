export async function getAllTutorsWithAvailabilities(token?: string) {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch('/api/users/tutors-with-availabilities', {
    headers,
  });
  if (!res.ok) throw new Error('Error obteniendo tutores');
  return res.json();
}