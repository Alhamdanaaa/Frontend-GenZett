
import api from "../axios";
import { Membership } from '@/constants/data';

type FilterParams = {

  page?: string;
  limit?: string;
  search?: string;
};

export async function getMemberships(params: FilterParams) {
  const res = await api.get("/memberships", { params });
  return res.data;
}

export async function getMembershipById(membershipId: number): Promise<Membership | null> {
  try {
    const res = await api.get(`/memberships/${membershipId}`);
    return res.data.membership;
  } catch (error) {
    console.error(error);
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

