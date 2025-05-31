import { AdminUpdateInput as Admin } from '@/constants/data';
import { notFound } from 'next/navigation';
import AdminViewPageClient from './admin-list-view-page-client';
import { getAdminById } from '@/lib/api/admin';
interface AdminViewPageProps {
  adminId: string;
}

async function fetchAdmin(adminId: string): Promise<Admin | null> {
  try {
    const data = await getAdminById(Number(adminId)); 
    return data;
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
