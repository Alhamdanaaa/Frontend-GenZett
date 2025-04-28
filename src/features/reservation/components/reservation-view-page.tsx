import { notFound } from 'next/navigation';
import { Reservation } from '@/constants/data';
import { fakeReservations } from '@/constants/mock-api';
import ReservationViewPageClient from './reservation-view-page-client';

interface ReservationViewPageProps {
  reservationId: string;
}

async function fetchReservation(reservationId: string): Promise<Reservation | null> {
  try {
    const data = await fakeReservations.getReservationById(Number(reservationId));
    return data.reservation as Reservation;
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
