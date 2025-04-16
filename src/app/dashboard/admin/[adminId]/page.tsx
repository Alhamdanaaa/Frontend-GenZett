import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import AdminListViewPage from '@/features/admin-list/components/admin-list-view-page';

export const metadata = {
  title: 'Dashboard : Manajemen Lokasi'
};

type PageProps = { params: Promise<{ adminId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <AdminListViewPage adminId={params.adminId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}