/* eslint-disable no-console */
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
    date?: string;
    paymentStatus?: string;
};

type Payload = {
    userId: number,
    name: string,
    paymentStatus: string,
    paymentType: string,
    total: number,
    details: {
        fieldId: number,
        timeIds: number[],
        date: string
    }[],
    membershipId?: number
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
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createReservation(data: Partial<Payload>) {
    try {
        console.log('Data yang akan diproses:', JSON.stringify(data, null, 2));

        if (!data.userId || !data.name || !data.total) {
            throw new Error('Data wajib tidak lengkap: userId, name, dan total harus diisi');
        }

        if (!data.details || data.details.length === 0) {
            throw new Error('Detail reservasi tidak boleh kosong');
        }

        console.log('Mengirim request ke /reservations...');
        const res = await api.post('/reservations', data);
        console.log('Response dari /reservations:', res.data);

        if (!res.data || !res.data.reservation.reservationId) {
            console.error('Response tidak valid dari create reservation:', res.data);
            throw new Error('Gagal membuat reservasi: Response tidak mengandung ID');
        }
        console.log('Reservasi berhasil dibuat dengan ID:', res.data.reservation.reservationId);

        // Create payment
        try {
            const paymentData = {
                reservationId: res.data.reservation.reservationId,
                totalPaid: res.data.reservation.total,
            };

            console.log('Mengirim request ke /payments dengan data:', paymentData);
            const paymentRes = await api.post('/payments', paymentData);
            console.log('Response dari /payments:', paymentRes.data);

            return {
                ...res.data,
                payment: paymentRes.data
            };

        } catch (paymentError) {
            console.error('Error saat membuat payment:', paymentError);
            console.warn('Reservasi berhasil dibuat tapi payment gagal. ID Reservasi:', res.data.id);

            return res.data;
        }

    } catch (error) {
        console.error('Error dalam createReservation:', error);

        // Cek jika ini adalah axios error
        if (typeof error === 'object' && error !== null && 'response' in error) {
            const err = error as { response: any };
            // Server responded with error status
            console.error('Server error response:', {
                status: err.response.status,
                data: err.response.data,
                headers: err.response.headers
            });

            const serverMessage = err.response.data?.message ||
                err.response.data?.error ||
                `Server error: ${err.response.status}`;
            throw new Error(serverMessage);

        } else if (typeof error === 'object' && error !== null && 'request' in error) {
            const err = error as { request: any };
            // Request was made but no response received
            console.error('No response received:', err.request);
            throw new Error('Tidak ada response dari server. Periksa koneksi internet atau server.');

        } else {
            // Something else happened
            const err = error as { message?: string };
            console.error('Request setup error:', err.message);
            throw new Error(err.message || 'Terjadi kesalahan yang tidak diketahui');
        }
    }
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
export async function getPrice(locationId: string | number) {
    const res = await api.get(`/reservations/getPrice/${locationId}`);
    return res.data;
}
export async function getMinimumPrice(locationId: string | number) {
    const res = await api.get(`/reservations/${locationId}/minimumPrice`);
    return res.data;
}
export async function getMinimumPriceLocSports(locationId: number, sportName: string) {
    const response = await api.get(`/reservations/getMinPriceLocSport?locationId=${locationId}&sportName=${sportName}`);
    return response.data;
}
