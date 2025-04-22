import { Member } from '@/constants/data';
import { fakeMembers } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { MemberTable } from './member-list-tables';
import { columns } from './member-list-tables/columns';

type MemberListListingPage = {};

export default async function MemberListListingPage({}: MemberListListingPage) {
  // Penggunaan cache search params di Render Server Components
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const day = searchParamsCache.get('day');
  
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(day && { day: day })
  };

  const data = await fakeMembers.getMembers(filters);
  const totalMembers = data.total_members;
  const members: Member[] = data.members;

  return (
    <MemberTable
      data={members}
      totalItems={totalMembers}
      columns={columns}
    />
  );
}