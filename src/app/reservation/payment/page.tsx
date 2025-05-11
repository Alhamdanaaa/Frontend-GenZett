import NavUser from "@/components/user/navbar-user"
import PaymentDetailsSection from "@/components/payment/PaymentDetailSection"
import { Metadata } from "next"
import { fetchBookingMockList } from "@/constants/mock-api" // IMPORT FUNGSI MOCK

export const metadata: Metadata = {
  title: "Reservasi | Pembayaran",
  description: "Halaman Pembayaran untuk reservasi lapangan",
  keywords: "pembayaran, reservasi, lapangan",
}

// Ambil 2 data booking palsu
const mockData = fetchBookingMockList(2) // bisa ubah jumlah jika ingin
const bookings = mockData.map((item) => ({
  field: item.reservationDetail.field.name,
  date: item.reservationDetail.date,
  times: [item.reservationDetail.time.time], // kalau satu jam
  pricePerSlot: item.reservationDetail.time.price,
}))
const location = mockData[0].reservationDetail.field.location.locationName // ambil lokasi pertama

const subtotal = bookings.reduce(
  (total, item) => total + item.times.length * item.pricePerSlot,
  0
)

export default function PaymentPage() {
  return (
    <div>
      <NavUser />
      <div className="p-4 space-y-4 bg-white px-4">
        <div className="space-y-4">
          <PaymentDetailsSection data={{ bookings, location, subtotal }} />
        </div>
      </div>
    </div>
  )
}
