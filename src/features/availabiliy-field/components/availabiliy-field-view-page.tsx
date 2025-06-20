import { notFound } from 'next/navigation';
import AvailabilityViewPageClient from './availabiliy-field-view-page-client';
import { getAllFields } from '@/lib/api/field';
import { getUserFromServer } from '@/hooks/use-user';
import { ClosedFieldResponse, getClosedFieldById } from '@/lib/api/closed';

interface AvailabilityViewPageProps {
  reservationId: string;
}

async function fetchAvailability(reservationId: string): Promise<ClosedFieldResponse | null> {
  try {
    const response = await getClosedFieldById(Number(reservationId));
    if (response.success && response.reservation) {
      return response.reservation;
    }
    return null;
  } catch (error) {
    console.error('Error in fetchAvailability:', error);
    return null;
  }
}

export default async function AvailabilityViewPage({ reservationId }: AvailabilityViewPageProps) {
  let reservation: ClosedFieldResponse | null = null;
  let pageTitle = 'Tambah Data Tutup Lapangan'; 

  console.log('Reservation ID:', reservationId);

  if (reservationId !== 'new') {
    reservation = await fetchAvailability(reservationId);
    console.log('Fetched reservation:', reservation);
    if (!reservation) {
      notFound();
    }
    pageTitle = `Edit Penutupan Lapangan - ${reservation.name}`;
  }

  const data = await getUserFromServer();
  const locationId = data?.locationId;
  const userId = data?.user_id;

  const fields = await getAllFields(locationId);
  const fieldOptions = fields.map((field: any) => ({
    label: field.name,
    value: String(field.id),
  }));

  return (
    <AvailabilityViewPageClient
      reservation={reservation}
      pageTitle={pageTitle}
      userId={userId}
      fieldOptions={fieldOptions}
    />
  );
}
