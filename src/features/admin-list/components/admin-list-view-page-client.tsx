'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Admin } from '@/constants/data';

const AdminForm = dynamic(
  () => import('./admin-list-form'),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-6 bg-card rounded-lg shadow">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    )
  }
);

interface AdminViewPageClientProps {
  admin: Admin | null;
  pageTitle: string;
}

export default function AdminViewPageClient({ admin, pageTitle }: AdminViewPageClientProps) {
  return <AdminForm initialData={admin} pageTitle={pageTitle} />;
}
