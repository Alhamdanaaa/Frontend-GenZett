import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { getServerUserRole } from '@/hooks/use-user';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { Suspense, lazy } from 'react';

// Lazy load the heavy component
const CancellationListingPage = lazy(() => 
  import('@/features/cancellation/components/cancellation-listing')
);

export const metadata = {
  title: 'Dashboard: Pembatalan Reservasi'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const role = await getServerUserRole();
  if (!role || !['admin'].includes(role)) {
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
            title='Pembatalan Reservasi'
            description='Kelola data pembatalan reservasi'
          />
        </div>
        <Separator />
        <Suspense
          key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <CancellationListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}