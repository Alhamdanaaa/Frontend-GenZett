import { NavItem } from '@/types';

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

// Tipe data User
export type User = {
  userId: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

// Tipe data Admin
export type Admin = {
  adminId: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  created_at: string;
  updated_at: string;
};


// Tipe data Reservation
export type Reservation = {
  reservationId: number;
  createTime: string;
  name: string;
  fieldTime: string;
  date: string;
  totalPayment: number;
  remainingPayment: number;
  paymentStatus: 'pending' | 'down payment' | 'complete' | 'fail';
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at: string;
  updated_at: string;
};

// Tipe data Schedule
export type Schedule = {
  reservationId: number;
  name: string;
  fieldTime: string;
  field: string;
  sport: string;
  date: string;
  paymentStatus: 'pending' | 'down payment' | 'complete';
};

// Tipe data Member
export type Membership = {
  membershipId: number;
  location: string;
  sport: string;
  name: string;
  description: string;
  discount: string;
  weeks: string;
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
    title: 'Lokasi Cabang',
    url: '/dashboard/location',
    icon: 'location',
    shortcut: ['l', 'l'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Lapangan',
    url: '/dashboard/field',
    icon: 'field',
    shortcut: ['f', 'f'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Cabang Olahraga',
    url: '/dashboard/sport',
    icon: 'sport',
    shortcut: ['s', 's'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Paket Langganan',
    url: '/dashboard/membership',
    icon: 'member',
    shortcut: ['m', 'm'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Pengguna',
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
    title: 'Dashboard admin',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Reservasi Lapangan',
    url: '/dashboard/reservation',
    icon: 'reservation',
    shortcut: ['r', 'r'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Jadwal Lapangan',
    url: '/dashboard/schedule',
    icon: 'timeline',
    shortcut: ['l', 'l'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Lapangan-admin',
    url: '/dashboard/field',
    icon: 'field',
    shortcut: ['s', 's'],
    isActive: false,
    items: [] // No child items
  },
  // {
  //   title: 'Anggota Member',
  //   url: '/dashboard/member',
  //   icon: 'user',
  //   shortcut: ['m', 'm'],
  //   isActive: false,
  //   items: [] // No child items
  // },
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
