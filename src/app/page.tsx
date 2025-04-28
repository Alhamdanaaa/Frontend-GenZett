import React from 'react'
import { Metadata } from 'next'
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import UserLayout from '@/app/user/layout'

// export const metadata: Metadata = {
//   title: 'Beranda',
//   description: 'Beranda User',
// }

export default function HomePage() {
  return (
    <UserLayout>
        <div className="bg-white text-gray-800">
            {/* Hero Section */}
            <section className="px-4 py-5 md:py-20 flex flex-col-reverse md:flex-row items-center max-w-6xl mx-auto gap-8">
                <div className="md:w-1/2 space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                    MAIN TANPA DRAMA, <br /> BOOKING TANPA RIBET!
                </h1>
                <p className="text-gray-600">
                    Atur jadwal olahraga dengan mudah dan praktis. Pesan lapangan favoritmu hanya dalam beberapa klik!
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Selengkapnya <MoveRight className="ml-2 w-4 h-4" />
                </Button>
                </div>
                <div className="md:w-1/2">
                <Image src="/images/hero.png" alt="Hero" width={500} height={400} />
                </div>
            </section>

            {/* About Us */}
            <section className="py-5 px-4">
                <div className="max-w-4xl mx-auto text-center border-2 border-dashed border-[#2C473A] rounded-xl p-8 space-y-4">
                <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-4 py-1 rounded-full">
                    ABOUT US
                </span>
                <h2 className="text-2xl font-bold">
                    Solusi Reservasi Lapangan yang Cepat & Praktis
                </h2>
                <p className="text-gray-600">
                    Kami menawarkan kemudahan reservasi lapangan olahraga secara online. Dengan sistem terintegrasi, Anda dapat
                    mencari sport center terdekat, memilih jadwal, dan melakukan pemesanan dengan cepat serta aman.
                    Nikmati fleksibilitas pembayaran dan pengalaman reservasi yang lebih praktis.
                </p>
                </div>
            </section>

            {/* Our Benefits */}
            <section className="py-5 px-4 max-w-6xl mx-auto space-y-10">
                <div className="text-center space-y-2">
                <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-3 py-1 rounded-full">
                    OUR BENEFITS
                </span>
                <h2 className="text-2xl font-bold">Mengapa memilih layanan kami?</h2>
                <p className="text-gray-500">
                    Temukan berbagai keunggulan yang membuat reservasi lebih mudah dan nyaman.
                </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                {[
                    {
                    title: "Reservasi yang Cepat & Praktis",
                    desc: "Memungkinkan Anda memesan lapangan dengan mudah tanpa perlu antre.",
                    },
                    {
                    title: "Pilihan Sport Center yang Beragam",
                    desc: "Memberikan kebebasan untuk memilih cabang olahraga sesuai keinginan dan lokasi terbaik.",
                    },
                    {
                    title: "Fleksibilitas dalam Pembayaran",
                    desc: "Mendukung berbagai metode transaksi, termasuk pembayaran DP atau penuh dengan aman.",
                    },
                    {
                    title: "Status Reservasi Secara Real-Time",
                    desc: "Memudahkan Anda dalam memantau ketersediaan dan penggunaan lapangan kapan saja.",
                    },
                ].map((item, i) => (
                    <div
                    key={i}
                    className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#D1F12F] text-black font-bold text-sm mt-1">
                        ➤
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    </div>
                ))}
                </div>
            </section>


            {/* Our Facilities */}
            <section className="py-1 px-4 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Images */}
                <div className="relative w-full md:w-1/2">
                    <div className="w-64 h-auto rounded-xl overflow-hidden shadow-lg">
                    <img src="/images/fasilitas.png" alt="Futsal Court" className="object-cover w-full h-full" />
                    </div>
                    <div className="absolute top-24 left-36 w-64 h-auto rounded-xl overflow-hidden shadow-lg hidden md:block scale-95">
                    <img src="/images/fasilitas2.png" alt="Badminton Court" className="object-cover w-full h-full" />
                    </div>
                </div>

                {/* Text */}
                <div className="w-full md:w-1/2 space-y-4">
                    <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-3 py-1 rounded-full">
                    OUR FACILITIES
                    </span>
                    <h2 className="text-2xl font-bold">
                    Fasilitas Lengkap untuk<br />Kemudahan dan Kenyamanan
                    </h2>
                    <p className="text-gray-500">
                    Nikmati berbagai fasilitas unggulan yang kami sediakan untuk memastikan kenyamanan dan kemudahan dalam setiap reservasi.
                    </p>
                </div>
                </div>
            </section>

            {/* Our Sports */}
            <section className="py-30 px-4 max-w-6xl mx-auto">
                <div className="text-center space-y-3 mb-12">
                <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-3 py-1 rounded-full">
                    OUR SPORTS
                </span>
                <h2 className="text-3xl font-bold text-gray-800">
                    Temukan berbagai pilihan olahraga yang tersedia di sport center kami
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-base">
                    Dari badminton, tenis, basket, hingga futsal, pilih cabang olahraga favoritmu dan nikmati pengalaman berolahraga dengan fasilitas terbaik.
                </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                    { 
                    name: "Badminton", 
                    count: "18 lapangan",
                    icon: "/icons/badminton.png"
                    },
                    { 
                    name: "Tenis", 
                    count: "4 lapangan",
                    icon: "/icons/tennis.png"
                    },
                    { 
                    name: "Basket", 
                    count: "7 lapangan",
                    icon: "/icons/basket.png"
                    },
                    { 
                    name: "Futsal", 
                    count: "10 lapangan",
                    icon: "/icons/futsal.png"
                    }
                ].map((sport, i) => (
                    <div
                    key={i}
                    className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-b from-white to-[#C5FC40]/30 hover:to-[#C5FC40] transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer"
                    >
                    {/* Tap Animation Effect */}
                    <span className="absolute inset-0 bg-[#C5FC40] opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity duration-200"></span>
                    
                    <div className="relative z-10">
                        <div className="flex justify-center mb-3">
                        <img 
                            src={sport.icon} 
                            alt={sport.name}
                            className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                        />
                        </div>
                        <h3 className="text-gray-800 font-bold text-lg mb-1 group-hover:text-[#2C473A] transition-colors">
                        {sport.name}
                        </h3>
                        <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                        {sport.count}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-30 px-4 max-w-6xl mx-auto">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
                {/* Left Column - Text */}
                <div className="md:w-1/2 flex flex-col justify-between">
                    <div className="space-y-4">
                    <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-3 py-1 rounded-full">
                    HOW IT WORKS
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900">Proses reservasi lapangan kini lebih mudah dan cepat.</h3>
                    <p className="text-gray-600">
                        Ikuti langkah-langkah sederhana untuk menemukan, memesan, dan menikmati fasilitas olahraga tanpa ribet.
                    </p>
                    </div>
                    <button className="bg-[#F67403] hover:bg-[#D26201] text-white font-medium py-3 px-8 rounded-lg shadow-md transition-colors w-fit mt-6">
                    Reservasi Sekarang
                    </button>
                </div>

                {/* Right Column - Steps Grid */}
                <div className="md:w-1/2 grid grid-cols-2 gap-2 h-full">
                    {[
                    {
                        number: "1",
                        title: "Pilih Lokasi & Lapangan",
                        description: "Temukan cabang dan lapangan tersedia"
                    },
                    {
                        number: "2", 
                        title: "Pilih Tanggal & Waktu",
                        description: "Pilih slot jadwal yang tersedia"
                    },
                    {
                        number: "3",
                        title: "Konfirmasi Pembayaran",
                        description: "Lihat detail dan lakukan pembayaran"
                    },
                    {
                        number: "4",
                        title: "Cek Status Pesanan",
                        description: "Pantau di menu riwayat"
                    }
                    ].map((step, index) => (
                    <div 
                        key={index}
                        className="bg-[#CBE2D4] p-5 rounded-lg flex flex-row h-full items-center gap-4 min-h-[120px]"
                    >
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#2C473A] text-white rounded-full text-lg font-bold">
                        {step.number}
                        </div>
                        <div className="flex flex-col">
                        <h4 className="text-md font-semibold text-gray-800">{step.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </section>

            {/* Join Member Section - Matching Container Width */}
            <section className="py-30 px-4 max-w-6xl mx-auto">
                <div className="max-w-6xl mx-auto">
                {/* Background Container */}
                <div className="relative rounded-xl overflow-hidden">
                    {/* Background Image - Replace with your image */}
                    <img 
                    src="/images/member.png" 
                    alt="Sports background"
                    className="w-full h-full object-cover absolute inset-0"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-[#71847B]/60 to-[#2C473A]/80"></div>
                    
                    {/* Content */}
                    <div className="relative py-16 px-8 sm:px-12 text-center">
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-white">
                        Gabung Sekarang & Dapatkan Keuntungan Eksklusif!
                        </h2>
                        <p className="text-white/90">
                        Jadilah member untuk menikmati akses prioritas, promo spesial, dan kemudahan dalam melakukan reservasi. Bergabung sekarang dan nikmati pengalaman olahraga yang lebih nyaman!
                        </p>
                        <button className="bg-white text-[#2C473A] font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-all mt-6">
                        JOIN MEMBER
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </section>
        </div>
    </UserLayout>
  );
}
