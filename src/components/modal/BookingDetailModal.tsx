"use client";

import { Button } from "@/components/ui/button";

// Tipe data dari halaman utama
interface ReservationDetail {
  reservationId: number;
  fieldName: string;
  time: {
    timeId: number;
    fieldId: number;
    time: string;
    status: string;
    price: number;
    created_at: string;
    updated_at: string;
  };
  date: string;
}

interface Cancellation {
  cancellationId: number;
  reservationId: number;
  accountName: string;
  accountNumber: string;
  paymentPlatform: string;
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  reservationId: number;
  userId: number;
  name: string;
  locationName: string;
  paymentStatus: string;
  paymentType: string;
  total: number;
  created_at: string;
  updated_at: string;
  status: string;
  details: ReservationDetail[];
  cancellation: Cancellation | null;
  remainingPayment?: number; // Made optional to handle cases where it's missing
}

type Booking = {
  id: string;
  branch: string;
  name: string;
  court: string;
  date: string;
  total: string;
  payment: string;
  status: string;
  originalData: Reservation;
};

export default function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const detailData = booking.originalData;

  const formatDate = (dateString: any) => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sept', 'Okt', 'Nov', 'Des'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };
  const formatTime = (timeString: any) => {
    if (!timeString) return '-';
    return timeString.slice(0, 5); // Ambil hanya jam dan menit, misal "11:00"
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (amount === undefined || isNaN(amount)) return "Rp. 0";
    return `Rp. ${amount.toLocaleString("id-ID")}`;
  };

  // Extract fields from first detail (as reference)
  const firstDetail = detailData.details[0];

  // Calculate total paid and remaining with fallback
  const totalAmount = detailData.total || 0;
  let totalPaid = 0;
  let remainingPayment = 0;

  if (detailData.paymentStatus === 'dp') {
    totalPaid = totalAmount * 0.5;
    remainingPayment = totalAmount * 0.5;
  } else {
    totalPaid = totalAmount;
    remainingPayment = 0;
  }
  const remainingAmount = remainingPayment;

  const paymentStatusLabel = () => {
    if (detailData.paymentStatus.toLowerCase() === "complete") return "Lunas";
    if (detailData.paymentStatus.toLowerCase() === "dp") return "DP";
    if (detailData.paymentStatus.toLowerCase() === "pending") return "Belum Bayar";
    if (detailData.paymentStatus.toLowerCase() === "fail") return "Gagal";
    if (detailData.paymentStatus.toLowerCase() === "canceled") return "Dibatalkan";
    return detailData.paymentStatus.charAt(0).toUpperCase() + detailData.paymentStatus.slice(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-lg sm:max-w-md md:max-w-xl lg:max-w-2xl w-full shadow-xl space-y-6 overflow-auto max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Detail Pesanan</h2>

        {/* Informasi Umum */}
        <table className="w-full table-fixed text-sm border-collapse border border-[#6CC28F]">
          <tbody>
            {[
              ["Atas Nama", detailData.name],
              ["Lokasi Cabang", detailData.locationName || "N/A"],
              ["Lapangan", firstDetail?.fieldName.split(" - ")[1] || "N/A"],
              ["Tanggal Pemesanan", formatDate(detailData.created_at)],
            ].map(([label, val], i) => (
              <tr key={i} className="border-b border-[#6CC28F]">
                <td className="w-1/3 bg-[#2C473A] text-white font-semibold p-3">{label}</td>
                <td className="p-3">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Detail Waktu & Harga */}
        <table className="w-full text-sm border-collapse border border-[#6CC28F]">
          <thead>
            <tr>
              {["Tanggal Reservasi", "Lapangan", "Waktu", "Harga"].map((h) => (
                <th key={h} className="p-2 bg-[#2C473A] font-semibold text-white text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detailData.details.map((detail, i) => (
              <tr key={i} className="border-t border-[#6CC28F]">
                <td className="p-2 text-center">{formatDate(detail.date)}</td>
                <td className="p-2 text-center">{detail.fieldName.split(" - ")[1] || "N/A"}</td>
                <td className="p-2 text-center">{formatTime(detail.time.time)}</td>
                <td className="p-2 text-center">{formatCurrency(detail.time.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Ringkasan Pembayaran */}
        <table className="w-full table-fixed text-sm border-collapse border border-[#6CC28F]">
          <tbody>
            {[
              ["Total Harga", formatCurrency(totalAmount)],
              ["Sudah Dibayar", formatCurrency(totalPaid)],
              ["Sisa Pembayaran", formatCurrency(remainingAmount)],
              ["Status Pembayaran", paymentStatusLabel()],
              ["Status Booking", detailData.status.charAt(0).toUpperCase() + detailData.status.slice(1)],
            ].map(([label, val], i) => (
              <tr key={i} className={i < 4 ? "border-b border-[#6CC28F]" : ""}>
                <td className="w-1/3 bg-[#2C473A] text-white font-semibold p-3">{label}</td>
                <td className="p-3">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tombol Tutup */}
        <div className="flex justify-center">
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black px-6 py-2">
            Tutup
          </Button>
        </div>
      </div>

      <style jsx>{`
        tbody {
          color: black;
        }
      `}</style>
    </div>
  );
}