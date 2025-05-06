'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RequireRole({
  children,
  allowedRoles,
  redirectTo = '/error?code=unauthorized'
}: RequireRoleProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
      return;
    }

    const hasPermission = allowedRoles.includes(session.user.role);
    if (!hasPermission) {
      router.push(redirectTo);
    }
  }, [session, status, allowedRoles, redirectTo, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || !allowedRoles.includes(session.user.role)) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}