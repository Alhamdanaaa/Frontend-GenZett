import { searchParamsCache } from '@/lib/searchparams';
import MembershipTableWrapper from './membership-table-wrapper';
import { getMemberships } from '@/lib/api/membership';

const getColumns = async () => {
  const { columns } = await import('./membership-tables/columns');
  return columns;
};

export default async function MembershipListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const sports = searchParamsCache.get('sport');
  const locations = searchParamsCache.get('location');
  const pageLimit = searchParamsCache.get('perPage');
  
  const filters = {
    page: page || undefined,
    limit: pageLimit || undefined,
    ...(search && { search }),
    ...(sports && { sports: sports.split(',').map(Number) }),   
    ...(locations && { locations: locations.split(',').map(Number) })
  };

  // Call getMemberships directly with filters
  const memberships = await getMemberships(filters);
  const columns = await getColumns();

  return (
    <MembershipTableWrapper
      data={memberships}
      totalItems={memberships.length}
      columns={columns}
    />
  );
}