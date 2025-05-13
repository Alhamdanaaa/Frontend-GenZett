"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import UserLayout from "@/app/user/layout";
import { cn } from "@/lib/utils"
import BookingDetailModal from "@/components/modal/BookingDetailModal"
import { ChevronUp, ChevronDown } from "lucide-react"

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
    payment: "Lunas",
    status: "Completed",
  },
  {
    id: "#45169",
    branch: "Sidoarjo",
    name: "Trixie Byrd",
    court: "Basket C",
    date: "15/06/2025",
    total: "Rp. 150.000",
    payment: "Waiting",
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
  <th className="py-3 px-4 font-semibold text-left">
    <div
      className={cn("flex items-center gap-1", sortable && "cursor-pointer")}
      onClick={onSort}
    >
      {label}
      {sortable && (
        <div className="flex flex-col justify-center ml-1">
          <ChevronUp
            className={cn(
              "w-[10px] h-[10px] text-white",
              sortDirection === "asc" ? "opacity-100" : "opacity-40"
            )}
          />
          <ChevronDown
            className={cn(
              "w-[10px] h-[10px] text-white -mt-[2px]",
              sortDirection === "desc" ? "opacity-100" : "opacity-40"
            )}
          />
        </div>
      )}
    </div>
  </th>
)

export default function BookingHistoryPage() {
  const [data, setData] = useState(bookingsData)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<typeof bookingsData[0] | null>(null)

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

  return (
    <UserLayout>
      <div className="p-6">
        {/* Judul dengan segitiga */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-900 clip-triangle" />
          <h1 className="text-2xl font-bold">Riwayat Pemesanan</h1>
        </div>

        {/* Tabel */}
        <div className="overflow-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-green-900 text-white">
              <tr>
                <TableHeader label="Invoice ID" />
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
                <TableHeader label="Pembayaran" />
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
              {data.map((booking, index) => (
                <tr
                  key={index}
                  className={cn(index % 2 === 0 ? "bg-lime-100" : "bg-white", "border-b")}
                >
                  <td className="py-2 px-4">{booking.id}</td>
                  <td className="py-2 px-4">{booking.branch}</td>
                  <td className="py-2 px-4">{booking.name}</td>
                  <td className="py-2 px-4">{booking.court}</td>
                  <td className="py-2 px-4">{booking.date}</td>
                  <td className="py-2 px-4">{booking.total}</td>
                  <td className="py-2 px-4">{booking.payment}</td>
                  <td className="py-2 px-4">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full font-medium",
                        booking.status === "Upcoming" && "bg-orange-100 text-orange-600",
                        booking.status === "Completed" && "bg-green-100 text-green-600",
                        booking.status === "Ongoing" && "bg-blue-100 text-blue-600"
                      )}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <Button
                      className="bg-lime-400 text-black hover:bg-lime-500"
                      size="sm"
                      onClick={() => handleOpenModal(booking)}
                    >
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            onClose={handleCloseModal}
          />
        )}

        {/* Triangle style */}
        <style>{`
          .clip-triangle {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
        `}</style>
      </div>
    </UserLayout>
  )
}
