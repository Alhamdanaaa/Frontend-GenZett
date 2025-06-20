import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { getServerUserRole } from '@/hooks/use-user';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { Suspense, lazy } from 'react';

// Lazy load the heavy component
const AvailabilityListingPage = lazy(() => 
  import('@/features/availabiliy-field/components/availabiliy-field-listing')
);

export const metadata = {
  title: 'Dashboard: Tutup Lapangan'
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
            title='Penutupan Lapangan'
            description='Kelola data penutupan lapangan'
          />
          <Link
            href='/dashboard/availability/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Tambah
          </Link>
        </div>
        <Separator />
        <Suspense
          key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <AvailabilityListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}