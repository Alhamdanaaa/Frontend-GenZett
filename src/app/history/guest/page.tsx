"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import UserLayout from "@/app/user/layout"

export default function BookingHistoryGuestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserLayout>
        {/* Konten */}
        <div className="p-6 flex-1">
          {/* Judul */}
          <div className="flex items-center gap-2 mb-6">
            <div className="text-2xl text-[#2C473A]">➤</div>
            <h1 className="text-2xl font-bold text-[#2C473A]">Riwayat Pemesanan</h1>
          </div>

          {/* Konten Utama */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Gambar */}
            <img
              src="/images/historyGuest.jpg"
              alt="Ilustrasi Peralatan Olahraga"
              className="w-64 h-64 object-cover"
            />

            {/* Text dan Button */}
            <div className="flex flex-col justify-center w-full md:w-auto">
              <p className="text-gray-600 mb-6">
                Anda belum login. Silakan login terlebih dahulu untuk melihat riwayat pemesanan Anda.
              </p>
              <div className="flex justify-center">
                <Link href="/login">
                  <Button className="bg-[#C5FC40] text-black hover:bg-[#E5FFA8]">
                    Login Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    </div>
  )
}