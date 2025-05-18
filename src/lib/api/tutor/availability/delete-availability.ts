// lib/api/tutor/availability/delete-availability.ts
import { fetchApi } from '../../api';

export const deleteAvailability = async (id: number, token: string): Promise<void> => {
  await fetchApi(`/availabilities/${id}`, {
    method: 'DELETE',
  }, token);
};
