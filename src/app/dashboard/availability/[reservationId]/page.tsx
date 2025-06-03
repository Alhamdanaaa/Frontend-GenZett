import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ReservationViewPage from '@/features/availabiliy-field/components/availabiliy-field-view-page';

export const metadata = {
  title: 'Dashboard : Manajemen Reservasi'
};

type PageProps = { params: Promise<{ reservationId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ReservationViewPage reservationId={params.reservationId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}