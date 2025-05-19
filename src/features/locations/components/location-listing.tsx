import { searchParamsCache } from '@/lib/searchparams';
import LocationTableWrapper from './location-table-wrapper';
import { getLocations } from '@/lib/api/location';

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
    page: page?.toString(),
    limit: pageLimit?.toString(),
    ...(search && { search }),
    ...(sports && { sports: sports })
  };

  const data = await getLocations(filters);
  const columns = await getColumns();

  return (
    <LocationTableWrapper
      data={data.locations}
      totalItems={data.totalLocations}
      columns={columns}
    />
  );
}