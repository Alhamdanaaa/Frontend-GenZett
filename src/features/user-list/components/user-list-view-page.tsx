import { fakeUsers } from '@/constants/mock-api';
import { User } from '@/constants/data';
import { notFound } from 'next/navigation';
import UserForm from './user-list-form';

type TUserViewPageProps = {
  userId: string;
};

export default async function UserViewPage({
  userId
}: TUserViewPageProps) {
  let user = null;
  let pageTitle = 'Tambah User Baru';

  if (userId !== 'new') {
    const data = await fakeUsers.getUserById(Number(userId));
    user = data.user as User;
    if (!user) {
      notFound();
    }
    pageTitle = `Edit User`;
  }

  return <UserForm initialData={user} pageTitle={pageTitle} />;
}