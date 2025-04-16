import { fakeAdmins } from '@/constants/mock-api';
import { Admin } from '@/constants/data';
import { notFound } from 'next/navigation';
import AdminForm from './admin-list-form';

type TAdminViewPageProps = {
  adminId: string;
};

export default async function AdminViewPage({
  adminId
}: TAdminViewPageProps) {
  let admin = null;
  let pageTitle = 'Tambah Admin Baru';

  if (adminId !== 'new') {
    const data = await fakeAdmins.getAdminById(Number(adminId));
    admin = data.admin as Admin;
    if (!admin) {
      notFound();
    }
    pageTitle = `Edit admin`;
  }

  return <AdminForm initialData={admin} pageTitle={pageTitle} />;
}