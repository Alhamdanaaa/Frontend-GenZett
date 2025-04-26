import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import ScheduleListingPage from '@/features/schedule/components/schedule-listing-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Jadwal Reservasi'
};

export default function SchedulePage() {
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
          < ScheduleListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
