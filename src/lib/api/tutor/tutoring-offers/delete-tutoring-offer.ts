import { fetchApi } from '../../api';

/**
 * Delete tutoring offer (requires authentication)
 * @param id - The ID of the tutoring offer to delete
 * @param token - The JWT access token
 */
export const deleteTutoringOffer = async (id: number, token?: string) => {
  if (!token) throw new Error('Authentication required');
  return await fetchApi(`/tutoring-offers/${id}`, { method: 'DELETE' }, token);
};