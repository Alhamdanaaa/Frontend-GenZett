import { fakeAdmins } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import AdminTableWrapper from './admin-list-table-wrapper';

const getColumns = async () => {
  const { columns } = await import('./admin-list-tables/columns');
  return columns;
};

export default async function AdminListListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const location = searchParamsCache.get('location');
  
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(location && { location: location }),
  };

  const data = await fakeAdmins.getAdmins(filters);
  const columns = await getColumns();

  return (
    <AdminTableWrapper
      data={data.admins}
      totalItems={data.totalAdmins}
      columns={columns}
    />
  );
}