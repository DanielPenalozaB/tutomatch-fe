import { PaginatedResponse } from '@/types/pagination';
import { fetchApi } from '../../api';

export interface TutoringOfferResponse {
    id: number;
    subjectId: number;
    subjectName: string;
    modality: 'presential' | 'virtual' | 'mixed';
    topicsDescription: string;
    isActive: boolean;
    sessionType: 'individual' | 'group';
    location: null | string;
    meetingLink: null | string;
    hourlyRate: string;
    tutorId: number;
    tutorName: string;
    tutorProfilePicture: null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Fetch tutoring offers (requires authentication)
 * @param token - The JWT access token
 */
export const getTutoringOffers = async (
  token?: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<TutoringOfferResponse>> => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return await fetchApi<PaginatedResponse<TutoringOfferResponse>>(`/tutoring-offers?page=${page}&limit=${limit}`, {
    method: 'GET'
  }, token);
};