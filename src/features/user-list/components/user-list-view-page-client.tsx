'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/constants/data';

const UserForm = dynamic(
  () => import('./user-list-form'),
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

interface UserViewPageClientProps {
  user: User | null;
  pageTitle: string;
}

export default function UserViewPageClient({ user, pageTitle }: UserViewPageClientProps) {
  return <UserForm initialData={user} pageTitle={pageTitle} />;
}
