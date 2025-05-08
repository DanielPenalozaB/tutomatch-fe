import { fetchApi } from '../api';

export const sendPasswordResetEmail = async (email: string): Promise<void> => fetchApi<void>('/auth/forgot-password', {
  method: 'POST',
  body: JSON.stringify({ email })
});

export const resetPassword = async (token: string, newPassword: string): Promise<void> => fetchApi<void>('/auth/reset-password', {
  method: 'POST',
  body: JSON.stringify({ token, newPassword })
});