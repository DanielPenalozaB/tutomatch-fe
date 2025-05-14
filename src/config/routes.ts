export const ROUTE_CONFIG = {
  // Rutas públicas (acceso sin autenticación)
  PUBLIC: [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password/[token]',
    '/about',
    '/contact',
    '/faq',
    '/privacy-policy',
    '/terms-of-service',
    '/error/[code]' // Ruta para páginas de error
  ],

  // Jerarquía de roles (roles superiores heredan accesos de roles inferiores)
  ROLE_HIERARCHY: {
    admin: [ 'admin', 'tutor', 'student' ],
    tutor: [ 'tutor', 'student' ],
    student: [ 'student' ],
    guest: [] // Usuario no autenticado
  },

  // Rutas por rol y rutas compartidas
  ROLE_PATHS: {
    // Rutas compartidas (accesibles por todos los roles autenticados)
    SHARED: [
      '/settings',
      '/settings/notifications',
      '/settings/password',
      '/messages',
      '/messages/[sessionId]',
      '/sessions',
      '/sessions/[sessionId]',
      '/sessions/[sessionId]/review',
      '/help'
    ],

    // Rutas específicas de estudiante
    student: [
      '/student',
      '/student/dashboard',
      '/student/find-tutors',
      '/student/find-tutors/[subjectId]',
      '/student/request-session/[tutorId]',
      '/student/my-sessions',
      '/student/my-sessions/upcoming',
      '/student/my-sessions/completed',
      '/student/my-sessions/cancelled',
      '/student/session-history',
      '/student/recommended-tutors',
      '/student/my-subjects',
      '/student/academic-progress',
      '/student/performance-reports'
    ],

    // Rutas específicas de tutor
    tutor: [
      '/tutor/dashboard',
      '/tutor/availability',
      '/tutor/availability/edit',
      '/tutor/availability/calendar',
      '/tutor/session-requests',
      '/tutor/session-requests/[requestId]',
      '/tutor/upcoming-sessions',
      '/tutor/session-history',
      '/tutor/session-reports',
      '/tutor/my-subjects',
      '/tutor/subject-management',
      '/tutor/profile/edit-tutor-profile',
      '/tutor/performance-metrics',
      '/tutor/ratings-reviews',
      '/tutor/group-sessions',
      '/tutor/group-sessions/create',
      '/tutor/group-sessions/[sessionId]',
      '/tutor/group-sessions/[sessionId]/manage'
    ],

    // Rutas específicas de administrador
    admin: [
      '/dashboard',
      '/admin/users',
      '/admin/users/[userId]',
      '/admin/users/create',
      '/admin/users/[userId]/edit',
      '/admin/users/[userId]/activity',
      '/admin/user-import',
      '/admin/tutoring-sessions',
      '/admin/tutoring-sessions/[sessionId]',
      '/admin/session-monitoring',
      '/admin/conflict-resolution',
      '/admin/subjects',
      '/admin/subjects/[subjectId]',
      '/admin/subjects/create',
      '/admin/subjects/[subjectId]/edit',
      '/admin/academic-programs',
      '/admin/reports',
      '/admin/reports/generate',
      '/admin/reports/[reportId]',
      '/admin/analytics/dashboard',
      '/admin/analytics/tutor-performance',
      '/admin/analytics/student-progress',
      '/admin/settings',
      '/admin/settings/global',
      '/admin/settings/notifications',
      '/admin/settings/academic-periods'
    ]
  },

  // Rutas por defecto para cada rol después de login
  DEFAULT_ROUTES: {
    admin: '/admin/dashboard',
    tutor: '/tutor/upcoming-sessions',
    student: '/student/my-sessions/upcoming',
    guest: '/auth/login'
  },

  // Códigos de error y sus rutas correspondientes
  ERROR_CODES: {
    unauthorized: {
      code: 403,
      title: 'Acceso no autorizado',
      message: 'No tienes permiso para acceder a esta página.'
    },
    not_found: {
      code: 404,
      title: 'Página no encontrada',
      message: 'La página que buscas no existe o ha sido movida.'
    },
    auth_required: {
      code: 401,
      title: 'Autenticación requerida',
      message: 'Debes iniciar sesión para acceder a este contenido.'
    },
    server_error: {
      code: 500,
      title: 'Error del servidor',
      message: 'Algo salió mal en nuestro servidor. Por favor intenta nuevamente.'
    }
  }
};

// Tipos para TypeScript
export type AppRole = keyof typeof ROUTE_CONFIG.ROLE_HIERARCHY;
export type ErrorCode = keyof typeof ROUTE_CONFIG.ERROR_CODES;