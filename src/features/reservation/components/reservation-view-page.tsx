import { notFound } from 'next/navigation';
import { Reservation } from '@/constants/data';
import ReservationViewPageClient from './reservation-view-page-client';
import { getReservationById } from '@/lib/api/reservation';

interface ReservationViewPageProps {
  reservationId: string;
}

async function fetchReservation(reservationId: string): Promise<Reservation | null> {
  try {
    const data = await getReservationById(Number(reservationId));
    return data as Reservation;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ReservationViewPage({ reservationId }: ReservationViewPageProps) {
  let reservation: Reservation | null = null;
  let pageTitle = 'Tambah Reservasi Baru';

  if (reservationId !== 'new') {
    reservation = await fetchReservation(reservationId);
    if (!reservation) {
      notFound();
    }
    pageTitle = `Edit Reservasi - ${reservation.name}`; // Bisa ganti dynamic title kalau mau
  }

  return <ReservationViewPageClient reservation={reservation} pageTitle={pageTitle} />;
}
