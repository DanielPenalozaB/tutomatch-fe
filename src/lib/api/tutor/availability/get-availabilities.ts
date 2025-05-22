
import { fetchApi } from '../../api';

export interface Availability {
  id: number;
  day: string; // 'monday', 'tuesday', etc.
  startTime: string; // '09:00'
  endTime: string;
}

export const getAvailabilities = async (token: string): Promise<Availability[]> => await fetchApi<Availability[]>('/availabilities', {
  method: 'GET'
}, token);
