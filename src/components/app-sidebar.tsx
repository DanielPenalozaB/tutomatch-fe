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
} from "@/components/ui/sidebar"
import { GraduationCap, Grid2X2PlusIcon } from "lucide-react"
import { NavUser } from "./nav-user"

// Menu items.
const data = {
  admin: [
    {
      title: "Inicio",
      url: "#",
      icon: Grid2X2PlusIcon,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    }
  ],
  student: [
    {
      title: "Inicio",
      url: "/student",
      icon: Grid2X2PlusIcon,
      isActive: true,
    },
    {
      title: "Sesiones",
      url: "/sessions",
      icon: Grid2X2PlusIcon,
      isActive: true,
    },
  ]
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton
            size='lg'
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent active:bg-transparent'
          >
            <div className='text-sidebar-primary-foreground size-8 flex aspect-square items-center justify-center rounded-lg bg-cyan-500'>
              <GraduationCap className='size-4' />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>
                TutoMatch
              </span>
              <span className='truncate text-xs'>Gestión de tutor&iacute;as</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Estudiante</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.student.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
