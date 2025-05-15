import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

export default async function DashboardPage() {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded = jwtDecode<{ role?: string }>(token);
    if (decoded.role !== 'admin') {
      redirect('/');
    }

    redirect('/dashboard/overview');
  } catch {
    redirect('/dashboard/overview');
  }
}
