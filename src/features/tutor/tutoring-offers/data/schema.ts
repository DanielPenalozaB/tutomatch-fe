import { z } from 'zod';

export type TutoringOfferFormValues = z.infer<typeof tutoringOfferFormSchema>;

export const tutoringOfferFormSchema = z.object({
  subjectId: z.number().min(1, 'Debes seleccionar una asignatura'),
  modality: z.enum([ 'presential', 'virtual', 'mixed' ], {
    required_error: 'Debes seleccionar una modalidad'
  }),
  topicsDescription: z.string().min(10, {
    message: 'La descripción debe tener al menos 10 caracteres'
  }),
  sessionType: z.enum([ 'individual', 'group' ], {
    required_error: 'Debes seleccionar un tipo de sesión'
  }),
  location: z.string().optional().nullable(),
  meetingLink: z.string().url('Debe ser una URL válida').optional().nullable(),
  hourlyRate: z.string().min(1, 'La tarifa debe ser positiva')
});