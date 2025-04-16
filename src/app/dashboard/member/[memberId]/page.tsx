import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import MemberListViewPage from '@/features/member-list/components/member-list-view-page';

export const metadata = {
  title: 'Dashboard : Manajemen Member'
};

type PageProps = { params: Promise<{ memberId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <MemberListViewPage memberId={params.memberId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}