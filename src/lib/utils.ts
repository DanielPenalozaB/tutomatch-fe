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

export function getUserInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return ''; // Handle empty input
  }

  const words = name.trim().split(/\s+/); // Split by any whitespace

  if (words.length === 1) {
    // Single word: take first two letters
    return words[0].slice(0, 2).toUpperCase();
  } else if (words.length === 2) {
    // Two words: take first letter of each
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  // Three or more words: take first letter of first and third word
  return (words[0][0] + words[2][0]).toUpperCase();
}