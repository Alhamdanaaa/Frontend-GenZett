"use client";

import { Button } from "@/components/ui/button";

type Booking = {
  id: string;
  branch: string;
  name: string;
  court: string;
  date: string;
  total: string; // contoh: "Rp. 300.000"
  payment: string; // "DP" | "Lunas" | "Waiting"
  status: string;
};

export default function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const courts = booking.court.split(", ");
  const times = ["15:00 – 16:00", "16:00 – 17:00"];
  const prices = ["Rp. 180.000", "Rp. 120.000"];

  // Helper untuk parsing dan formatting uang
  const parseCurrency = (rupiah: string): number => {
    return Number(rupiah.replace(/[^\d]/g, ""));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalAmount = parseCurrency(booking.total);
  const halfAmount = totalAmount / 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg max-w-lg sm:max-w-md md:max-w-xl lg:max-w-2xl w-full shadow-xl space-y-6 overflow-auto max-h-[80vh]">
        <h2 className="text-lg font-semibold mb-4">Detail Pesanan</h2>

        {/* Seksi 1 */}
        <table className="w-full table-fixed border-collapse border border-[#6CC28F]">
          <tbody>
            {[
              ["Invoice ID", booking.id],
              ["Atas Nama", booking.name],
              ["Cabang", booking.branch],
              ["Tanggal Pemesanan", booking.date],
            ].map(([label, val], i) => (
              <tr key={i} className="border-b border-[#6CC28F]">
                <td className="w-1/3 bg-[#2C473A] text-white font-semibold p-3">{label}</td>
                <td className="p-3">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Seksi 2 */}
        <table className="w-full text-sm border-collapse border border-[#6CC28F]">
          <thead>
            <tr>
              {["Lapangan", "Waktu", "Harga"].map((h) => (
                <th key={h} className="p-2 bg-[#2C473A] text-white text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courts.map((c, i) => (
              <tr key={i} className="border-t border-[#6CC28F]">
                <td className="p-2 text-center">{c}</td>
                <td className="p-2 text-center">{times[i]}</td>
                <td className="p-2 text-center">{prices[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Seksi 3 */}
        <table className="w-full table-fixed border-collapse border border-[#6CC28F]">
          <tbody>
            {[
              ["Total Harga", booking.total],
              [
                "Jenis Pembayaran",
                booking.payment === "DP"
                  ? `DP (${formatCurrency(halfAmount)})`
                  : booking.payment,
              ],
              [
                "Sisa Pembayaran",
                booking.payment === "DP"
                  ? formatCurrency(halfAmount)
                  : formatCurrency(0),
              ],
              ["Status", booking.status],
            ].map(([label, val], i) => (
              <tr key={i} className={i < 3 ? "border-b border-[#6CC28F]" : ""}>
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
    </div>
  );
}
