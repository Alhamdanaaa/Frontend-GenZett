import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import UserListViewPage from '@/features/user-list/components/user-list-view-page';

export const metadata = {
  title: 'Dashboard : Manajemen User'
};

type PageProps = { params: Promise<{ userId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <UserListViewPage userId={params.userId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}