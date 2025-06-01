// lib/api.ts
import api from "../axios";
import { Reservation } from '@/constants/data';

type FilterParams = {
    page?: string;
    limit?: string;
    search?: string;
    sport?: string;
    sportName?: string;
    location?: string;
    date?: string; // Tambahkan jika perlu filter by date
    paymentStatus?: string;
};

type DetailItem = {
    fieldId: number;
    timeIds: number[];
    date: string;
};

type Payload = {
    userId: number,
    name: string,
    paymentStatus: string,
    total: number,
    details: DetailItem[],
    phone?: string;
    paymentType?: string;
    membershipId?: number;
}

export async function getReservations(params: FilterParams = {}) {
    const res = await api.get("/reservations", { params });
    return res.data;
}

export async function getSchedule(locationId: string | number, params: FilterParams = {}) {
    const res = await api.get(`/reservations/${locationId}/schedules`, { params });
    return res.data;
}

export async function getReservationById(reservationId: number): Promise<Reservation | null> {
    try {
        const res = await api.get(`/reservations/${reservationId}`);
        return res.data.Reservations;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createReservation(data: Partial<Payload>) {
    const res = await api.post('/reservations', data);
    // create payment
    if (!res.data || !res.data.id) {
        throw new Error('Failed to create reservation');
    } else {
        const paymentData = {
            reservationId: res.data.id,
            totalpaid: res.data.total,
        };
        await api.post('/payments', paymentData);
    }
    return res.data;
}

export async function updateReservation(reservationId: number, data: Partial<Payload>) {
    const res = await api.put(`/reservations/${reservationId}`, data);
    return res.data;
}

export async function deleteReservation(reservationId: number) {
    const res = await api.delete(`/reservations/${reservationId}`);
    return res.data;
}

export async function getLocations(params: FilterParams = {}) {
    const res = await api.get('/reservations/location', { params }); // Perhatikan plural 'locations'
    return res.data;
}

export async function getSports() {
    const res = await api.get('/reservations/sport'); // Perhatikan plural 'sports'
    return res.data;
}

export async function getSportsByLocation(locationId: string | number) {
    const res = await api.get(`/reservations/sport/${locationId}`);
    return res.data;
}
export async function confirmPayment(reservationId: number) {
    const res = await api.post(`/reservations/${reservationId}/pay`);
    return res.data;
}
export async function getMinimumPrice(locationId: string | number) {
    const res = await api.get(`/reservations/${locationId}/minimumPrice`);
    // const res = await api.get(`/reservations/minimumPrice`);
    return res.data;
}