import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { getServerUserRole } from '@/hooks/use-user-role';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { lazy, Suspense } from 'react';

const UserListListingPage = lazy(() => 
  import('@/features/user-list/components/user-list-listing')
);

export const metadata = {
  title: 'Dashboard: User'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const role = await getServerUserRole();
  if (!role || !['superadmin'].includes(role)) {
    redirect('/unauthorized');
  }
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Data User'
            description='Kelola data user'
          />
          {/* <Link
            href='/dashboard/user/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Tambah
          </Link> */}
        </div>
        <Separator />
        <Suspense
          key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <UserListListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
