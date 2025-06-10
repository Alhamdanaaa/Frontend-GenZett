import { searchParamsCache } from '@/lib/searchparams';
import CancellationTableWrapper from './cancellation-table-wrapper';
import { getUserFromServer } from '@/hooks/use-user';
import { getCancellations } from '@/lib/api/cancellation';

const getColumns = async () => {
  const { columns } = await import('./cancellation-tables/columns');
  return columns;
};

export default async function CancellationListingPage() {
  const user = await getUserFromServer();
  const locationId = user?.locationId;
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const rawDate = searchParamsCache.get('date');
  const paymentStatus = searchParamsCache.get('paymentStatus');

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
    ...(paymentStatus && { paymentStatus }),
    ...(formattedDate && { date: formattedDate }),
    ...(locationId && { locationId }),
  };

const res = await getCancellations(filters);
const rawReservations = res.data;

const reservations = rawReservations.map((reservation: any) => {
  const fields: Record<string, { times: string[], dates: string[] }> = {};

  // Iterasi setiap detail untuk mengorganisasi berdasarkan lapangan
  reservation.details.forEach((detail: any) => {
    const fieldName = detail.fieldName;
    const time = detail.time?.time;
    const date = detail.date;

    if (!fields[fieldName]) {
      fields[fieldName] = { times: [], dates: [] };
    }

    // Tambahkan waktu jika ada dan belum ada dalam array
    if (time && !fields[fieldName].times.includes(time)) {
      fields[fieldName].times.push(time);
    }

    // Tambahkan tanggal jika belum ada dalam array
    if (date && !fields[fieldName].dates.includes(date)) {
      fields[fieldName].dates.push(date);
    }
  });

  // Konversi objek fields menjadi array
  const fieldData = Object.keys(fields).map(fieldName => ({
    fieldName,
    times: fields[fieldName].times,
    dates: fields[fieldName].dates
  }));

  const remainingPayment = (() => {
    if (reservation.paymentStatus === 'complete') return 0;
    if (reservation.paymentStatus === 'dp') return reservation.total / 2;
    return reservation.total;
  })();

  // Menentukan status reservasi berdasarkan tanggal dan waktu
  const status = (() => {
    const now = new Date();
    
    // Periksa semua lapangan dan waktu
    let isUpcoming = true;
    let isOngoing = false;
    let isCompleted = true;
    
    // Iterasi melalui semua data lapangan
    for (const field of fieldData) {
      for (const dateStr of field.dates) {
        for (const timeStr of field.times) {
          // Buat objek Date dari tanggal dan waktu reservasi
          const [hours, minutes] = timeStr.split(':').map(Number);
          const reservationDate = new Date(dateStr);
          reservationDate.setHours(hours, minutes, 0, 0);
          
          // Hitung waktu berakhir (asumsi 1 jam per sesi)
          const endDate = new Date(reservationDate);
          endDate.setHours(endDate.getHours() + 1);
          
          // Periksa status berdasarkan waktu saat ini
          if (now < reservationDate) {
            // Jika ada satu saja jadwal yang belum dimulai, belum completed
            isCompleted = false;
          } else if (now >= reservationDate && now < endDate) {
            // Jika sekarang dalam rentang waktu reservasi, ongoing
            isOngoing = true;
            isUpcoming = false;
            isCompleted = false;
          } else if (now >= endDate) {
            // Jika sudah lewat waktu akhir, bukan upcoming
            isUpcoming = false;
          } else {
            // Untuk case lainnya, jaga-jaga
            isCompleted = false;
          }
        }
      }
    }
    
    // Tentukan status final berdasarkan flags
    if (isOngoing) return 'ongoing';
    if (isUpcoming) return 'upcoming';
    if (isCompleted) return 'completed';
    
    // Fallback ke status sebelumnya atau 'upcoming' jika tidak ada
    return reservation.status || 'upcoming';
  })();

  return {
    ...reservation,
    fieldData,
    remainingPayment,
    status,
  };
});

    const columns = await getColumns();
    return (
      <CancellationTableWrapper
        data={reservations}
        totalItems={reservations.length}
        columns={columns}
      />
    );
}
