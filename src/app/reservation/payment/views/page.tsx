'use client';

import PaymentDetailsSection from "@/components/payment/PaymentDetailSection";
import { useSearchParams } from "next/navigation";
import UserLayout from "@/app/user/layout";
import { useEffect, useState } from "react";
import { getLocationById } from "@/lib/api/location";

interface BookingSlot {
  date: string;
  court: string;
  fieldId: string;
  times: string[];
  timeIds: string[];
  price: number;
}

interface PaymentData {
  bookings: BookingSlot[]; // Langsung kirim struktur terorganisir
  locationId: string;
  paymentType: 'reguler' | 'membership';
  userId: string;
  membershipId?: string;
  subtotal: number;
  discount?: number;
  total: number;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<any[]>([]);
  const [location, setLocation] = useState<string>("");
  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<"reguler" | "membership">("reguler");
  const [userId, setUserId] = useState<string>("");
  const [membershipId, setMembershipId] = useState<string | null>(null);

  useEffect(() => {
    const encodedData = searchParams.get('data');

    if (encodedData) {
      try {
        const decodedData: PaymentData = JSON.parse(decodeURIComponent(encodedData));

        setBookings(decodedData.bookings);
        setSubtotal(decodedData.subtotal);
        setTotal(decodedData.total);
        setDiscount(decodedData.discount ?? 0);
        setPaymentType(decodedData.paymentType);
        setUserId(decodedData.userId);
        setMembershipId(decodedData.membershipId || null);

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
              total,
              subtotal,
              discount,
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