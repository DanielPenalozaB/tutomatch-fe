import { fetchApi } from '../api';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (
  data: ChangePasswordRequest,
  token: string
): Promise<void> => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return fetchApi<void>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data)
  }, token);
};