import { Admin } from '@/constants/data';
import { notFound } from 'next/navigation';
import AdminViewPageClient from './admin-list-view-page-client';
import { fakeAdmins } from '@/constants/mock-api';

interface AdminViewPageProps {
  adminId: string;
}

async function fetchAdmin(adminId: string): Promise<Admin | null> {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin-list/${adminId}`, {
    //   cache: 'no-store'
    // });
    // if (!res.ok) {
    //   throw new Error('Admin not found');
    // }
    // const data = await res.json();
    const data = await fakeAdmins.getAdminById(Number(adminId)); 
    return data.admin as Admin;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function AdminViewPage({ adminId }: AdminViewPageProps) {
  let admin: Admin | null = null;
  let pageTitle = 'Tambah Admin Baru';

  if (adminId !== 'new') {
    admin = await fetchAdmin(adminId);
    if (!admin) {
      notFound();
    }
    pageTitle = `Edit Admin - ${admin.name}`;
  }

  return <AdminViewPageClient admin={admin} pageTitle={pageTitle} />;
}
