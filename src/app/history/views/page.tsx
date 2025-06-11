"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import UserLayout from "@/app/user/layout";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Search, X } from "lucide-react";
import Image from "next/image";

import BookingDetailModal from "@/components/modal/BookingDetailModal";
import BookingHistoryGuestPage from "../guest/page";

import CancelBookingModal from "@/features/history/components/cancel-booking-modal";
import TableHeader from "@/features/history/components/table-header";
import { getUser } from "@/lib/api/auth";

// Type definitions based on API response
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
  remainingPayment: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Reservation[];
}

// Cancel form data interface
// src/types.ts
export interface CancelFormData {
  paymentPlatform?: string;
  accountName?: string;
  accountNumber?: string;
  reason?: string;
}



function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}
const getStatusFromTime = (dateStr: string, timeStr: string): "complete" | "ongoing" | "upcoming" => {
  const now = new Date();

  // Gabungkan tanggal dan waktu
  const [hour, minute] = timeStr.split(":").map(Number);
  const combinedDate = new Date(dateStr);
  combinedDate.setHours(hour, minute, 0, 0);

  const diff = combinedDate.getTime() - now.getTime();

  if (diff < -60 * 60 * 1000) return "complete"; // lebih dari 1 jam yang lalu
  if (diff <= 0) return "ongoing"; // sekarang
  return "upcoming";
};

const canCancelBooking = (bookingDate: string, bookingTime: string, paymentStatus: string): boolean => {
  // Only show cancel button if payment status is dp or complete
  if (paymentStatus !== "dp" && paymentStatus !== "complete") {
    return false;
  }
  
  // Parse booking date and time
  const [hour, minute] = bookingTime.split(":").map(Number);
  const bookingDateTime = new Date(bookingDate);
  bookingDateTime.setHours(hour, minute, 0, 0);
  
  // Current time
  const now = new Date();
  
  // Calculate difference in milliseconds, then convert to hours
  const diffInHours = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  // Return true if more than 1 hour before booking starts
  return diffInHours > 1;
};

export default function HistoryPage() {
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Reservation;
    direction: "asc" | "desc";
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Reservation | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchBookingData = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // const decoded: any = jwtDecode(token);
        // const userId = decoded.user_id;
        const userId = getUser()?.id;
        console.log('userId:', userId);

        if (!userId) {
          throw new Error("User ID tidak ditemukan dalam token");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/user/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        console.log('result:', result);

        if (result.success && result.data) {
          const updatedData = result.data.map((booking) => {
            const firstDetail = booking.details[0];
            const status = getStatusFromTime(firstDetail.date, firstDetail.time.time);
            return { ...booking, status };
          });
          setData(updatedData);
        }else {
          throw new Error(result.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [isClient]);

  if (!isClient) {
    return (
      <UserLayout>
        <div className="mx-auto flex max-w-6xl flex-col px-4 py-5 md:py-10">
          <div className="py-8 text-center">
            <p>Loading...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  const token = getCookie("token");
  if (!token) {
    return <BookingHistoryGuestPage />;
  }

  if (loading) {
    return (
      <UserLayout>
        <div className="mx-auto flex max-w-6xl flex-col px-4 py-5 md:py-10">
          <div className="py-8 text-center">
            <p>Loading...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="mx-auto flex max-w-6xl flex-col px-4 py-5 md:py-10">
          <div className="py-8 text-center text-red-600">
            <p>Error: {error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#C5FC40] text-black hover:bg-lime-300"
            >
              Retry
            </Button>
          </div>
        </div>
      </UserLayout>
    );
  }

  const handleSort = (key: keyof Reservation) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...data].sort((a, b) => {
      let aValue = a[key] !== null && a[key] !== undefined ? a[key].toString().toLowerCase() : "";
      let bValue = b[key] !== null && b[key] !== undefined ? b[key].toString().toLowerCase() : "";

      if (key === "details" && a.details && b.details) {
        aValue = a.details[0]?.fieldName || "";
        bValue = b.details[0]?.fieldName || "";
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const handleOpenModal = (booking: Reservation) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  const handleCancelBooking = (booking: Reservation) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setBookingToCancel(null);
    setShowCancelModal(false);
  };

  const handleConfirmCancel = async (formData: CancelFormData) => {
    if (!bookingToCancel) return;

    try {
      const token = getCookie("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const reservationId = bookingToCancel.reservationId;

      let response;
      let result;

      if (bookingToCancel.paymentStatus === "complete") {
        const requestBody = {
          reservationId: reservationId,
          reason: formData.reason,
          paymentPlatform: formData.paymentPlatform,
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
        };

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cancellations/refund`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      } else if (bookingToCancel.paymentStatus === "dp") {
        const requestBody = {
          reservationId: reservationId,
        };

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cancellations/${reservationId}/dp`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        throw new Error("Status pembayaran tidak valid");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      result = await response.json();

      if (result.success) {
        alert(result.message || "Permintaan pembatalan berhasil dikirim");
        handleCloseCancelModal();
        window.location.reload();
      } else {
        throw new Error(result.message || "Gagal membUniversal pemesanan");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert(error instanceof Error ? error.message : "Terjadi kesalahan saat membatalkan pemesanan");
    }
  };


  const filteredData = data.filter((booking) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      booking.reservationId.toString().includes(searchStr) ||
      booking.name.toLowerCase().includes(searchStr) ||
      (booking.details[0]?.fieldName.split(" - ")[0] || "").toLowerCase().includes(searchStr) ||
      (booking.details[0]?.fieldName.split(" - ")[1] || "").toLowerCase().includes(searchStr) ||
      (new Date(booking.details[0]?.date || "").toLocaleDateString("id-ID")).toLowerCase().includes(searchStr) ||
      booking.total.toString().toLowerCase().includes(searchStr) ||
      booking.paymentStatus.toLowerCase().includes(searchStr) ||
      booking.status.toLowerCase().includes(searchStr)
    );
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handleChangeEntries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const highlightText = (text: string) => text; // Placeholder for highlighting

  return (
    <UserLayout>
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-5 md:py-10">
        <div className="mb-4 flex items-center gap-2">
          <Image src="/icons/arrow.svg" alt="-" width={26} height={26} />
          <p className="text-2xl font-semibold text-black">Riwayat Pemesanan</p>
        </div>

        <div className="mb-4 flex flex-col md:flex-row">
          <div className="flex items-center gap-2">
            <label className="text-sm">Show</label>
            <select
              className="rounded border px-2 py-1 text-sm"
              value={entriesPerPage}
              onChange={handleChangeEntries}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm">entries</span>
          </div>

          <div className="mt-2 ml-auto flex-1 md:mt-0 md:ml-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded border px-3 py-1 pl-8 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-auto rounded-md border">
          <table className="min-w-full text-sm">
            <thead className="bg-[#2C473A] text-white">
              <tr>
                <TableHeader
                  label="Cabang"
                  sortable
                  onSort={() => handleSort("name")}
                  sortDirection={sortConfig?.key === "name" ? sortConfig.direction : null}
                />
                {/* <TableHeader
                  label="Lapangan"
                  sortable
                  onSort={() => handleSort("name")}
                  sortDirection={sortConfig?.key === "name" ? sortConfig.direction : null}
                /> */}
                <TableHeader
                  label="Tanggal"
                  sortable
                  onSort={() => handleSort("created_at")}
                  sortDirection={sortConfig?.key === "created_at" ? sortConfig.direction : null}
                />
                <TableHeader
                  label="Total"
                  sortable
                  onSort={() => handleSort("total")}
                  sortDirection={sortConfig?.key === "total" ? sortConfig.direction : null}
                />
                <TableHeader
                  label="Pembayaran"
                  sortable
                  onSort={() => handleSort("paymentStatus")}
                  sortDirection={sortConfig?.key === "paymentStatus" ? sortConfig.direction : null}
                />
                <TableHeader
                  label="Status"
                  sortable
                  onSort={() => handleSort("status")}
                  sortDirection={sortConfig?.key === "status" ? sortConfig.direction : null}
                />
                <TableHeader label="Aksi" />
              </tr>
            </thead>
            <tbody>
              {currentEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    {data.length === 0 ? "Tidak ada data pemesanan" : "Data tidak ditemukan"}
                  </td>
                </tr>
              ) : (
                currentEntries.map((booking, index) => (
                  <tr
                    key={index}
                    className={cn(
                      index % 2 === 0 ? "bg-[#E5FFA8]" : "bg-white",
                      "border-b"
                    )}
                  >
                    <td className="px-4 py-2">{highlightText(booking.locationName)}</td>
                    {/* <td className="px-4 py-2">{highlightText(booking.details[0]?.fieldName.split(" - ")[1] || "N/A")}</td> */}
                    <td className="px-4 py-2">{highlightText(new Date(booking.details[0]?.date || "").toLocaleDateString("id-ID"))}</td>
                    <td className="px-4 py-2">{highlightText(`Rp. ${booking.total.toLocaleString("id-ID")}`)}</td>
                    <td className="px-4 py-2">{highlightText(booking.paymentStatus)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={cn(
                          "rounded-full px-3 py-2 font-medium",
                          booking.status === "upcoming" && "bg-orange-100 text-orange-600",
                          booking.status === "completed" && "bg-green-100 text-green-600",
                          booking.status === "ongoing" && "bg-blue-100 text-blue-600",
                          booking.status === "canceled" && "bg-red-100 text-red-600",
                          booking.status === "waiting" && "bg-yellow-100 text-yellow-600",
                          booking.status.includes("refund") && "bg-yellow-100 text-yellow-600",
                          booking.status === "rejected" && "bg-red-100 text-red-600"
                        )}
                      >
                        {highlightText(booking.status.charAt(0).toUpperCase() + booking.status.slice(1))}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        className="rounded-full bg-[#C5FC40] text-black hover:bg-lime-300"
                        size="sm"
                        onClick={() => handleOpenModal(booking)}
                      >
                        Detail
                      </Button>
                      {booking.status === "upcoming" && 
                        canCancelBooking(
                          booking.details[0].date, 
                          booking.details[0].time.time, 
                          booking.paymentStatus
                        ) && (
                          <Button
                            className="ml-2 rounded-full bg-[#ff0303] hover:bg-[#ba1004] hover:text-white"
                            size="sm"
                            onClick={() => handleCancelBooking(booking)}
                          >
                            {highlightText("Cancel")}
                          </Button>
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "text-sm font-semibold text-black",
                currentPage === 1 ? "cursor-not-allowed text-gray-400" : "hover:text-[#2C473A]"
              )}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium",
                  currentPage === i + 1 ? "bg-[#C5FC40] text-black" : "bg-transparent text-black hover:bg-[#C5FC40] hover:text-black"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "text-sm font-semibold text-black",
                currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "hover:text-[#2C473A]"
              )}
            >
              Next
            </button>
          </div>
        )}

        {showModal && selectedBooking && (
          <BookingDetailModal booking={{ 
            id: `#${selectedBooking.reservationId}`, 
            branch: selectedBooking.locationName,
            name: selectedBooking.name, 
            court: selectedBooking.details[0]?.fieldName.split(" - ")[1] || "N/A", 
            date: new Date(selectedBooking.details[0]?.date || "").toLocaleDateString("id-ID"), 
            total: `Rp. ${selectedBooking.total.toLocaleString("id-ID")}`, 
            payment: selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1), 
            status: selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1), 
            originalData: selectedBooking 
          }} onClose={handleCloseModal} />
        )}
        {showCancelModal && bookingToCancel && (
        <CancelBookingModal
          booking={{
            originalData: bookingToCancel,
          }}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancel}
        />
      )}

        <style jsx>{`
          tbody {
            color: black;
          }
        `}</style>
      </div>
    </UserLayout>
  );
}