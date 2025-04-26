import { User } from '@/constants/data';
import { fakeUsers } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { UserTable } from './user-list-tables';
import { columns } from './user-list-tables/columns';

type UserListListingPage = {};

export default async function UserListListingPage({}: UserListListingPage) {
  // Penggunaan cache search params di Render Server Components
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  const data = await fakeUsers.getUsers(filters);
  const totalUsers = data.total_users;
  const users: User[] = data.users;

  return (
    <UserTable
      data={users}
      totalItems={totalUsers}
      columns={columns}
    />
  );
}