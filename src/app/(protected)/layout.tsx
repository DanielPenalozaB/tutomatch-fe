import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout/header";
import { ProfileDropdown } from "@/components/profile-dropdown";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <Header>
        <div className='ml-auto flex items-center gap-4'>
          <ProfileDropdown />
        </div>
      </Header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
