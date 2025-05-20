'use client'; // Tambahkan ini karena kita akan menggunakan hooks

import PaymentDetailsSection from "@/components/payment/PaymentDetailSection";
import { useSearchParams } from "next/navigation";
import UserLayout from "@/app/user/layout";
import { useEffect, useState } from "react";
import { getLocationById } from "@/lib/api/location";

interface BookingSlot {
  date: string;
  time: string;
  court: string;
  price: number;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<any[]>([]);
  const [location, setLocation] = useState<string>("");
  const [subtotal, setSubtotal] = useState<number>(0);

  useEffect(() => {
    // Ambil data dari query parameters
    const selectedSlotsParam = searchParams.get('selectedSlots');
    const locationId = searchParams.get('locationId');
    const paymentType = searchParams.get('paymentType');

    if (selectedSlotsParam) {
      const selectedSlots: BookingSlot[] = JSON.parse(selectedSlotsParam);

      // Format data sesuai dengan yang dibutuhkan oleh PaymentDetailsSection
      const formattedBookings = selectedSlots.map(slot => ({
        field: slot.court,
        date: slot.date,
        times: [slot.time],
        pricePerSlot: slot.price,
      }));

      setBookings(formattedBookings);
      setSubtotal(selectedSlots.reduce((sum, slot) => sum + slot.price, 0));
      
      // Anda bisa fetch nama lokasi berdasarkan locationId jika diperlukan
      const fetchLocationName = getLocationById(Number(locationId));
      setLocation("Lapangan Futsal XYZ"); // Ganti dengan nama lokasi sebenarnya
    }
  }, [searchParams]);

  return (
    <div>
      <UserLayout>
        <div className="p-4 space-y-4 px-4">
          <div className="space-y-4">
            <PaymentDetailsSection data={{ bookings, location, subtotal }} />
          </div>
        </div>
      </UserLayout>
    </div>
  );
}