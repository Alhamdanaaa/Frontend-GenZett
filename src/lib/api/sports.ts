// lib/api.ts
import api from "../axios";
import { Sport } from '@/constants/data';

type FilterParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export async function getSports(params: FilterParams) {
  const res = await api.get("/sports", { params });
  return res.data;
}

export async function getSportById(sportId: number): Promise<Sport | null> {
  try {
    const res = await api.get(`/sports/${sportId}`);
    return res.data.sport;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createSport(data: Partial<Sport>) {
  const res = await api.post('/sports', data);
  return res.data;
}

export async function updateSport(sportId: number, data: Partial<Sport>) {
  const res = await api.put(`/sports/${sportId}`, data);
  return res.data;
}

export async function deleteSport(sportId: number) {
  const res = await api.delete(`/sports/${sportId}`);
  return res.data;
}
