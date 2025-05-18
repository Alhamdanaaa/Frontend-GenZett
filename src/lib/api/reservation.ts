import api from "../axios";
import { Reservation } from '@/constants/data';

type FilterParams = {
  page?: string;
  limit?: string;
  search?: string;
  paymentStatus?: string;
  date?: string;
};
export async function getReservations(params: FilterParams) {
  const res = await api.get("/reservations", { params });
  return res.data;
}
export async function getReservationById(reservationId: number): Promise<Reservation | null> {
  const res = await api.get(`/reservations/${reservationId}`);
  return res.data.reservation;
}