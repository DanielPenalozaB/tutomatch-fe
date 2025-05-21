// src/lib/api/tutor/tutoring-offers/get-tutoring-offer.ts
import { fetchApi } from '../../api';
import { TutoringOfferResponse } from './get-tutoring-offers';

/**
 * Fetch a single tutoring offer (requires authentication)
 * @param token - The JWT access token
 * @param id - The offer ID
 */
export const getTutoringOffer = async (
  token: string,
  id: number
): Promise<TutoringOfferResponse> => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return await fetchApi<TutoringOfferResponse>(`/tutoring-offers/${id}`, {
    method: 'GET'
  }, token);
};