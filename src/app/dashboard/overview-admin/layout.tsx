import PageContainer from '@/components/layout/page-container';
import { getUserFromServer } from '@/hooks/use-user';
import React from 'react';

export default async function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromServer();

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Selamat datang kembali, {user?.name ?? '...'} 👋
          </h2>
        </div>
        {children}
      </div>
    </PageContainer>
  );
}