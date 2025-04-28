import { Location } from '@/constants/data';
import { notFound } from 'next/navigation';
import LocationViewPageClient from './location-view-page-client';
import { fakeLocations } from '@/constants/mock-api';

interface LocationViewPageProps {
  locationId: string;
}

async function fetchLocation(locationId: string): Promise<Location | null> {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/${locationId}`, {
    //   cache: 'no-store'
    // });
    // if (!res.ok) {
    //   throw new Error('Location not found');
    // }
    // const data = await res.json();
    const data = await fakeLocations.getLocationById(Number(locationId));
    return data.location as Location;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function LocationViewPage({ locationId }: LocationViewPageProps) {
  let location: Location | null = null;
  let pageTitle = 'Tambah Lokasi Baru';

  if (locationId !== 'new') {
    location = await fetchLocation(locationId);
    if (!location) {
      notFound();
    }
    pageTitle = `Edit Lokasi - ${location.name}`;
  }

  return <LocationViewPageClient location={location} pageTitle={pageTitle} />;
}
