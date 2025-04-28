// components/modal/BookingDetailModal.tsx
"use client"

import { Button } from "@/components/ui/button"

type Booking = {
  id: string
  branch: string
  name: string
  court: string
  date: string
  total: string
  payment: string
  status: string
}

export default function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: Booking
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Detail Pesanan</h2>

        <div className="border border-gray-300 mb-4">
          <table className="w-full text-sm">
            <tbody>
              <tr className="bg-gray-100">
                <td className="p-2 font-semibold">Invoice ID</td>
                <td className="p-2">{booking.id}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Atas Nama</td>
                <td className="p-2">{booking.name}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="p-2 font-semibold">Cabang</td>
                <td className="p-2">{booking.branch}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Tanggal Pemesanan</td>
                <td className="p-2">{booking.date}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="p-2">Lapangan</th>
                <th className="p-2">Waktu</th>
                <th className="p-2">Harga</th>
              </tr>
            </thead>
            <tbody>
              {booking.court.split(", ").map((c, i) => (
                <tr key={i} className="text-center border-t">
                  <td className="p-2">{c}</td>
                  <td className="p-2">{i === 0 ? "15:00 – 16:00" : "16:00 – 17:00"}</td>
                  <td className="p-2">
                    {i === 0 ? "Rp. 180.000" : "Rp. 120.000"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-300 mb-4">
          <table className="w-full text-sm">
            <tbody>
              <tr className="bg-gray-100">
                <td className="p-2 font-semibold">Total Harga</td>
                <td className="p-2">{booking.total}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Jenis Pembayaran</td>
                <td className="p-2">
                  {booking.payment === "DP" ? "DP (Rp. 150.000)" : booking.payment}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="p-2 font-semibold">Sisa Pembayaran</td>
                <td className="p-2">
                  {booking.payment === "DP" ? "Rp. 150.000" : "Rp. 0"}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Status</td>
                <td className="p-2 border border-purple-400">{booking.status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-center">
          <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}
