import { searchParamsCache } from '@/lib/searchparams';
import ReservationTableWrapper from './reservation-table-wrapper';
import { getReservations } from '@/lib/api/reservation';

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
    page: page?.toString(),
    limit: pageLimit?.toString(),
    ...(search && { search }),
    ...(paymentStatus && { paymentStatus }),
    ...(formattedDate && { date: formattedDate }),
  };

const res = await getReservations(filters);
console.log('res:', res);
// Ini penting: ambil array reservasi dari `res.data.data`
const rawReservations = res.data;

console.log("rawReservations", rawReservations); // pastikan isinya tidak kosong

const reservations = rawReservations.map((reservation: any) => {
  // Membuat objek untuk menyimpan data lapangan dan waktu
  const fields: Record<string, { times: string[], dates: string[] }> = {};

  // Iterasi setiap detail untuk mengorganisasi berdasarkan lapangan
  reservation.details.forEach((detail: any) => {
    const fieldName = detail.fieldName;
    const time = detail.time?.time;
    const date = detail.date;

    // Jika lapangan belum ada dalam objek, buat entri baru
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
    status, // Gunakan status yang sudah dihitung
  };
});

    const columns = await getColumns();
    console.log('reservationsWithRemainingPayment:', reservations);
    return (
      <ReservationTableWrapper
        data={reservations}
        totalItems={reservations.length}
        columns={columns}
      />
    );
}
