import api from '../axios';
import { DashboardData } from '@/constants/data';

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await api.get<DashboardData>('/superadmin/dashboard');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch dashboard data:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dashboard data');
  }
}