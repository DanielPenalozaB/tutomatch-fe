'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';
import { useMemo } from 'react';

export function useSession() {
  const session = useNextAuthSession();

  return useMemo(() => ({
    ...session,
    user: session.data?.user,
    isAdmin: session.data?.user?.role === 'admin',
    isStudent: session.data?.user?.role === 'student',
    isTutor: session.data?.user?.role === 'tutor',
    accessToken: session.data?.accessToken
  }), [ session ]);
}