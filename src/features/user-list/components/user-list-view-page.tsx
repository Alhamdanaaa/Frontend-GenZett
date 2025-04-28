import { User } from '@/constants/data';
import { notFound } from 'next/navigation';
import UserViewPageClient from './user-list-view-page-client';
import { fakeUsers } from '@/constants/mock-api';

interface UserViewPageProps {
  userId: string;
}

async function fetchUser(userId: string): Promise<User | null> {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-list/${userId}`, {
    //   cache: 'no-store'
    // });
    // if (!res.ok) {
    //   throw new Error('User not found');
    // }
    // const data = await res.json();
    const data = await fakeUsers.getUserById(Number(userId));
    return data.user as User;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function UserViewPage({ userId }: UserViewPageProps) {
  let user: User | null = null;
  let pageTitle = 'Tambah Cabang Olahraga Baru';

  if (userId !== 'new') {
    user = await fetchUser(userId);
    if (!user) {
      notFound();
    }
    pageTitle = `Edit User - ${user.name}`;
  }

  return <UserViewPageClient user={user} pageTitle={pageTitle} />;
}
