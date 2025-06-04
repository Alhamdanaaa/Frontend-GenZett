import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import AvailabilityViewPage from '@/features/availabiliy-field/components/availabiliy-field-view-page';

export const metadata = {
  title: 'Dashboard : Manajemen Penutupan Lapangan'
};

type PageProps = { params: { reservationId: string } };

export default async function Page({ params }: PageProps) {
  const { reservationId } = params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <AvailabilityViewPage reservationId={reservationId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
