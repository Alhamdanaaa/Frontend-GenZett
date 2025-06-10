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

// Tipe data untuk Dashboard - Super Admin
export type DailyReservation = {
  DATE: string;
  total_reservasi: number;
}

export type ReservasiPerCabang = {
  locationName: string;
  total_reservasi: number;
}

export type DashboardData = {
  total_lapangan: number;
  total_cabang: number;
  total_admin: number;
  total_cabor: number;
  daily_reservations: DailyReservation[];
  reservasi_per_cabang: ReservasiPerCabang[];
};

// Tipe data untuk Dashboard - Admin
export interface ReservationPerHari {
  date: string; // Format: "2025-03-01"
  total_reservasi: number;
}

export interface AdminDashboardData {
  total_lapangan: number;
  total_paket_langganan: number;
  total_pesanan_langganan_bulan_ini: number;
  reservasi_per_hari: ReservationPerHari[];
}

// Tipe data untuk Location
export type Location = {
  locationId: number;
  imageUrl: string;
  locationName: string;
  sports: string[];
  countLap: number;
  description: string;
  address: string;
  created_at: string;
  updated_at: string;
};

// Tipe data untuk sport
export type Sport = {
  sportId: number;
  sportName: string;
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
  startHour: string;
  endHour: string;
  description: string;
  created_at: string;
  updated_at: string;
};

// Tipe data User
export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  // password: string;
  // created_at: string;
  // updated_at: string;
};

// Tipe data Admin
// Untuk tampilan/listing dari API (GET /admins)
export type AdminOutput = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string; // lokasi dalam bentuk nama
  // created_at: string;
  // updated_at: string;
};

// Untuk input saat create admin (POST /admins)
export type AdminCreateInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  locationId: number;
};

// Untuk input saat edit admin (PUT /admins/:id)
export type AdminUpdateInput = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  locationId?: number;
};

interface ReservationDetail {
  reservationId: number;
  fieldName: string;
  time: string;
  date: string;
}
interface Cancellation {
  cancellationId: number,
  reservationId: number,
  accountName: string,
  accountNumber: string,
  paymentPlatform: string,
  reason: string,
  created_at: string,
  updated_at: string
}
// Tipe data Reservation
export interface Reservation {
  reservationId: number;
  name: string;
  paymentStatus: string;
  total: number;
  created_at: string;
  updated_at: string;
  status: string;
  details: ReservationDetail[];
  cancellation: Cancellation | null;
  remainingPayment: number;
  // Tambahkan property fieldData
  fieldData: {
    fieldId?: number;
    fieldName: string;
    timeIds?: number[];
    times: string[];
    dates: string[];
  }[];
}


// Tipe data Schedule
export type Schedule = {
  locationId: number;
  name: string;
  date: string;
  fieldTime: string;
  fieldName: string;
  sport: string;
  paymentStatus: 'pending' | 'dp' | 'complete' | 'closed';
};

// Tipe data Membership
export type Membership = {
  membershipId: number;
  name: string;
  description: string;
  locationId: number;
  sportId: number;
  discount: number;
  weeks: number;
};

export type MembershipWithNames = Membership & {
  locationName: string;
  sportName: string;
};

// Tipe data Time 
export type Time = {
  timeId: number;
  fieldId: number;
  time: string;
  status: 'available' | 'booked';
  price: number;
  created_at: string;
  updated_at: string;
}

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
