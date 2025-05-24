"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import UserLayout from "@/app/user/layout";
import { cn } from "@/lib/utils"
import BookingDetailModal from "@/components/modal/BookingDetailModal"
import { ChevronUp, ChevronDown, Search } from "lucide-react"
import Image from "next/image"
import { redirect } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

const bookingsData = [
  {
    id: "#20462",
    branch: "Kota Malang",
    name: "Matt Dickerson",
    court: "Futsal A, Basket C",
    date: "13/05/2025",
    total: "Rp. 300.000",
    payment: "DP",
    status: "Upcoming",
  },
  {
    id: "#18933",
    branch: "Kota Batu",
    name: "Wiktoria",
    court: "Badminton B",
    date: "22/05/2025",
    total: "Rp. 100.000",
    payment: "DP",
    status: "Completed",
  },
  {
    id: "#45169",
    branch: "Sidoarjo",
    name: "Trixie Byrd",
    court: "Basket C",
    date: "15/06/2025",
    total: "Rp. 150.000",
    payment: "DP",
    status: "Ongoing",
  },
  {
    id: "#13587",
    branch: "Kab. Malang",
    name: "Anton",
    court: "Basket A",
    date: "15/06/2025",
    total: "Rp. 150.000",
    payment: "Waiting",
    status: "Ongoing",
  },
  {
    id: "#13587",
    branch: "Kab. Malang",
    name: "Anton",
    court: "Basket A",
    date: "15/06/2025",
    total: "Rp. 150.000",
    payment: "Waiting",
    status: "Ongoing",
  },
  {
    id: "#13587",
    branch: "Kab. Malang",
    name: "Anton",
    court: "Basket A",
    date: "15/06/2025",
    total: "Rp. 150.000",
    payment: "Lunas",
    status: "Ongoing",
  },
]

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
  const [data, setData] = useState(bookingsData)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<typeof bookingsData[0] | null>(null)
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  function getCookie(name: string): string | null {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()!.split(";").shift() || null
      return null
    }
  
    const token = getCookie("token")
    if (!token) {
      redirect('/login')
    }

  const handleSort = (key: keyof typeof bookingsData[0]) => {
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

  const handleOpenModal = (booking: typeof bookingsData[0]) => {
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
      booking.id.toLowerCase().includes(searchTerm) ||
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
              <TableHeader
                label="Invoice ID"
                sortable
                onSort={() => handleSort("id")}
                sortDirection={sortConfig?.key === "id" ? sortConfig.direction : null}
              />
              <TableHeader
                label="Cabang"
                sortable
                onSort={() => handleSort("branch")}
                sortDirection={sortConfig?.key === "branch" ? sortConfig.direction : null}
              />
              <TableHeader
                label="Atas Nama"
                sortable
                onSort={() => handleSort("name")}
                sortDirection={sortConfig?.key === "name" ? sortConfig.direction : null}
              />
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
              <TableHeader
                label="Total Harga"
                sortable
                onSort={() => handleSort("total")}
                sortDirection={sortConfig?.key === "total" ? sortConfig.direction : null}
              />
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
                  <td colSpan={9} className="text-center py-2">Data tidak ditemukan</td>
                </tr>
              ) : (
                currentEntries.map((booking, index) => (
                  <tr
                    key={index}
                    className={cn(index % 2 === 0 ? "bg-[#E5FFA8]" : "bg-white", "border-b")}
                  >
                    <td className="py-2 px-4">{highlightText(booking.id)}</td>
                    <td className="py-2 px-4">{highlightText(booking.branch)}</td>
                    <td className="py-2 px-4">{highlightText(booking.name)}</td>
                    <td className="py-2 px-4">{highlightText(booking.court)}</td>
                    <td className="py-2 px-4">{highlightText(booking.date)}</td>
                    <td className="py-2 px-4">{highlightText(booking.total)}</td>
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
        <div className="flex justify-center items-center gap-4 mt-4">
          {/* Tombol Previous */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1} // Nonaktifkan jika sudah di halaman pertama
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
                "px-4 py-2 text-sm font-medium rounded-md", // Style tombol
                currentPage === i + 1
                  ? "bg-[#C5FC40] text-black" // Tombol aktif dengan background hijau dan teks hitam
                  : "bg-transparent text-black hover:bg-[#C5FC40] hover:text-black"
              )}
            >
              {i + 1}
            </button>
          ))}

          {/* Tombol Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages} // Nonaktifkan jika sudah di halaman terakhir
            className={cn(
              "text-sm font-semibold text-black",
              currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "hover:text-[#2C473A]"
            )}
          >
            Next
          </button>
        </div>

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