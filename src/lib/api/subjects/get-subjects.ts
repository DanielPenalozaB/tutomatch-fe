import { fetchApi } from '../api';

export interface SubjectsResponse {
  id: number;
  name: string;
  code: string;
  description: string;
  credits: number;
  semester: number;
  isActive: boolean;
  academicProgram: Academic;
  academicArea: Academic;
  createdAt: Date;
  updatedAt: Date;
}

export interface Academic {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalSemesters?: number;
}

/**
 * Fetch user subjects (requires authentication)
 * @param token - The JWT access token
 */
export const getSubjects = async (token?: string): Promise<SubjectsResponse[]> => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return await fetchApi<SubjectsResponse[]>('/subjects', {
    method: 'GET'
  }, token);
};