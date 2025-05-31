"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import UserLayout from "@/app/user/layout";
import { cn } from "@/lib/utils"
import { Search, Calendar, MapPin, CreditCard, Clock, User, ArrowRight, Filter, Download, RefreshCw } from "lucide-react"
import Image from "next/image"
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import BookingHistoryGuestPage from "../guest/page"

interface BookingDetail {
  detailId: number;
  reservationId: number;
  fieldId: number;
  timeId: number;
  date: string;
  created_at: string;
  updated_at: string;
}

interface BookingData {
  reservationId: number;
  userId: number;
  name: string;
  paymentStatus: string;
  total: number;
  created_at: string;
  updated_at: string;
  details: BookingDetail[];
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
    deleted_at: null;
  };
  data: BookingData[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return {
          bg: "bg-emerald-50 border-emerald-200",
          text: "text-emerald-700",
          dot: "bg-emerald-500",
          label: "Selesai"
        }
      case 'pending':
        return {
          bg: "bg-amber-50 border-amber-200",
          text: "text-amber-700",
          dot: "bg-amber-500",
          label: "Menunggu"
        }
      case 'cancelled':
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-700",
          dot: "bg-red-500",
          label: "Dibatalkan"
        }
      default:
        return {
          bg: "bg-gray-50 border-gray-200",
          text: "text-gray-700",
          dot: "bg-gray-500",
          label: status
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium", config.bg, config.text)}>
      <div className={cn("w-2 h-2 rounded-full", config.dot)} />
      {config.label}
    </div>
  )
}

const BookingCard = ({ 
  booking, 
  onViewDetail, 
  highlightText 
}: { 
  booking: BookingData, 
  onViewDetail: (id: number) => void,
  highlightText: (text: string) => React.ReactNode
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2C473A] to-[#3a5a47] px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Booking ID</p>
              <p className="text-white font-semibold text-lg">
                {highlightText(`#${booking.reservationId}`)}
              </p>
            </div>
          </div>
          <StatusBadge status={booking.paymentStatus} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Customer Name */}
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 rounded-lg p-2 mt-0.5">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Atas Nama</p>
              <p className="font-semibold text-gray-900 text-lg">
                {highlightText(booking.name)}
              </p>
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-50 rounded-lg p-2 mt-0.5">
                <CreditCard className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Total Bayar</p>
                <p className="font-bold text-green-600 text-lg">
                  {highlightText(formatCurrency(booking.total))}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-50 rounded-lg p-2 mt-0.5">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Dibuat</p>
                <p className="font-medium text-gray-700 text-sm">
                  {highlightText(formatDateTime(booking.created_at))}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Date */}
          {booking.details.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="bg-orange-50 rounded-lg p-2 mt-0.5">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Tanggal Main</p>
                <p className="font-semibold text-gray-900">
                  {highlightText(formatDate(booking.details[0].date))}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onViewDetail(booking.reservationId)}
          className="w-full bg-gradient-to-r from-[#C5FC40] to-[#a8e635] hover:from-[#b8f022] hover:to-[#9dd428] text-black font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span>Lihat Detail Lengkap</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

const FilterButton = ({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean, 
  onClick: () => void, 
  children: React.ReactNode 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
      active 
        ? "bg-[#2C473A] text-white shadow-sm" 
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    )}
  >
    {children}
  </button>
)

export default function HistoryPage() {
  const [data, setData] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [entriesPerPage, setEntriesPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  const [guest, setGuest] = useState(false)
  const router = useRouter()

  // Function to get cookie value
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null
    return null
  }

  // Fetch bookings data from API
  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = getCookie("token")
      if (!token) {
        setGuest(true)
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
      
      if (result.success) {
        setData(result.data)
      } else {
        throw new Error(result.message || 'Failed to fetch bookings')
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while fetching bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleViewDetail = (reservationId: number) => {
    return <BookingDetailsPage reservationId={reservationId} />
  }

  const handleRefresh = () => {
    fetchBookings()
  }

  // Filter and search logic
  const filteredData = data.filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.paymentStatus === statusFilter
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch = 
      booking.reservationId.toString().includes(searchStr) ||
      booking.name.toLowerCase().includes(searchStr) ||
      booking.paymentStatus.toLowerCase().includes(searchStr) ||
      booking.total.toString().includes(searchStr) ||
      booking.details.some(detail => 
        detail.fieldId.toString().includes(searchStr) ||
        detail.date.includes(searchStr)
      )
    
    return matchesStatus && matchesSearch;
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
  const highlightText = (text: string): React.ReactNode => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 px-1 rounded">{part}</span>
      ) : (
        part
      )
    );
  };

  // Get statistics
  const stats = {
    total: data.length,
    completed: data.filter(b => b.paymentStatus === 'complete').length,
    pending: data.filter(b => b.paymentStatus === 'pending').length,
    cancelled: data.filter(b => b.paymentStatus === 'cancelled').length,
  }

  if (guest) return <BookingHistoryGuestPage />

  if (loading) {
    return (
      <UserLayout>
        <div className="px-4 py-5 md:py-10 flex flex-col max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#2C473A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-600">Memuat data pemesanan...</p>
            </div>
          </div>
        </div>
      </UserLayout>
    )
  }

  if (error) {
    return (
      <UserLayout>
        <div className="px-4 py-5 md:py-10 flex flex-col max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠</span>
              </div>
              <p className="text-red-600 font-medium mb-2">Terjadi Kesalahan</p>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <Button onClick={handleRefresh} className="bg-[#2C473A] hover:bg-[#1f3329]">
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="px-4 py-5 md:py-10 flex flex-col max-w-7xl mx-auto">
        {/* Header */}
        <div className='mb-8'>
          <div className="flex items-center gap-3 mb-4">
            <Image src='/icons/arrow.svg' alt='-' width={28} height={28} />
            <h1 className='text-3xl font-bold text-gray-900'>
              Riwayat Pemesanan
            </h1>
          </div>
          <p className="text-gray-600">Kelola dan pantau semua riwayat pemesanan lapangan Anda</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="bg-blue-500 rounded-lg p-2">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Selesai</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <div className="bg-green-500 rounded-lg p-2">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Menunggu</p>
                <p className="text-2xl font-bold text-amber-900">{stats.pending}</p>
              </div>
              <div className="bg-amber-500 rounded-lg p-2">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Dibatalkan</p>
                <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
              </div>
              <div className="bg-red-500 rounded-lg p-2">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pencarian</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan ID, nama, atau tanggal..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-11 text-sm focus:ring-2 focus:ring-[#2C473A] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter Status</label>
              <div className="flex gap-2 flex-wrap">
                <FilterButton active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
                  Semua
                </FilterButton>
                <FilterButton active={statusFilter === "complete"} onClick={() => setStatusFilter("complete")}>
                  Selesai
                </FilterButton>
                <FilterButton active={statusFilter === "pending"} onClick={() => setStatusFilter("pending")}>
                  Menunggu
                </FilterButton>
              </div>
            </div>

            {/* Entries per page */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tampilkan</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-[#2C473A] focus:border-transparent"
                value={entriesPerPage}
                onChange={handleChangeEntries}
              >
                <option value={6}>6 per halaman</option>
                <option value={12}>12 per halaman</option>
                <option value={24}>24 per halaman</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Menampilkan {currentEntries.length} dari {filteredData.length} pemesanan
            {searchTerm && ` untuk "${searchTerm}"`}
            {statusFilter !== "all" && ` dengan status ${statusFilter}`}
          </p>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Cards Grid */}
        {currentEntries.length === 0 ? (
          <div className="flex justify-center items-center h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada data pemesanan</h3>
              <p className="text-gray-500 max-w-sm">
                {searchTerm || statusFilter !== "all" 
                  ? "Coba ubah filter atau kata kunci pencarian" 
                  : "Belum ada riwayat pemesanan. Mulai booking lapangan sekarang!"}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                  className="mt-4 bg-[#2C473A] hover:bg-[#1f3329]"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {currentEntries.map((booking) => (
              <BookingCard
                key={booking.reservationId}
                booking={booking}
                onViewDetail={handleViewDetail}
                highlightText={highlightText}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className={cn(
                currentPage === 1 && "opacity-50 cursor-not-allowed"
              )}
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    currentPage === pageNum && "bg-[#2C473A] hover:bg-[#1f3329]"
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className={cn(
                currentPage === totalPages && "opacity-50 cursor-not-allowed"
              )}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </UserLayout>
  )
}