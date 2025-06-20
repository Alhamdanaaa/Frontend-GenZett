import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}
export function getNavItemsByRole(role: string): NavItem[] {
  if (role === 'superadmin') {
    return [
      {
        title: 'Dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Lokasi Cabang',
        url: '/dashboard/location',
        icon: 'location',
        shortcut: ['l', 'l'],
        isActive: false,
        items: []
      },
      {
        title: 'Lapangan',
        url: '/dashboard/field',
        icon: 'field',
        shortcut: ['f', 'f'],
        isActive: false,
        items: []
      },
      {
        title: 'Cabang Olahraga',
        url: '/dashboard/sport',
        icon: 'sport',
        shortcut: ['s', 's'],
        isActive: false,
        items: []
      },
      {
        title: 'Paket Langganan',
        url: '/dashboard/membership',
        icon: 'member',
        shortcut: ['m', 'm'],
        isActive: false,
        items: []
      },
      {
        title: 'Pengguna',
        url: '#',
        icon: 'userPen',
        isActive: true,
        items: [
          {
            title: 'Admin',
            url: '/dashboard/admin',
            shortcut: ['a', 'a']
          },
          {
            title: 'User',
            url: '/dashboard/user',
            shortcut: ['u', 'u']
          }
        ]
      }
    ];
  }

  if (role === 'admin') {
    return [
      {
        title: 'Dashboard Admin',
        url: '/dashboard/overview-admin',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Reservasi Lapangan',
        url: '/dashboard/reservation',
        icon: 'reservation',
        shortcut: ['r', 'r'],
        isActive: false,
        items: []
      },
      {
        title: 'Pembatalan Reservasi',
        url: '/dashboard/cancellation',
        icon: 'cancellation',
        shortcut: ['b', 'b'],
        isActive: false,
        items: []
      },
      {
        title: 'Jadwal Lapangan',
        url: '/dashboard/schedule',
        icon: 'timeline',
        shortcut: ['l', 'l'],
        isActive: false,
        items: []
      },
      {
        title: 'Lapangan',
        url: '/dashboard/field',
        icon: 'field',
        shortcut: ['s', 's'],
        isActive: true,
        items: []
      },
      {
        title: 'Tutup Lapangan',
        url: '/dashboard/availability',
        icon: 'closed',
        shortcut: ['c', 'c'],
        isActive: true,
        items: []
      }
    ];
  }

  return [];
}
export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
