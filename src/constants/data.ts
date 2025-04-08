import { NavItem } from '@/types';
// import { MapPin } from 'lucide-react';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Tipe data untuk Location
export type Location = {
  id: number;
  img: string;
  name: string;
  sports: string[];
  countLap: number;
  desc: string;
  address: string;
  created_at: string;
  updated_at: string;
};

// Tipe data untuk sport
export type Sport = {
  id: number;
  name: string;
  countLocation: number;
  description: string;
  created_at: string;
  updated_at: string;
};

export type Field = {
  id: number;
  name: string;
  location: string;
  sport: string;
  jamMulai: string;
  jamTutup: string;
  description: string;
  created_at: string;
  updated_at: string;
};


//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Location',
    url: '/dashboard/location',
    icon: 'location',
    shortcut: ['l', 'l'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Field',
    url: '/dashboard/field',
    icon: 'field',
    shortcut: ['f', 'f'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Sports',
    url: '/dashboard/sport',
    icon: 'sport',
    shortcut: ['s', 's'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Users',
    url: '#', // Placeholder as there is no direct link for the parent
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
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
