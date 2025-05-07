import { Separator } from '@/components/ui/separator';
import { BellIcon, UserIcon } from 'lucide-react';
import { Main } from '@/components/layout/main';
import SidebarNav from '@/components/layout/sidebar-nav';

export default function SettingsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Main fixed>
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Configuraci&oacute;n
        </h1>
        <p className='text-muted-foreground'>
          Gestiona las configuraciones de tu cuenta.
        </p>
      </div>
      <Separator className='my-4 lg:my-6' />
      <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <aside className='top-0 lg:sticky lg:w-1/5'>
          <SidebarNav  items={sidebarNavItems} />
        </aside>
        <div className='flex w-full overflow-y-hidden p-1'>
          {children}
        </div>
      </div>
    </Main>
  );
}

const sidebarNavItems = [
  {
    title: 'Perfil',
    icon: <UserIcon size={18} />,
    href: '/settings'
  },
  {
    title: 'Notificaciones',
    icon: <BellIcon size={18} />,
    href: '/settings/notifications'
  }
];
