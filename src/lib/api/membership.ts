// lib/api.ts
import api from "../axios";
import { Membership } from '@/constants/data';

type FilterParams = {
    page?: string;
    limit?: string;
    search?: string;
    sport?: string;
    location?: string;
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
        // eslint-disable-next-line no-console
        console.error(error);
        return null;
    }
}

export async function createMembership(data: Partial<Membership>) {
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
