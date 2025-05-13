import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import MembershipViewPage from '@/features/memberships/components/membership-view-page';

export const metadata = {
  title: 'Dashboard : Manajemen Lokasi'
};

type PageProps = { params: Promise<{ membershipId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <MembershipViewPage membershipId={params.membershipId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}