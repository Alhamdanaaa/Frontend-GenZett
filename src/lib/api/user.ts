import api from '../axios';
import { User } from '@/constants/data';

type FilterParams = {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
};

export async function getUsers(params: FilterParams) {
  const res = await api.get('/users', { params });
  return res.data;
}