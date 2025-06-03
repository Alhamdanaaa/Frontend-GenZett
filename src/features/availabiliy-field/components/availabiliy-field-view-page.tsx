import { notFound } from 'next/navigation';
import { Reservation } from '@/constants/data';
import AvailabilityViewPageClient from './availabiliy-field-view-page-client';
import { getReservationById } from '@/lib/api/reservation';
import { getAllFields } from '@/lib/api/field'; // ✅ Import API lapangan
import { getUserFromServer } from '@/hooks/use-user';

interface AvailabilityViewPageProps {
  reservationId: string;
}

async function fetchAvailability(reservationId: string): Promise<Reservation | null> {
  try {
    const data = await getReservationById(Number(reservationId));
    return data as Reservation;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function AvailabilityViewPage({ reservationId }: AvailabilityViewPageProps) {
  let reservation: Reservation | null = null;
  let pageTitle = 'Tambah Reservasi Baru';

  if (reservationId !== 'new') {
    reservation = await fetchAvailability(reservationId);
    if (!reservation) {
      notFound();
    }
    pageTitle = `Edit Reservasi - ${reservation.name}`;
  }

  const data = await getUserFromServer();
  console.log(data);
  const locationId = data?.locationId;
  console.log(data?.user_id);
  const userId = data?.user_id;

  const fields = await getAllFields(locationId);
  const fieldOptions = fields.map((field: any) => ({
    label: field.name,
    value: String(field.id),
  }));
  console.log(userId);
  return (
    <AvailabilityViewPageClient
      reservation={reservation}
      pageTitle={pageTitle}
      userId={userId}
      fieldOptions={fieldOptions}
    />
  );
}
