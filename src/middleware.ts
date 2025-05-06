import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ROUTE_CONFIG, AppRole, ErrorCode } from './config/routes';

// Cache simple para rutas (opcional para mejorar rendimiento)
const routeCache = new Map<string, boolean>();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // 1. Saltar middleware para archivos estáticos, API, etc.
    if (shouldSkipMiddleware(pathname)) {
      return NextResponse.next();
    }

    // 2. Obtener información de autenticación
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;
    const userRole: AppRole = (token?.role as AppRole) || 'guest';

    // 3. Manejar rutas públicas
    if (isPublicRoute(pathname)) {
      return handlePublicRoute(request, pathname, isAuthenticated, userRole);
    }

    // 4. Verificar autenticación para rutas protegidas
    if (!isAuthenticated) {
      return redirectToLogin(request, pathname);
    }

    // 5. Verificar acceso a rutas basado en roles
    if (!hasRouteAccess(userRole, pathname)) {
      return redirectToError(request, 'unauthorized');
    }

    // 6. Aplicar headers de seguridad y continuar
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;

  } catch (error) {
    // Manejo centralizado de errores
    console.error('Middleware Error:', error);
    return redirectToError(request, 'server_error');
  }
}

// Helper Functions ------------------------------------------------------

function shouldSkipMiddleware(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname.includes('.') || // Archivos estáticos
    pathname === '/favicon.ico'
  );
}

function isPublicRoute(pathname: string): boolean {
  return ROUTE_CONFIG.PUBLIC.some(route => {
    // Manejo especial para rutas dinámicas como reset-password/[token]
    const baseRoute = route.includes('[') ? route.split('[')[0] : route;

    if (route.includes('[')) {
      return pathname.startsWith(baseRoute);
    }

    return pathname === route;
  });
}

function handlePublicRoute(
  request: NextRequest,
  pathname: string,
  isAuthenticated: boolean,
  userRole: AppRole
): NextResponse {
  // Redirigir usuarios autenticados que intentan acceder a rutas públicas de autenticación
  if (isAuthenticated && pathname.startsWith('/auth')) {
    if (userRole === 'guest') {
      throw new Error('Guest role is not supported');
    }
    const defaultRoute = getDefaultSharedRoute(userRole);
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  return NextResponse.next();
}

// Nueva función helper para obtener la primera ruta compartida según el rol
function getDefaultSharedRoute(userRole: keyof typeof ROUTE_CONFIG.ROLE_PATHS): string {
  // Primero intentamos con las rutas específicas del rol
  const roleSpecificRoutes = ROUTE_CONFIG.ROLE_PATHS[userRole] || [];
  if (roleSpecificRoutes.length > 0) {
    return roleSpecificRoutes[0];
  }

  // Si no hay rutas específicas, usamos la primera ruta compartida
  return ROUTE_CONFIG.ROLE_PATHS.SHARED[0] || '/dashboard';
}

function redirectToLogin(request: NextRequest, originalPath: string): NextResponse {
  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('callbackUrl', originalPath);
  return NextResponse.redirect(loginUrl);
}

function redirectToError(request: NextRequest, errorCode: ErrorCode): NextResponse {
  const errorInfo = ROUTE_CONFIG.ERROR_CODES[errorCode];
  const errorUrl = new URL(`/error/${errorCode}`, request.url);
  errorUrl.searchParams.set('from', request.nextUrl.pathname);

  // Podemos personalizar la respuesta basada en el tipo de error
  const response = NextResponse.redirect(errorUrl);

  // Para errores 500, podríamos notificar a un servicio de monitoreo
  if (errorInfo.code === 500) {
    // Aquí iría código para reportar el error (Sentry, LogRocket, etc.)
    console.error('Server error encountered at:', request.url);
  }

  return response;
}

function hasRouteAccess(userRole: AppRole, pathname: string): boolean {
  // Verificar cache primero
  const cacheKey = `${userRole}:${pathname}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  // 1. Verificar rutas compartidas
  const isSharedRoute = ROUTE_CONFIG.ROLE_PATHS.SHARED.some(route => 
    matchRoute(pathname, route)
  );

  if (isSharedRoute) {
    routeCache.set(cacheKey, true);
    return true;
  }

  // 2. Verificar rutas específicas de rol
  const accessibleRoles = ROUTE_CONFIG.ROLE_HIERARCHY[userRole] || [];

  const hasAccess = accessibleRoles.some(role => {
    const roleRoutes = ROUTE_CONFIG.ROLE_PATHS[role as keyof typeof ROUTE_CONFIG.ROLE_PATHS] || [];
    return roleRoutes.some(route => matchRoute(pathname, route));
  });

  routeCache.set(cacheKey, hasAccess);
  return hasAccess;
}

function matchRoute(pathname: string, routePattern: string): boolean {
  // Caso simple: ruta exacta
  if (pathname === routePattern) return true;

  // Ruta con parámetros dinámicos (ej: /users/[userId])
  const routeParts = routePattern.split('/');
  const pathParts = pathname.split('/');

  if (routeParts.length !== pathParts.length) return false;

  return routeParts.every((part, i) => {
    // Coincidir partes dinámicas como [param]
    if (part.startsWith('[') && part.endsWith(']')) return true;
    // Coincidir partes estáticas
    return part === pathParts[i];
  });
}

function addSecurityHeaders(response: NextResponse): void {
  // Headers de seguridad básicos
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');

  // CSP básico (ajustar según necesidades)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // ¡Cuidado con unsafe-inline en producción!
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' http://localhost:4000 ws://localhost:4000`,
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
}

// Configuración del Middleware ------------------------------------------
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     * - static assets (.*\..*)
     * - error page (para evitar bucles)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|public|error|.*\\..*).*)',
  ],
};