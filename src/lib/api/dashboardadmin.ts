import api from '../axios';
import { AdminDashboardData } from '@/constants/data';

export async function getDashboardAdmin(locationId: string): Promise<AdminDashboardData> {
  const res = await api.get<AdminDashboardData>(`/admin/dashboard/${locationId}`);
  return res.data;
}
