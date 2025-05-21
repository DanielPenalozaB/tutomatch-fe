import { fetchApi } from '../../api';

export interface CreateTutoringOfferDto {
    subjectId: number;
    modality: string;
    topicsDescription: string;
    sessionType: string;
    location?: string | null;
    meetingLink?: string | null;
    hourlyRate: number;
}

/**
 * Create a new tutoring offer (requires authentication)
 * @param data - Tutoring offer data to create
 * @param token - JWT access token
 */
export const createTutoringOffer = async (
  data: CreateTutoringOfferDto,
  token: string
) => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return fetchApi('/tutoring-offers', {
    method: 'POST',
    body: JSON.stringify(data)
  }, token);
};