'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

const segmentLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  overview: 'Ringkasan',
  'overview-admin': 'Ringkasan',
  new: 'Tambah',
  edit: 'Ubah',
  sport: 'Cabang Olahraga',
  location: 'Lokasi Cabang',
  field: 'Lapangan',
  membership: 'Paket Langganan',
  reservation: 'Reservasi',
  cancellation: 'Pembatalan Reservasi',
  schedule: 'Jadwal',
  admin: 'Admin',
  user: 'User',
  profile: 'Profil',
  availability: 'Penutupan Lapangan',
  'edit-profile': 'Ubah Profil',
  'edit-password': 'Ubah Password',
  '[id]': 'Ubah'
};

const routeMapping: Record<string, string[]> = {
  '/dashboard': ['dashboard'],
  '/dashboard/sport/[id]': ['dashboard', 'sport', '[id]'],
  '/dashboard/location/[id]': ['dashboard', 'location', '[id]'],
  '/dashboard/field/[id]': ['dashboard', 'field', '[id]'],
  '/dashboard/membership/[id]': ['dashboard', 'membership', '[id]'],
  '/dashboard/location/new': ['dashboard', 'location', 'new']
};

function isDynamicSegment(value: string) {
  // Daftar segment yang dikenal sebagai static
  const staticSegments = ['dashboard', 'overview', 'overview-admin', 'new', 'edit', 'sport', 'location', 'field', 'membership', 'reservation', 'cancellation', 'schedule', 'admin', 'user', 'profile', 'availability', 'edit-profile', 'edit-password'];
  return !staticSegments.includes(value);
}

function normalizeSegment(segment: string) {
  return isDynamicSegment(segment) ? '[id]' : segment;
}

function normalizePath(path: string) {
  const segments = path.split('/').filter(Boolean);
  return '/' + segments.map(normalizeSegment).join('/');
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const normalized = normalizePath(pathname);

    if (routeMapping[normalized]) {
      const segments = routeMapping[normalized];
      return segments.map((seg, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        return {
          title: segmentLabels[seg] || seg,
          link: index === segments.length - 1 ? '' : path
        };
      });
    }

    // fallback jika tidak ada di mapping
    const rawSegments = pathname.split('/').filter(Boolean);
    return rawSegments.map((seg, index) => {
      const normalizedSegment = normalizeSegment(seg);
      const path = '/' + rawSegments.slice(0, index + 1).join('/');
      return {
        title: segmentLabels[normalizedSegment] || seg.charAt(0).toUpperCase() + seg.slice(1),
        link: index === rawSegments.length - 1 ? '' : path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}