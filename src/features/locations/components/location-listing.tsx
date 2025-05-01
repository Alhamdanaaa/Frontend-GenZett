import { fakeLocations } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import LocationTableWrapper from './location-table-wrapper';

const getColumns = async () => {
  const { columns } = await import('./location-tables/columns');
  return columns;
};

export default async function LocationListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const sports = searchParamsCache.get('sport');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(sports && { sports: sports })
  };

  const data = await fakeLocations.getLocations(filters);
  const columns = await getColumns();

  return (
    <LocationTableWrapper
      data={data.locations}
      totalItems={data.totalLocations}
      columns={columns}
    />
  );
}