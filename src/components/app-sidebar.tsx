'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { BadgeCheck, Bell, BookCopy, Calendar, Calendar1Icon, CalendarCheck, ClockFading, FolderDown, GraduationCap, Grid2X2PlusIcon, Inbox, Search, User } from 'lucide-react';
import { NavUser } from './nav-user';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/use-session';
import { useMemo } from 'react';

// Menu items.
const data = {
  admin: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Grid2X2PlusIcon
    },
    {
      title: 'Usuarios',
      url: '/admin/users',
      icon: User
    },
    {
      title: 'Asignaturas',
      url: '/admin/subjects',
      icon: BookCopy
    },
    {
      title: 'Reportes',
      url: '/admin/reports',
      icon: FolderDown
    }
  ],
  tutor: [
    {
      title: 'Dashboard',
      url: '/tutor/dashboard',
      icon: Grid2X2PlusIcon
    },
    {
      title: 'Disponibilidad',
      url: '/tutor/availability',
      icon: CalendarCheck
    },
    {
      title: 'Ofertas de tutoría',
      url: '/tutor/tutoring-offers',
      icon: Inbox
    },
    {
      title: 'Peticiones de sesiones',
      url: '/tutor/session-requests',
      icon: Inbox
    },
    {
      title: 'Historial de sesiones',
      url: '/tutor/session-history',
      icon: ClockFading
    },
    {
      title: 'Mis asignaturas',
      url: '/tutor/my-subjects',
      icon: BookCopy
    }
  ],
  student: [
    {
      title: 'Dashboard',
      url: '/student/dashboard',
      icon: Grid2X2PlusIcon
    },
    {
      title: 'Tutores',
      url: '/student/find-tutors',
      icon: Search
    },
    {
      title: 'Mis sesiones',
      url: '/student/my-sessions',
      icon: Calendar
    },
    {
      title: 'Mis asignaturas',
      url: '/student/my-subjects',
      icon: BookCopy
    }
  ],
  settings: [
    {
      title: 'Perfil',
      url: '/settings',
      icon: BadgeCheck
    },
    {
      title: 'Notificaciones',
      url: '/settings/notifications',
      icon: Bell
    }
  ]
};

export function AppSidebar() {
  const session = useSession();
  const pathname = usePathname();

  // Memoize the admin, tutor, student, and settings menu items to prevent re-renders when unrelated state changes
  const adminMenu = useMemo(() => (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.admin.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ), [ pathname ]);

  const tutorMenu = useMemo(() => (
    <SidebarGroup>
      <SidebarGroupLabel>Tutor</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.tutor.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ), [ pathname ]);

  const studentMenu = useMemo(() => (
    <SidebarGroup>
      <SidebarGroupLabel>Estudiante</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.student.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ), [ pathname ]);

  const settingsMenu = useMemo(() => (
    <SidebarGroup>
      <SidebarGroupLabel>Configuración</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.settings.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ), [ pathname ]);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent active:bg-transparent">
            <div className="text-sidebar-primary-foreground size-8 flex aspect-square items-center justify-center rounded-lg bg-cyan-500">
              <GraduationCap className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">TutoMatch</span>
              <span className="truncate text-xs">Gestión de tutor&iacute;as</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {session.isAdmin && adminMenu}
        {session.isTutor && tutorMenu}
        {session.isStudent && studentMenu}
        <SidebarSeparator className='w-auto!' />
        {settingsMenu}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
