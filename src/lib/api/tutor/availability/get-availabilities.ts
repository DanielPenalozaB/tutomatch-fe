//18/05/2025

import { fetchApi } from '../../api';

export interface Availability {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
}

export const getAvailabilities = async (token: string): Promise<Availability[]> => await fetchApi<Availability[]>('/availabilities', {
  method: 'GET'
}, token);
