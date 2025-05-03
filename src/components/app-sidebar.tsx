import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Grid2X2PlusIcon } from "lucide-react"
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
