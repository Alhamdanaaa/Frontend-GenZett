import api from "../axios";
import { Reservation } from '@/constants/data';

type FilterParams = {
    page?: string;
    limit?: string;
    search?: string;
    sport?: string;
    // sportName?: string;
    location?: string;
    date?: string; // Tambahkan jika perlu filter by date
    // paymentStatus?: string;
};

type CreateParams = {
    name: string;
    fieldId: number;
    date: string;
    time: string[];
};

export async function getClosedFields(params: FilterParams = {}) {
    const res = await api.get("/closed", { params });
    return res.data;
}


export async function createClosedField(data: CreateParams) {
    const res = await api.post('/closed', data);
    return res.data;
}
