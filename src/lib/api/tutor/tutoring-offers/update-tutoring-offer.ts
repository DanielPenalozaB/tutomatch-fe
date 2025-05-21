import { fetchApi } from '../../api';

export interface UpdateTutoringOfferDto {
    subjectId: number;
    modality: string;
    topicsDescription: string;
    sessionType: string;
    location?: string | null;
    meetingLink?: string | null;
    hourlyRate: number;
}

/**
 * Update a tutoring offer (requires authentication)
 * @param id - The offer ID to update
 * @param data - Tutoring offer data to update
 * @param token - JWT access token
 */
export const updateTutoringOffer = async (
  id: number,
  data: UpdateTutoringOfferDto,
  token: string
) => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return fetchApi(`/tutoring-offers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }, token);
};