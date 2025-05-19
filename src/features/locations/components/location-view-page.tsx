import { Location } from '@/constants/data';
import { notFound } from 'next/navigation';
import LocationViewPageClient from './location-view-page-client';
import { getLocationById } from '@/lib/api/location';

interface LocationViewPageProps {
  locationId: string;
}

async function fetchLocation(locationId: string): Promise<Location | null> {
  try {
    const data = await getLocationById(Number(locationId));
    return data as Location;
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
    pageTitle = `Edit Lokasi - ${location.locationName}`;
  }

  return <LocationViewPageClient location={location} pageTitle={pageTitle} />;
}
