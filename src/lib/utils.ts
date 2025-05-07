import { AppRole } from '@/config/routes';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormatedRole(role: AppRole | string | undefined) {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'tutor':
      return 'Profesor';
    case 'student':
      return 'Estudiante';
    default:
      return 'Invitado';
  }
}