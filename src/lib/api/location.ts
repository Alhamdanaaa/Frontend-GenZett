/* eslint-disable no-console */
// lib/api.ts
import api from "../axios";
import { Location } from '@/constants/data';

type FilterParams = {
    page?: string;
    limit?: string;
    search?: string;
};

export async function getLocations(params: FilterParams) {
    const res = await api.get("/locations", { params });
    return res.data;
}

export async function getLocationById(locationId: number): Promise<Location | null> {
    try {
        const res = await api.get(`/locations/${locationId}`);
        return res.data.location;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createLocation(data: Partial<Location>) {
    const res = await api.post('/locations', data);
    return res.data;
}

export async function updateLocation(locationId: number, data: Partial<Location>) {
    const res = await api.put(`/locations/${locationId}`, data);
    return res.data;
}

export async function deleteLocation(locationId: number) {
    const res = await api.delete(`/locations/${locationId}`);
    return res.data;
}
