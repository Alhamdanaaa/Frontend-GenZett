import api from "../axios";

type FilterParams = {
    page?: string;
    limit?: string;
    search?: string;
    location?: string;
    date?: string;
    paymentStatus?: string;
};

export async function getCancellations(params: FilterParams = {}) {
    const res = await api.get("/cancellations", { params });
    return res.data;
}
export async function refundCancellation(reservationId: number) {
    const res = await api.post(`/cancellations/${reservationId}/refund`);
    return res.data;
}
