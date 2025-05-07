'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';

export function useSession() {
  const session = useNextAuthSession();

  return {
    ...session,
    user: session.data?.user,
    isAdmin: session.data?.user?.role === 'admin',
    isStudent: session.data?.user?.role === 'student',
    isTeacher: session.data?.user?.role === 'teacher',
    accessToken: session.data?.accessToken
  };
}