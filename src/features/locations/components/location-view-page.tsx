// location-view-page.tsx - Lightweight version
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the form to reduce initial bundle size
const LocationForm = dynamic(
  () => import('./location-form'),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-6 bg-card rounded-lg shadow">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    )
  }
);

// Types
interface LocationViewPageProps {
  locationId: string;
}

interface Location {
  id: number;
  img: string;
  name: string;
  sports: string[];
  countLap: number;
  desc: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export default function LocationViewPage({ locationId }: LocationViewPageProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(locationId !== 'new');
  const [pageTitle, setPageTitle] = useState('Tambah Lokasi Baru');

  useEffect(() => {
    // Only fetch if it's not a new location
    if (locationId !== 'new') {
      setIsLoading(true);
      
      // Fetch location data
      fetch(`/api/locations/${locationId}`)
        .then(res => {
          if (!res.ok) throw new Error('Location not found');
          return res.json();
        })
        .then(data => {
          setLocation(data.location);
          setPageTitle(`Edit Lokasi - ${data.location.name}`);
        })
        .catch(err => {
          console.error('Failed to fetch location:', err);
          // You could redirect to a 404 page here
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [locationId]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-6 bg-card rounded-lg shadow">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  return <LocationForm initialData={location} pageTitle={pageTitle} />;
}