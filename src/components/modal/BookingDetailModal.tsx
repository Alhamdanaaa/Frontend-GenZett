"use client";

import { Button } from "@/components/ui/button";

// Tipe data dari halaman utama
interface ReservationDetail {
  locationName: string;
  sportName: string;
  time: string;
  lapangan: string;
  price: number; // Sesuai dengan API response
}

interface Reservation {
  bookingName: string;
  cabang: string;
  lapangan: string;
  paymentStatus: string;
  paymentType: string;
  reservationStatus: string;
  totalAmount: number;
  totalPaid: number;
  remainingAmount: number;
  date: string;
  details: ReservationDetail[];
  created_at: string;
  updated_at: string;
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number): string => {
    return `Rp. ${amount.toLocaleString('id-ID')}`;
  };

  // Extract fields from first detail (as reference)
  const firstDetail = detailData.details[0];

  // Menggunakan data yang benar dari API response
  const totalAmount = detailData.totalAmount;
  const totalPaid = detailData.totalPaid;
  const remainingAmount = detailData.remainingAmount;

  const paymentStatusLabel = () => {
    if (detailData.paymentStatus.toLowerCase() === "lunas") return "Lunas";
    if (detailData.paymentStatus.toLowerCase().includes("dp")) return detailData.paymentStatus;
    if (detailData.paymentStatus.toLowerCase() === "refund") return "Refund";
    if (detailData.paymentStatus.toLowerCase() === "canceled") return "Cancel";
    return "Belum Bayar";
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
              ["Atas Nama", detailData.bookingName],
              ["Cabang", firstDetail?.locationName || "N/A"],
              ["Lapangan", detailData.lapangan],
              ["Tanggal Pemesanan", formatDate(detailData.date)],
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
              {["Lapangan", "Waktu", "Harga"].map((h) => (
                <th key={h} className="p-2 bg-[#2C473A] font-semibold text-white text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detailData.details.map((detail, i) => (
              <tr key={i} className="border-t border-[#6CC28F]">
                <td className="p-2 text-center">{detail.lapangan}</td>
                <td className="p-2 text-center">{detail.time}</td>
                <td className="p-2 text-center">{formatCurrency(detail.price)}</td>
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
              ["Status Booking", detailData.reservationStatus],
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