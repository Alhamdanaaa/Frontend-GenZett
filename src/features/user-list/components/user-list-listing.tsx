import { fakeUsers } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import UserTableWrapper from './user-list-table-wrapper';

const getColumns = async () => {
  const { columns } = await import('./user-list-tables/columns');
  return columns;
};

export default async function UserListListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  const data = await fakeUsers.getUsers(filters);
  const columns = await getColumns();

  return (
    <UserTableWrapper
      data={data.users}
      totalItems={data.totalUsers}
      columns={columns}
    />
  );
}