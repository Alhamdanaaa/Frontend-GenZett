
import api from "../axios";
import { Membership } from '@/constants/data';

type FilterParams = {

  page?: string;
  limit?: string;
  search?: string;
  sports?: number[];    // filter berdasarkan sportId
  locations?: number[]; // filter berdasarkan locationId
};

// serialize array ke string '1.2.3' untuk query param
function serializeArray(arr?: number[]): string | undefined {
  return arr && arr.length > 0 ? arr.join('.') : undefined;
}

export async function getMemberships(params: FilterParams) {
  const res = await api.get("/memberships", { params });
  return res.data;
}

export async function getMembershipById(membershipId: number): Promise<Membership | null> {
  try {
    const res = await api.get(`/memberships/${membershipId}`);
    return res.data.data as Membership;
  } catch (error) {
    console.error(`Error fetching membership with ID ${membershipId}:`, error);
    return null;
  }
}

export async function createMembership(data: Partial<Membership>) {
  try {
    const res = await api.post("/memberships", data);
    return res.data.data as Membership;
  } catch (error) {
    console.error("Error creating membership:", error);
    throw error;
  }
}

export async function updateMembership(membershipId: number, data: Partial<Membership>) {
  try {
    const res = await api.put(`/memberships/${membershipId}`, data);
    return res.data.data as Membership;
  } catch (error) {
    console.error(`Error updating membership with ID ${membershipId}:`, error);
    throw error;
  }
}

export async function deleteMembership(membershipId: number) {
  try {
    await api.delete(`/memberships/${membershipId}`);
  } catch (error) {
    console.error(`Error deleting membership with ID ${membershipId}:`, error);
    throw error;
  }
}

export async function getMembershipsByLocation(locationId: number) {
  try {
    const res = await api.get(`/memberships/location/${locationId}`);
    return res.data.data as Membership[];
  } catch (error) {
    console.error(`Error fetching memberships for location ID ${locationId}:`, error);
    throw error;
  }
}

export async function getMembershipsBySport(sportId: number) {
  try {
    const res = await api.get(`/memberships/sport/${sportId}`);
    return res.data.data as Membership[];
  } catch (error) {
    console.error(`Error fetching memberships for sport ID ${sportId}:`, error);
    throw error;
  }
}

export async function getMembershipsByLocationAndSport(locationId: number, sportId: number) {
  try {
    const res = await api.get(`/memberships/location/${locationId}/sport/${sportId}`);
    return res.data.data as Membership[];
  } catch (error) {
    console.error(`Error fetching memberships for location ID ${locationId} and sport ID ${sportId}:`, error);
    throw error;
  }
}
