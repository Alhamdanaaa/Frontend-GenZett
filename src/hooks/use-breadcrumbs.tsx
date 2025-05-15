'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ],
  '/dashboard/sport': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Cabang Olahraga', link: '/dashboard/sport' }
  ],
  '/dashboard/location': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Lokasi Cabang', link: '/dashboard/location' }
  ],
  '/dashboard/field': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Lapangan', link: '/dashboard/field' }
  ],
  '/dashboard/membership': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Paket Langganan', link: '/dashboard/mambership' }
  ],
  '/dashboard/reservation': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Reservasi', link: '/dashboard/reservation' }
  ],
  '/dashboard/schedule': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Jadwal', link: '/dashboard/schedule' }
  ]
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
