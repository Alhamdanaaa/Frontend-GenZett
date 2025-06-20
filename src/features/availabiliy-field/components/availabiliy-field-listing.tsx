import { searchParamsCache } from '@/lib/searchparams';
import { getUserFromServer } from '@/hooks/use-user';
import AvailabilityTableWrapper from './availabiliy-field-table-wrapper';
import { getClosedFields } from '@/lib/api/closed';

const getColumns = async () => {
  const { columns } = await import('./availabiliy-field-tables/columns');
  return columns;
};

export default async function AvailabilityListingPage() {
  const user = await getUserFromServer();
  const locationId = user?.locationId;
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const rawDate = searchParamsCache.get('date');

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

  const filters = {
    page: page?.toString(),
    limit: pageLimit?.toString(),
    ...(search && { search }),
    ...(formattedDate && { date: formattedDate }),
    ...(locationId && { locationId }),
  };

  // Panggil API untuk mendapatkan closed fields saja
  const closedFieldsRes = await getClosedFields(filters);

  const rawReservations = closedFieldsRes?.data || [];

  const reservations = rawReservations.map((reservation: any) => {
    const fields: Record<string, { times: string[]; dates: string[] }> = {};

    if (reservation.details && Array.isArray(reservation.details)) {
      reservation.details.forEach((detail: any) => {
        const fieldName = detail.fieldName;
        const time = detail.time?.time;
        const date = detail.date;

        if (!fields[fieldName]) {
          fields[fieldName] = { times: [], dates: [] };
        }

        if (time && !fields[fieldName].times.includes(time)) {
          fields[fieldName].times.push(time);
        }

        if (date && !fields[fieldName].dates.includes(date)) {
          fields[fieldName].dates.push(date);
        }
      });
    }

    const fieldData = Object.keys(fields).map((fieldName) => ({
      fieldName,
      times: fields[fieldName].times,
      dates: fields[fieldName].dates,
    }));

    const status = (() => {
      const now = new Date();

      let isUpcoming = true;
      let isOngoing = false;
      let isCompleted = true;

      for (const field of fieldData) {
        for (const dateStr of field.dates) {
          for (const timeStr of field.times) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const reservationDate = new Date(dateStr);
            reservationDate.setHours(hours, minutes, 0, 0);

            const endDate = new Date(reservationDate);
            endDate.setHours(endDate.getHours() + 1);

            if (now < reservationDate) {
              isCompleted = false;
            } else if (now >= reservationDate && now < endDate) {
              isOngoing = true;
              isUpcoming = false;
              isCompleted = false;
            } else if (now >= endDate) {
              isUpcoming = false;
            } else {
              isCompleted = false;
            }
          }
        }
      }

      if (isOngoing) return 'ongoing';
      if (isUpcoming) return 'upcoming';
      if (isCompleted) return 'completed';

      return reservation.status || 'upcoming';
    })();

    return {
      ...reservation,
      fieldData,
      status,
    };
  });

  const columns = await getColumns();
  return (
    <AvailabilityTableWrapper
      data={reservations}
      totalItems={reservations.length}
      columns={columns}
    />
  );
}
