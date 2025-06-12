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

// Updated interface for paginated API response
interface ApiResponse {
  success: boolean;
  message: string;
  data: Reservation[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Cancel form data interface
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

  // Parse booking date
  const bookingDateTime = new Date(bookingDate);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const bookingDateOnly = new Date(bookingDate);
  bookingDateOnly.setHours(0, 0, 0, 0);
  
  const diffInDays = (bookingDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  
  return diffInDays > 1;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // New state for backend pagination
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [allData, setAllData] = useState<Reservation[]>([]); // Store all data for frontend filtering

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Updated fetchBookingData to handle pagination (without search parameter)
  const fetchBookingData = async (page: number = 1, limit: number = 50) => {
    try {
      setLoading(true);
      const token = getCookie("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const userId = getUser()?.id;
      console.log('userId:', userId);

      if (!userId) {
        throw new Error("User ID tidak ditemukan dalam token");
      }

      // Build query parameters (fetch all data for frontend filtering)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/history/user/${userId}?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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

        if (page === 1) {
          setAllData(updatedData);
        } else {
          setAllData(prev => [...prev, ...updatedData]);
        }

        setTotalPages(result.meta.last_page);
        setTotalEntries(result.meta.total);

        // If there are more pages, fetch them automatically
        if (page < result.meta.last_page) {
          fetchBookingData(page + 1, limit);
        }
      } else {
        throw new Error(result.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching booking data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      if (page === 1 || page === totalPages) {
        setLoading(false);
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (!isClient) return;
    fetchBookingData(1, 50); // Fetch more data initially
  }, [isClient]);

  // Handle entries per page change
  useEffect(() => {
    if (!isClient) return;
    setCurrentPage(1);
  }, [entriesPerPage, isClient]);

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
              onClick={() => fetchBookingData(1, 50)}
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
        // Refresh data
        fetchBookingData(1, 50);
      } else {
        throw new Error(result.message || "Gagal membatalkan pemesanan");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert(error instanceof Error ? error.message : "Terjadi kesalahan saat membatalkan pemesanan");
    }
  };

  const handleChangeEntries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEntriesPerPage = Number(e.target.value);
    setEntriesPerPage(newEntriesPerPage);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Frontend filtering and pagination
  const filteredData = allData.filter((booking) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      booking.reservationId.toString().includes(searchStr) ||
      booking.name.toLowerCase().includes(searchStr) ||
      (booking.details[0]?.fieldName.split(" - ")[0] || "").toLowerCase().includes(searchStr) ||
      (booking.details[0]?.fieldName.split(" - ")[1] || "").toLowerCase().includes(searchStr) ||
      (new Date(booking.details[0]?.date || "").toLocaleDateString("id-ID")).toLowerCase().includes(searchStr) ||
      booking.total.toString().toLowerCase().includes(searchStr) ||
      booking.paymentStatus.toLowerCase().includes(searchStr) ||
      booking.status.toLowerCase().includes(searchStr) ||
      booking.locationName.toLowerCase().includes(searchStr)
    );
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const paginationTotalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Calculate pagination display info
  const highlightText = (text: string) => text; // Placeholder for highlighting

  return (
    <UserLayout>
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-5 md:py-10">
        <div className="mb-4 flex items-center gap-2">
          <Image src="/icons/arrow.svg" alt="-" width={26} height={26} />
          <p className="text-2xl font-semibold text-black">Riwayat Pemesanan</p>
        </div>

        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm">Tampilkan</label>
            <select
              className="rounded border px-2 py-1 text-sm"
              value={entriesPerPage}
              onChange={handleChangeEntries}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm">Baris</span>
          </div>

          <div className="w-full md:ml-3 mt-3 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari..."
                className="w-full rounded border px-3 py-1 pl-8 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            </div>
          </div>
        </div>

        {/* Show entries info */}
        <div className="mb-2 text-sm text-gray-600">
          Menampilkan {currentEntries.length > 0 ? indexOfFirstEntry + 1 : 0} hingga {Math.min(indexOfLastEntry, filteredData.length)} dari {filteredData.length} baris
          {searchTerm && filteredData.length !== allData.length && ` (filtered from ${allData.length} total entries)`}
        </div>

        <div className="overflow-auto rounded-md border">
          <table className="min-w-full text-sm">
            <thead className="bg-[#2C473A] text-white">
              <tr>
                <TableHeader label="Lokasi Cabang" />
                <TableHeader label="Tanggal Pemesanan" />
                <TableHeader label="Total Harga" />
                <TableHeader label="Pembayaran" />
                <TableHeader label="Status" />
                <TableHeader label="Aksi" />
              </tr>
            </thead>
            <tbody>
              {currentEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    {searchTerm ? "Tidak ada data yang sesuai dengan pencarian" : "Tidak ada data pemesanan"}
                  </td>
                </tr>
              ) : (
                currentEntries.map((booking, index) => (
                  <tr
                    key={booking.reservationId}
                    className={cn(
                      index % 2 === 0 ? "bg-[#E5FFA8]" : "bg-white",
                      "border-b"
                    )}
                  >
                    <td className="px-4 py-2">{highlightText(booking.locationName)}</td>
                    <td className="px-4 py-2">
                      {/* {highlightText(new Date(booking.details[0]?.date || "").toLocaleDateString("id-ID"))} */}
                      {highlightText(new Date(booking.created_at || "").toLocaleDateString("id-ID"))}
                    </td>
                    <td className="px-4 py-2">
                      {highlightText(`Rp. ${booking.total.toLocaleString("id-ID")}`)}
                    </td>
                    <td className="px-4 py-2">{highlightText(booking.paymentStatus)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1.5 font-medium text-xs",
                          booking.status === "upcoming" && "bg-orange-100 text-orange-600",
                          booking.status === "complete" && "bg-green-100 text-green-600",
                          booking.status === "ongoing" && "bg-blue-100 text-blue-600",
                          booking.status === "canceled" && "bg-red-100 text-red-600",
                          booking.status === "waiting" && "bg-yellow-100 text-yellow-600",
                          booking.status.includes("refund") && "bg-yellow-100 text-yellow-600",
                          booking.status === "rejected" && "bg-red-100 text-red-600"
                        )}
                      >
                        {highlightText(
                          booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-2 w-[180px]">
                      <div className="flex items-center gap-2">
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Updated Pagination */}
        {paginationTotalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "text-sm font-semibold text-black",
                currentPage === 1
                  ? "cursor-not-allowed text-gray-400"
                  : "hover:text-[#2C473A]"
              )}
            >
              Previous
            </button>

            {/* Page numbers with smart display */}
            {(() => {
              const pages = [];
              const showEllipsis = paginationTotalPages > 7;

              if (showEllipsis) {
                // Always show first page
                pages.push(1);

                if (currentPage > 4) {
                  pages.push('...');
                }

                // Show pages around current page
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(paginationTotalPages - 1, currentPage + 1);

                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }

                if (currentPage < paginationTotalPages - 3) {
                  pages.push('...');
                }

                // Always show last page
                if (paginationTotalPages > 1) {
                  pages.push(paginationTotalPages);
                }
              } else {
                for (let i = 1; i <= paginationTotalPages; i++) {
                  pages.push(i);
                }
              }

              return pages.map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium",
                      currentPage === page
                        ? "bg-[#C5FC40] text-black"
                        : "bg-transparent text-black hover:bg-[#C5FC40] hover:text-black"
                    )}
                  >
                    {page}
                  </button>
                );
              });
            })()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === paginationTotalPages}
              className={cn(
                "text-sm font-semibold text-black",
                currentPage === paginationTotalPages
                  ? "cursor-not-allowed text-gray-400"
                  : "hover:text-[#2C473A]"
              )}
            >
              Next
            </button>
          </div>
        )}

        {/* Modals */}
        {showModal && selectedBooking && (
          <BookingDetailModal
            booking={{
              id: `#${selectedBooking.reservationId}`,
              branch: selectedBooking.locationName,
              name: selectedBooking.name,
              court: selectedBooking.details[0]?.fieldName.split(" - ")[1] || "N/A",
              date: new Date(selectedBooking.details[0]?.date || "").toLocaleDateString("id-ID"),
              total: `Rp. ${selectedBooking.total.toLocaleString("id-ID")}`,
              payment: selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1),
              status: selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1),
              originalData: selectedBooking,
            }}
            onClose={handleCloseModal}
          />
        )}

        {/* Position the cancel modal with fixed positioning to overlay on top of existing content */}
        {showCancelModal && bookingToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="z-50 w-full max-w-md">
              <CancelBookingModal
                booking={{
                  originalData: bookingToCancel,
                }}
                onClose={handleCloseCancelModal}
                onConfirm={handleConfirmCancel}
              />
            </div>
          </div>
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