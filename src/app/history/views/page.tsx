"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import UserLayout from "@/app/user/layout";
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, Search } from "lucide-react"
import Image from "next/image"
import BookingDetailModal from "@/components/modal/BookingDetailModal"
import BookingHistoryGuestPage from "../guest/page"
import { jwtDecode } from "jwt-decode"

// Type definitions for the API response
interface ApiDetail {
  detailId: number;
  reservationId: number;
  fieldId: number;
  timeId: number;
  date: string;
  created_at: string;
  updated_at: string;
}

interface ApiReservation {
  reservationId: number;
  userId: number;
  name: string;
  paymentStatus: string;
  total: number;
  created_at: string;
  updated_at: string;
  details: ApiDetail[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  user: {
    userId: number;
    role: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  data: ApiReservation[];
}

  // Type for the transformed booking data
interface BookingData {
  id: string;
  reservationId: number; // Add this to store the actual reservation ID
  branch: string;
  name: string;
  court: string;
  date: string;
  total: string;
  payment: string;
  status: string;
}

const TableHeader = ({
  label,
  sortable = false,
  onSort,
  sortDirection,
}: {
  label: string
  sortable?: boolean
  onSort?: () => void
  sortDirection?: "asc" | "desc" | null
}) => (
  <th className="py-3 px-4 font-semibold text-left whitespace-nowrap">
    <div
      className={cn("flex items-center gap-1", sortable && "cursor-pointer")}
      onClick={onSort}
    >
      {label}
      {sortable && (
        <div className="flex flex-col justify-center ml-1">
          <ChevronUp
            className={cn(
              "w-[10px] h-[10px]",
              sortDirection === "asc" ? "opacity-100 text-[#C5FC40]" : "opacity-40"
            )}
          />
          <ChevronDown
            className={cn(
              "w-[10px] h-[10px] text-white -mt-[2px]",
              sortDirection === "desc" ? "opacity-100 text-[#C5FC40]" : "opacity-40"
            )}
          />
        </div>
      )}
    </div>
  </th>
)

export default function HistoryPage() {
  const [data, setData] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null
    return null
  }

  // Function to transform API data to component format
  const transformApiData = (apiData: ApiReservation[]): BookingData[] => {
    return apiData.map((reservation) => ({
      id: `#${reservation.reservationId}`,
      reservationId: reservation.reservationId, // Store the actual ID
      branch: "Kab. Malang", // Default value since not provided in API
      name: reservation.name,
      court: `Field ${reservation.details[0]?.fieldId || 'N/A'}`, // Using first detail's fieldId
      date: reservation.details[0]?.date ? new Date(reservation.details[0].date).toLocaleDateString('id-ID') : 'N/A',
      total: `Rp. ${reservation.total.toLocaleString('id-ID')}`,
      payment: reservation.paymentStatus === 'complete' ? 'Lunas' : reservation.paymentStatus === 'pending' ? 'Pending' : 'Belum Lunas',
      status: getBookingStatus(reservation.details[0]?.date || reservation.created_at)
    }))
  }

  // Function to determine booking status based on date
  const getBookingStatus = (dateString: string): string => {
    const bookingDate = new Date(dateString);
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const bookingDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());

    if (bookingDay > today) {
      return "Upcoming";
    } else if (bookingDay.getTime() === today.getTime()) {
      return "Ongoing";
    } else {
      return "Completed";
    }
  }

  // Fetch booking data from API
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const token = getCookie("token")
        if (!token) {
          setLoading(false)
          return
        }

        const decoded: any = jwtDecode(token)
        const userId = decoded.user_id

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reservations/user?user_id=${userId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: ApiResponse = await response.json()
        
        if (result.success && result.data) {
          const transformedData = transformApiData(result.data)
          setData(transformedData)
        } else {
          throw new Error(result.message || 'Failed to fetch data')
        }
      } catch (err) {
        console.error('Error fetching booking data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBookingData()
  }, [])

  // Check if user is authenticated
  const token = getCookie("token")
  if (!token) {
    return <BookingHistoryGuestPage />
  }

  // Show loading state
  if (loading) {
    return (
      <UserLayout>
        <div className="px-4 py-5 md:py-10 flex flex-col max-w-6xl mx-auto">
          <div className="text-center py-8">
            <p>Loading...</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <UserLayout>
        <div className="px-4 py-5 md:py-10 flex flex-col max-w-6xl mx-auto">
          <div className="text-center py-8 text-red-600">
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
    )
  }

  const handleSort = (key: keyof BookingData) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[key].toString().toLowerCase()
      const bValue = b[key].toString().toLowerCase()
      if (aValue < bValue) return direction === "asc" ? -1 : 1
      if (aValue > bValue) return direction === "asc" ? 1 : -1
      return 0
    })

    setSortConfig({ key, direction })
    setData(sortedData)
  }

  const handleOpenModal = (booking: BookingData) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setSelectedBooking(null)
    setShowModal(false)
  }

  const filteredData = data.filter((booking) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      booking.id.toLowerCase().includes(searchStr) ||
      booking.name.toLowerCase().includes(searchStr) ||
      booking.branch.toLowerCase().includes(searchStr) ||
      booking.court.toLowerCase().includes(searchStr) ||
      booking.date.toLowerCase().includes(searchStr) ||
      booking.total.toLowerCase().includes(searchStr) ||
      booking.payment.toLowerCase().includes(searchStr) ||
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

  // Function to highlight the search term in a text
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <UserLayout>
      <div className="px-4 py-5 md:py-10 flex flex-col max-w-6xl mx-auto">
        {/* Judul dengan segitiga */}
        <div className='mb-4 flex items-center gap-2'>
          <Image src='/icons/arrow.svg' alt='-' width={26} height={26} />
          <p className='text-2xl font-semibold text-black'>
            Riwayat Pemesanan
          </p>
        </div>

        {/* Search & Show Entries */}
        <div className="flex flex-col md:flex-row mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm">Show</label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={entriesPerPage}
              onChange={handleChangeEntries}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm">entries</span>
          </div>

            <div className="flex-1 ml-auto md:ml-4 mt-2 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border rounded px-3 py-1 pl-8 text-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
        </div>

        {/* Tabel */}
      <div className="overflow-auto border rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-[#2C473A] text-white">
            <tr>
              {/* <TableHeader
                label="Invoice ID"
                sortable
                onSort={() => handleSort("id")}
                sortDirection={sortConfig?.key === "id" ? sortConfig.direction : null}
              /> */}
              <TableHeader
                label="Cabang"
                sortable
                onSort={() => handleSort("branch")}
                sortDirection={sortConfig?.key === "branch" ? sortConfig.direction : null}
              />
              {/* <TableHeader
                label="Atas Nama"
                sortable
                onSort={() => handleSort("name")}
                sortDirection={sortConfig?.key === "name" ? sortConfig.direction : null}
              /> */}
              <TableHeader
                label="Lapangan"
                sortable
                onSort={() => handleSort("court")}
                sortDirection={sortConfig?.key === "court" ? sortConfig.direction : null}
              />
              <TableHeader
                label="Tanggal"
                sortable
                onSort={() => handleSort("date")}
                sortDirection={sortConfig?.key === "date" ? sortConfig.direction : null}
              />
              {/* <TableHeader
                label="Total Harga"
                sortable
                onSort={() => handleSort("total")}
                sortDirection={sortConfig?.key === "total" ? sortConfig.direction : null}
              /> */}
              <TableHeader
                label="Pembayaran"
                sortable
                onSort={() => handleSort("payment")}
                sortDirection={sortConfig?.key === "payment" ? sortConfig.direction : null}
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
                  <td colSpan={9} className="text-center py-8">
                    {data.length === 0 ? "Tidak ada data pemesanan" : "Data tidak ditemukan"}
                  </td>
                </tr>
              ) : (
                currentEntries.map((booking, index) => (
                  <tr
                    key={index}
                    className={cn(index % 2 === 0 ? "bg-[#E5FFA8]" : "bg-white", "border-b")}
                  >
                    {/* <td className="py-2 px-4">{highlightText(booking.id)}</td> */}
                    <td className="py-2 px-4">{highlightText(booking.branch)}</td>
                    {/* <td className="py-2 px-4">{highlightText(booking.name)}</td> */}
                    <td className="py-2 px-4">{highlightText(booking.court)}</td>
                    <td className="py-2 px-4">{highlightText(booking.date)}</td>
                    {/* <td className="py-2 px-4">{highlightText(booking.total)}</td> */}
                    <td className="py-2 px-4">{highlightText(booking.payment)}</td>
                    <td className="py-2 px-4">
                      <span
                        className={cn(
                          "px-3 py-1 text-xs rounded-full font-medium",
                          booking.status === "Upcoming" && "bg-orange-100 text-orange-600",
                          booking.status === "Completed" && "bg-green-100 text-green-600",
                          booking.status === "Ongoing" && "bg-blue-100 text-blue-600"
                        )}
                      >
                        {highlightText(booking.status)}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <Button
                        className="bg-[#C5FC40] text-black hover:bg-lime-300 rounded-full"
                        size="sm"
                        onClick={() => handleOpenModal(booking)}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            {/* Tombol Previous */}
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

            {/* Tombol Halaman */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md",
                  currentPage === i + 1
                    ? "bg-[#C5FC40] text-black"
                    : "bg-transparent text-black hover:bg-[#C5FC40] hover:text-black"
                )}
              >
                {i + 1}
              </button>
            ))}

            {/* Tombol Next */}
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

        {/* Modal */}
        {showModal && selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </UserLayout>
  )
}