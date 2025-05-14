'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getUserInitials } from '@/lib/utils';
import { BadgeCheck, Bell, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function ProfileDropdown() {
  const session = useSession();

  if (!session.data) {
    return null;
  }

  const user = session.data?.user;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='rounded-lg! relative h-8 w-8'>
          <Avatar className='rounded-lg! h-8 w-8'>
            <AvatarFallback className='rounded-lg!'>{getUserInitials(user.name || '')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name}</p>
            <p className='text-muted-foreground truncate text-xs leading-none'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/settings" title="Perfil" className="flex w-full items-center gap-2">
              <BadgeCheck />
                Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings/notifications" title="Notificaciones" className="flex w-full items-center gap-2">
              <Bell />
                Notificaciones
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
              Cerrar sesi&oacute;n
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
