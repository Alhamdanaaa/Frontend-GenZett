"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Type definitions for API response
interface ApiTime {
  timeId: number;
  fieldId: number;
  time: string;
  status: string;
  price: number;
  created_at: string;
  updated_at: string;
}

interface ApiSport {
  sportId: number;
  sportName: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ApiLocation {
  locationId: number;
  locationName: string;
  description: string;
  locationPath: string;
  address: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ApiField {
  fieldId: number;
  locationId: number;
  sportId: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  location: ApiLocation;
  sport: ApiSport;
}

interface ApiDetail {
  detailId: number;
  reservationId: number;
  fieldId: number;
  timeId: number;
  date: string;
  created_at: string;
  updated_at: string;
  field: ApiField;
  time: ApiTime;
}

interface ApiUser {
  userId: number;
  role: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ApiPayment {
  paymentId: number;
  reservationId: number;
  invoiceDate: string;
  totalPaid: number;
  created_at: string;
  updated_at: string;
}

interface ApiReservationDetail {
  reservationId: number;
  userId: number;
  name: string;
  paymentStatus: string;
  total: number;
  created_at: string;
  updated_at: string;
  details: ApiDetail[];
  user: ApiUser;
  payment: ApiPayment;
}

interface ApiDetailResponse {
  success: boolean;
  message: string;
  data: ApiReservationDetail;
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
};

export default function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const [detailData, setDetailData] = useState<ApiReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  }

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format time from 24hr to display format
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const startHour = parseInt(hours);
    const endHour = startHour + 1;
    return `${startHour.toString().padStart(2, '0')}:${minutes} – ${endHour.toString().padStart(2, '0')}:${minutes}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Fetch detailed reservation data
  useEffect(() => {
    const fetchReservationDetail = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Extract reservation ID from booking.id (remove '#' prefix)
        const reservationId = booking.id.replace('#', '');

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reservations/${reservationId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiDetailResponse = await response.json();
        
        if (result.success && result.data) {
          setDetailData(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch reservation details');
        }
      } catch (err) {
        console.error('Error fetching reservation details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetail();
  }, [booking.id]);

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <div className="text-center py-8">
            <p>Loading detail pemesanan...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black">
              Tutup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If no detail data, fallback to original booking data
  if (!detailData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <div className="text-center py-8">
            <p>No detail data available</p>
            <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black mt-4">
              Tutup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate payment information
  const totalPaid = detailData.payment?.totalPaid || 0;
  const totalAmount = detailData.total;
  const remainingAmount = totalAmount - totalPaid;
  const isFullyPaid = detailData.paymentStatus === 'complete';
  const isPartiallyPaid = totalPaid > 0 && totalPaid < totalAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg max-w-lg sm:max-w-md md:max-w-xl lg:max-w-2xl w-full shadow-xl space-y-6 overflow-auto max-h-[80vh]">
        <h2 className="text-lg font-semibold mb-4">Detail Pesanan</h2>

        {/* Seksi 1 - Basic Information */}
        <table className="w-full table-fixed border-collapse border border-[#6CC28F]">
          <tbody>
            {[
              ["Invoice ID", `#${detailData.reservationId}`],
              ["Atas Nama", detailData.name],
              ["Cabang", detailData.details[0]?.field?.location?.locationName || "N/A"],
              ["Alamat", detailData.details[0]?.field?.location?.address || "N/A"],
              ["Tanggal Pemesanan", formatDate(detailData.details[0]?.date || detailData.created_at)],
            ].map(([label, val], i) => (
              <tr key={i} className="border-b border-[#6CC28F]">
                <td className="w-1/3 bg-[#2C473A] text-white font-semibold p-3">{label}</td>
                <td className="p-3">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Seksi 2 - Field and Time Details */}
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
            {detailData.details.map((detail, i) => (
              <tr key={i} className="border-t border-[#6CC28F]">
                <td className="p-2 text-center">{detail.field.name}</td>
                <td className="p-2 text-center">{formatTime(detail.time.time)}</td>
                <td className="p-2 text-center">{formatCurrency(detail.time.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Seksi 3 - Payment Information */}
        <table className="w-full table-fixed border-collapse border border-[#6CC28F]">
          <tbody>
            {[
              ["Total Harga", formatCurrency(totalAmount)],
              ["Sudah Dibayar", formatCurrency(totalPaid)],
              ["Sisa Pembayaran", formatCurrency(remainingAmount)],
              [
                "Status Pembayaran", 
                isFullyPaid ? "Lunas" : 
                isPartiallyPaid ? "DP (Sebagian)" : 
                "Belum Bayar"
              ],
              ["Status Booking", booking.status],
            ].map(([label, val], i) => (
              <tr key={i} className={i < 4 ? "border-b border-[#6CC28F]" : ""}>
                <td className="w-1/3 bg-[#2C473A] text-white font-semibold p-3">{label}</td>
                <td className="p-3">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Additional Information */}
        <table className="w-full table-fixed border-collapse border border-[#6CC28F]">
          <tbody>
            {[
              ["Jenis Olahraga", detailData.details[0]?.field?.sport?.sportName || "N/A"],
              ["Email", detailData.user.email],
              ["Telepon", detailData.user.phone],
              ["Tanggal Invoice", detailData.payment ? formatDate(detailData.payment.invoiceDate) : "N/A"],
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