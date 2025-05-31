"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import UserLayout from "@/app/user/layout"
import Image from "next/image"

export default function BookingHistoryGuestPage() {
  return (
    <UserLayout>
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-primary">➤</div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Riwayat Pemesanan
            </h1>
          </div>
        </header>

        {/* Content Section */}
        <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Illustration */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src="/images/historyGuest.jpg"
                alt="Ilustrasi riwayat pemesanan"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="w-full lg:w-1/2 space-y-6">
            <p className="text-gray-600 text-base md:text-lg text-center lg:text-left">
              Anda belum login. Silakan login terlebih dahulu untuk melihat riwayat pemesanan Anda.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <Link href="/login" passHref legacyBehavior>
                <Button
                  className="bg-accent hover:bg-accent-hover text-primary-foreground px-8 py-4 text-base font-medium rounded-full transition-colors duration-300"
                  aria-label="Login untuk melihat riwayat"
                >
                  Login Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </UserLayout>
  )
}