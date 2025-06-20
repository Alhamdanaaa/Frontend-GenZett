import { getServerUserRole } from '@/hooks/use-user';
import HomePage from './user/views/page';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Halaman utama bagi pengguna sport center',
};

export default async function Home() {
  const role = await getServerUserRole();
  console.log('Role in Home:', role);

  if (role === 'superadmin') {
    redirect('/dashboard/overview');
  }

  if (role === 'admin') {
    redirect('/dashboard/overview-admin');
  }

  return <HomePage />;
}
