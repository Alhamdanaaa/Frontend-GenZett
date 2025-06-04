import api from "../axios";

type FilterParams = {
    page?: string;
    limit?: string;
    search?: string;
    sport?: string;
    location?: string;
    date?: string;
};

type CreateParams = {
    userId?: number;
    name: string;
    fieldId: number;
    date: string;
    time: string[];
};

export interface ClosedFieldResponse {
    reservationId: number;
    userId: number;
    name: string;
    paymentStatus: string;
    paymentType: string;
    total: number;
    remaining: number;
    details: Array<{
        reservationDetailId: number;
        fieldId: number;
        timeId: number;
        date: string;
        field: {
            fieldId: number;
            name: string;
        };
        time: {
            timeId: number;
            time: string;
        };
    }>;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    reservation?: T;
    booked_times?: string[];
    skipped_times?: string[];
    conflicts?: any[];
}

export async function getClosedFields(params: FilterParams = {}) {
    const res = await api.get("/closed", { params });
    return res.data;
}

export async function createClosedField(data: CreateParams): Promise<ApiResponse<ClosedFieldResponse>> {
    try {
        const res = await api.post('/closed', data);
        return res.data;
    } catch (error: any) {
        console.error('Error creating closed field:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Terjadi kesalahan saat membuat closed field'
        };
    }
}

// Get closed field by ID
export async function getClosedFieldById(id: number): Promise<ApiResponse<ClosedFieldResponse>> {
    try {
        const res = await api.get(`/closed/${id}`);
        return res.data;
    } catch (error: any) {
        console.error('Error fetching closed field:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Terjadi kesalahan saat mengambil data closed field'
        };
    }
}

// Update closed field
export async function updateClosedField(id: number, data: CreateParams): Promise<ApiResponse<ClosedFieldResponse>> {
    try {
        const res = await api.put(`/closed/${id}`, data);
        return res.data;
    } catch (error: any) {
        console.error('Error updating closed field:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Terjadi kesalahan saat mengupdate closed field'
        };
    }
}

// Delete closed field
export async function deleteClosedField(id: number): Promise<ApiResponse> {
    try {
        const res = await api.delete(`/closed/${id}`);
        return res.data;
    } catch (error: any) {
        console.error('Error deleting closed field:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Terjadi kesalahan saat menghapus closed field'
        };
    }
}