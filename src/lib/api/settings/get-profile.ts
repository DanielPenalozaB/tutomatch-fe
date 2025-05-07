import { AppRole } from '@/config/routes';
import { fetchApi } from '../api';

export interface ProfileResponse {
  id: number;
  email: string;
  name: string;
  role: AppRole;
  profilePicture: string | null;
  bio: string | null;
  studentCode: string | null;
  academicProgram: string | null;
  semester: number | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch user profile (requires authentication)
 * @param token - The JWT access token
 */
export const getProfile = async (token?: string): Promise<ProfileResponse> => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return await fetchApi<ProfileResponse>('/auth/profile', {
    method: 'GET'
  }, token);
};