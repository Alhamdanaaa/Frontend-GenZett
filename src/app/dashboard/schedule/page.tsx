import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import ScheduleListingPageWrapper from '@/features/schedule/components/schedule-listing-page-wrapper';
import { getServerUserRole } from '@/hooks/use-user';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Jadwal Reservasi'
};

export default async function SchedulePage() {
  const role = await getServerUserRole();
  if (!role || !['admin'].includes(role)) {
    redirect('/unauthorized');
  }
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <Heading
          title='Jadwal Reservasi'
          description='Lihat dan kelola jadwal reservasi lapangan olahraga'
        />
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={4} rowCount={8} filterCount={2} />
          }
        >
          <ScheduleListingPageWrapper />
        </Suspense>
      </div>
    </PageContainer>
  );
}