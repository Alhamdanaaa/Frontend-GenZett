
import api from "../axios";
import { Membership } from '@/constants/data';

type FilterParams = {
  page?: string;
  limit?: string;
  search?: string;
  sports?: number[] | string; // serialize array ke string '1.2.3' untuk query param
  locations?: number[] | string; 
};

export async function getMemberships(params: FilterParams) {
  const res = await api.get("/memberships", { params });
  return res.data;
}

export async function getMembershipById(membershipId: number): Promise<Membership | null> {
  try {
    const res = await api.get(`/memberships/${membershipId}`);
    return res.data.data as Membership;
  } catch (error) {
    console.error('API error in getMembershipById:', error);
    return null;
  }
}

export async function createMembership(data: {
  name: string;
  description: string;
  locationId: number;
  sportId: number;
  discount?: number;
  weeks?: number;
}) {
  const res = await api.post('/memberships', data);
  return res.data;
}

export async function updateMembership(membershipId: number, data: Partial<Membership>) {
  const res = await api.put(`/memberships/${membershipId}`, data);
  return res.data;
}

export async function deleteMembership(membershipId: number) {
  const res = await api.delete(`/memberships/${membershipId}`);
  return res.data;
}