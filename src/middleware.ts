import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicRoutes = ['/login', '/register', '/error'];

// Role-based route access mapping
const routeAccess = {
  // Routes accessible by students and higher roles
  student: ['/student', '/profile', '/courses', '/profile'],

  // Routes accessible by tutors and higher roles
  tutor: ['/my-courses', '/students'],

  // Routes accessible only by admins
  admin: ['/', '/admin', '/users', '/settings']
};

// Role hierarchy (higher roles can access lower role routes)
const roleHierarchy = {
  admin: ['admin', 'tutor', 'student'],
  tutor: ['tutor', 'student'],
  student: ['student']
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, api routes, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = token?.role as string || '';

  // Allow access to public routes regardless of authentication
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    // Special case: Redirect authenticated users away from login
    if (pathname === '/login' && isAuthenticated) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'admin':
          return NextResponse.redirect(new URL('/admin', request.url));
        case 'tutor':
          return NextResponse.redirect(new URL('/my-courses', request.url));
        default: // 'student' or any other role
          return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return NextResponse.next();
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check role-based access
  let hasAccess = false;

  // Get accessible routes for the user's role
  const accessibleRoles = roleHierarchy[userRole as keyof typeof roleHierarchy] || [];

  // Check if the path matches any of the accessible routes
  for (const role of accessibleRoles) {
    const routes = routeAccess[role as keyof typeof routeAccess] || [];
    if (routes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
      hasAccess = true;
      break;
    }
  }

  // Deny access if the user doesn't have permission
  if (!hasAccess) {
    return NextResponse.redirect(new URL('/error?code=unauthorized', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};