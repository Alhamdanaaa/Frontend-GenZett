import { User } from '@/constants/data';
import { notFound } from 'next/navigation';
import UserViewPageClient from './user-list-view-page-client';
import { getUserById } from '@/lib/api/user';

interface UserViewPageProps {
  userId: string;
}

async function fetchUser(userId: string): Promise<User | null> {
  try {
    const data = await getUserById(Number(userId));
    return data as User;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function UserViewPage({ userId }: UserViewPageProps) {
  let user: User | null = null;
  let pageTitle = 'Tambah User Baru';

  if (userId !== 'new') {
    user = await fetchUser(userId);
    if (!user) {
      notFound();
    }
    pageTitle = `Edit User - ${user.name}`;
  }

  return <UserViewPageClient user={user} pageTitle={pageTitle} />;
}
