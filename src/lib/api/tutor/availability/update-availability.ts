// lib/api/tutor/availability/update-availability.ts
import { fetchApi } from '../../api';

interface UpdateAvailabilityDto {
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export const updateAvailability = async (
  id: number,
  data: UpdateAvailabilityDto,
  token: string
) => {
  return fetchApi(`/availabilities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, token);
};
