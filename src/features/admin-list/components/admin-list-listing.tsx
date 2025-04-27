import { Admin } from '@/constants/data';
import { fakeAdmins } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { AdminTable } from './admin-list-tables';
import { columns } from './admin-list-tables/columns';

type AdminListListingPage = {};

export default async function AdminListListingPage({}: AdminListListingPage) {
  // Penggunaan cache search params di Render Server Components
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
  const totalAdmins = data.total_admins;
  const admins: Admin[] = data.admins;

  return (
    <AdminTable
      data={admins}
      totalItems={totalAdmins}
      columns={columns}
    />
  );
}