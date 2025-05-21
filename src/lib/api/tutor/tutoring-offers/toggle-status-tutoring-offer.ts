import { fetchApi } from '../../api';

interface ToggleTutoringOfferStatusResponse {
  id: 10,
  subjectId: 1,
  subjectName: 'Cálculo Diferencial',
  modality: 'virtual',
  topicsDescription: 'Hablaremos sobre...',
  isActive: true,
  sessionType: 'individual',
  location: '',
  meetingLink: 'https://meet.google.com/vs-d43-d5s',
  hourlyRate: '15.00',
  tutorId: 2,
  tutorName: 'Daniel Peñaloza',
  tutorProfilePicture: null,
  createdAt: '2025-05-21T02:20:39.510Z',
  updatedAt: '2025-05-22T02:59:48.227Z'
}

/**
 * Toggle the status of a tutoring offer (requires authentication)
 * @param id - The offer ID to update
 * @param token - JWT access token
 */
export const toggleTutoringOfferStatus = async (
  id: number,
  token?: string
): Promise<ToggleTutoringOfferStatusResponse> => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return fetchApi(`/tutoring-offers/${id}/toggle-status`, {
    method: 'PATCH'
  }, token);
};