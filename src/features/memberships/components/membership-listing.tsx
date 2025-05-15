import { fakeMemberships } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import MembershipTableWrapper from './membership-table-wrapper';

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
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(sports && { sports: sports }),
    ...(locations && { locations: locations })
  };

  const data = await fakeMemberships.getMemberships(filters);
  const columns = await getColumns();

  return (
    <MembershipTableWrapper
      data={data.memberships}
      totalItems={data.total_memberships}
      columns={columns}
    />
  );
}