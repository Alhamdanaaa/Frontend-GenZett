import { fakeReservations } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import ReservationTableWrapper from './reservation-table-wrapper';

const getColumns = async () => {
  const { columns } = await import('./reservation-tables/columns');
  return columns;
};

export default async function ReservationListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const rawDate = searchParamsCache.get('date'); // timestamp as string
  const paymentStatus = searchParamsCache.get('paymentStatus');

  // Convert timestamp to local YYYY-MM-DD
  let formattedDate: string | undefined;
  if (rawDate) {
    const timestamp = Number(rawDate);
    if (!isNaN(timestamp)) {
      const dateObj = new Date(timestamp);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }
  }

  console.log({
    original: rawDate,
    formattedDate
  });

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(paymentStatus && { paymentStatus }),
    ...(formattedDate && { date: formattedDate }),
  };

  const data = await fakeReservations.getReservations(filters);
  const columns = await getColumns();

  return (
    <ReservationTableWrapper
      data={data.reservations}
      totalItems={data.total_reservations}
      columns={columns}
    />
  );
}
