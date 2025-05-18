import { fetchApi } from '../../api';

export interface CreateAvailabilityDto {
  tutorId: number;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface AvailabilityResponse {
  id: number;
  tutor: {
    id: number;
    name: string;
    email: string;
  };
  day: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createAvailability = async (
  data: CreateAvailabilityDto,
  token: string
): Promise<AvailabilityResponse> => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  console.log('Data being sent to API:', data); 

  return fetchApi<AvailabilityResponse>('/availabilities', {
    method: 'POST',
    body: JSON.stringify(data)
  }, token);
};
