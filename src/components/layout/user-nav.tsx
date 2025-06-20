'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useLogout, getUser } from '@/lib/api/auth';
import { useEffect, useState } from 'react';

export function UserNav() {
  const [user, setUser] = useState<ReturnType<typeof getUser> | null>(null);
  const { handleLogout } = useLogout();

  useEffect(() => {
    const data = getUser();
    setUser(data);
  }, []);

  if (!user) return null;

  return (
    <DropdownMenu>
      {/* <DropdownMenuTrigger asChild>
      </DropdownMenuTrigger> */}
      <DropdownMenuContent
        className='w-56'
        align='end'
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{user.name}</p>
            <p className='text-muted-foreground text-xs leading-none'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => window.location.href = '/dashboard/profile'}>
            Profil akun
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
