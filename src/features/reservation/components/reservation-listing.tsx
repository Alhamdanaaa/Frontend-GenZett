import { Reservation } from '@/constants/data';
import { fakeReservations } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { ReservationTable } from './reservation-tables';
import { columns } from './reservation-tables/columns';

type ReservationListingPage = {};

export default async function ReservationListingPage({}: ReservationListingPage) {
  // Penggunaan cache search params di Render Server Components
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const date = searchParamsCache.get('date');
  const paymentStatus = searchParamsCache.get('paymentStatus');
  
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(paymentStatus && { paymentStatus: paymentStatus }),
    ...(date && { date: date }),
  };

  const data = await fakeReservations.getReservations(filters);
  const totalReservations = data.total_reservations;
  const reservations: Reservation[] = data.reservations;

  return (
    <ReservationTable
      data={reservations}
      totalItems={totalReservations}
      columns={columns}
    />
  );
}