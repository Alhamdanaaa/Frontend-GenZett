import { Location } from '@/constants/data';
import { fakeLocations } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { LocationTable } from './location-tables';
import { columns } from './location-tables/columns';

type LocationListingPage = {};

export default async function LocationListingPage({}: LocationListingPage) {
  console.log('SPORTS:', searchParamsCache.get('sports'));
console.log('ALL PARAMS:', searchParamsCache.all());

  // Penggunaan cache search params di Render Server Components
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const sports = searchParamsCache.get('sports');
  
  // // Gunakan query string asli untuk sports
  // const sports = typeof window !== 'undefined' 
  //   ? new URLSearchParams(window.location.search).get('sports') 
  //   : null;

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(sports && { sports: sports })
  };

  const data = await fakeLocations.getLocations(filters);
  const totalLocations = data.total_locations;
  const locations: Location[] = data.locations;

  return (
    <LocationTable
      data={locations}
      totalItems={totalLocations}
      columns={columns}
    />
  );
}