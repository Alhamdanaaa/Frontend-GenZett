'use client';

import PaymentDetailsSection from "@/components/payment/PaymentDetailSection";
import { useSearchParams } from "next/navigation";
import UserLayout from "@/app/user/layout";
import { useEffect, useState } from "react";
import { getLocationById } from "@/lib/api/location";

interface BookingSlot {
  date: string;
  time: string;
  timeId: string;
  court: string;
  fieldId: string;
  price: number;
}

interface PaymentData {
  selectedSlots: BookingSlot[];
  locationId: string;
  paymentType: string;
  userId: string;
  membershipId?: string;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<any[]>([]);
  const [location, setLocation] = useState<string>("");
  const [subtotal, setSubtotal] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<"reguler" | "membership">("reguler");
  const [userId, setUserId] = useState<string>("");
  const [membershipId, setMembershipId] = useState<string | null>(null);

  useEffect(() => {
    // Ambil data dari query parameters
    const encodedData = searchParams.get('data');
    
    if (encodedData) {
      try {
        const decodedData: PaymentData = JSON.parse(decodeURIComponent(encodedData));
        
        // Format data untuk PaymentDetailsSection
        const formattedBookings = decodedData.selectedSlots.map(slot => ({
          field: slot.court,
          date: slot.date,
          times: [slot.time],
          timeIds: [slot.timeId],
          price: slot.price,
          fieldId: slot.fieldId // Pastikan fieldId disertakan
        }));

        setBookings(formattedBookings);
        setSubtotal(decodedData.selectedSlots.reduce((sum, slot) => sum + slot.price, 0));
        // Ensure paymentType is either "Reguler" or "membership"
        setPaymentType(decodedData.paymentType === "membership" ? "membership" : "reguler");
        setUserId(decodedData.userId);
        setMembershipId(decodedData.membershipId || null);

        // Fetch lokasi berdasarkan locationId
        const fetchLocationName = async () => {
          try {
            const response = await getLocationById(Number(decodedData.locationId));
            setLocation(response?.locationName || "Lapangan Futsal");
          } catch (error) {
            console.error("Gagal mengambil data lokasi:", error);
            setLocation("Lapangan Futsal");
          }
        };

        fetchLocationName();
      } catch (error) {
        console.error("Error parsing payment data:", error);
        // Fallback jika parsing gagal
        setBookings([]);
        setSubtotal(0);
        setLocation("Lapangan Futsal");
      }
    }
  }, [searchParams]);

  return (
    <UserLayout>
      <div className="p-4 space-y-4 px-4">
        <div className="space-y-4">
          <PaymentDetailsSection 
            data={{ 
              bookings, 
              location, 
              subtotal,
              paymentType,
              userId,
              membershipId
            }} 
          />
        </div>
      </div>
    </UserLayout>
  );
}