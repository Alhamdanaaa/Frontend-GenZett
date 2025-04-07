import { fakeLocations } from '@/constants/mock-api';
import { Location } from '@/constants/data';
import { notFound } from 'next/navigation';
import LocationForm from './location-form';

type TLocationViewPageProps = {
  locationId: string;
};

export default async function LocationViewPage({
  locationId
}: TLocationViewPageProps) {
  let location = null;
  let pageTitle = 'Tambah Lokasi Baru';

  if (locationId !== 'new') {
    const data = await fakeLocations.getLocationById(Number(locationId));
    location = data.location as Location;
    if (!location) {
      notFound();
    }
    pageTitle = `Edit Lokasi`;
  }

  return <LocationForm initialData={location} pageTitle={pageTitle} />;
}