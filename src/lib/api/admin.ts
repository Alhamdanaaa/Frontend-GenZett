import api from '../axios'; // path sesuai struktur proyekmu
import type { AdminOutput, AdminCreateInput, AdminUpdateInput } from '@/constants/data';

type FilterParams = {
  page?: string | number;
  limit?: string | number;
  search?: string;
  locationIds?: string | string[]; // disesuaikan dengan backend
};

type GetAdminsResponse = {
  success: boolean;
  time: string;
  message: string;
  totalAdmins: number;
  offset: number;
  limit: number;
  admins: AdminOutput[];
};

export async function getAdmins(params: FilterParams): Promise<GetAdminsResponse> {
  try {
    const res = await api.get('/admins', { params });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch admins:', error);
    throw error; // lempar error supaya bisa di-handle caller
  }
}

export async function getAdminById(adminId: number): Promise<AdminOutput | null> {
  try {
    const res = await api.get(`/admins/${adminId}`);
    return res.data.admin ?? null; // pastikan backend response ada 'admin'
  } catch (error) {
    console.error('Failed to fetch admin by id:', error);
    return null;
  }
}

export async function createAdmin(data: AdminCreateInput): Promise<any> {
  const res = await api.post('/admins', data);
  return res.data;
}

export async function updateAdmin(adminId: number, data: AdminUpdateInput): Promise<any> {
  const res = await api.put(`/admins/${adminId}`, data);
  return res.data;
}

export async function deleteAdmin(adminId: number): Promise<any> {
  const res = await api.delete(`/admins/${adminId}`);
  return res.data;
}
