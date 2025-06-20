import { searchParamsCache } from '@/lib/searchparams';
import LocationTableWrapper from './location-table-wrapper';
import { getLocations } from '@/lib/api/location';
import { getAllSports } from '@/lib/api/sports';

export default async function LocationListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const sports = searchParamsCache.get('sport');

  const filters = {
    page: page?.toString(),
    limit: pageLimit?.toString(),
    ...(search && { search }),
    ...(sports && { sports: sports })
  };

  const data = await getLocations(filters);
  const sportData = await getAllSports();

  const sportOptions = sportData.map((sport: any) => ({
    label: sport.name,
    value: String(sport.id),
  }));

  return (
    <LocationTableWrapper
      data={data.locations}
      totalItems={data.totalLocations}
      sportOptions={sportOptions}
    />
  );
}