import { fakeReservations } from '@/constants/mock-api';
import { Reservation } from '@/constants/data';
import { notFound } from 'next/navigation';
import ReservationForm from './reservation-form';

type TReservationViewPageProps = {
  reservationId: string;
};

export default async function ReservationViewPage({
  reservationId
}: TReservationViewPageProps) {
  let reservation = null;
  let pageTitle = 'Tambah Reservasi Baru';

  if (reservationId !== 'new') {
    const data = await fakeReservations.getReservationById(Number(reservationId));
    reservation = data.reservation as Reservation;
    if (!reservation) {
      notFound();
    }
    pageTitle = `Edit Reservasi`;
  }

  return <ReservationForm initialData={reservation} pageTitle={pageTitle} />;
}