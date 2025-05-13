"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/user/navbar-user";
import FAQItem from "@/components/user/FAQItem";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CircleArrowRight } from "lucide-react";
import UserLayout from "./user/layout";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [facilitiesRef, facilitiesInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [sportsRef, sportsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [worksRef, worksInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div className="overflow-hidden">
      <UserLayout>
        <main className="bg-white text-gray-800">
            {/* Hero Section */}
            <section 
            ref={heroRef}
            className="px-4 pt-1 pb-[1px] md:py-10 flex flex-col-reverse md:flex-row items-center max-w-6xl mx-auto gap-8"
            >
            <motion.div 
                className="md:w-1/2 space-y-6"
                initial="hidden"
                animate={heroInView ? "visible" : "hidden"}
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-3xl md:text-4xl font-bold transition-all duration-500 hover:text-[#2C473A] hover:translate-x-1">
                MAIN TANPA DRAMA, <br /> BOOKING TANPA RIBET!
                </h1>
                <p className="text-gray-600 transition-all duration-500 hover:text-gray-800">
                Atur jadwal olahraga dengan mudah dan praktis. Pesan lapangan favoritmu hanya dalam beberapa klik!
                </p>
                <Button
                onClick={() => {
                    document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                Selengkapnya <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </motion.div>
            <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <Image 
                src="/images/hero.png" 
                alt="Hero" 
                width={500} 
                height={400} 
                className="transition-transform duration-500 hover:scale-105"
                />
            </motion.div>
            </section>


            {/* About Us */}
            <section id="about" className="pt-1 pb-[1px] px-4">
            <motion.div 
                className="max-w-4xl mx-auto text-center border-2 border-dashed border-[#2C473A] rounded-xl p-8 space-y-4 hover:shadow-lg transition-all duration-500"
                whileHover={{ y: -5 }}
            >
                <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-4 py-1 rounded-full transition-all duration-300 hover:scale-105">
                ABOUT US
                </span>
                <h2 className="text-2xl font-bold transition-all duration-500 hover:text-[#2C473A] hover:scale-105">
                Solusi Reservasi Lapangan yang Cepat & Praktis
                </h2>
                <p className="text-gray-600 transition-all duration-300 hover:text-gray-800">
                Kami menawarkan kemudahan reservasi lapangan olahraga secara online. Dengan sistem terintegrasi, Anda dapat
                mencari sport center terdekat, memilih jadwal, dan melakukan pemesanan dengan cepat serta aman.
                Nikmati fleksibilitas pembayaran dan pengalaman reservasi yang lebih praktis.
                </p>
            </motion.div>
            </section>

            {/* Our Benefits */}
            <section ref={benefitsRef} className="pt-10 pb-[10px] px-4 max-w-6xl mx-auto space-y-10">
            <motion.div 
                className="text-center space-y-2"
                initial="hidden"
                animate={benefitsInView ? "visible" : "hidden"}
                variants={fadeInUp}
            >
                <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-3 py-1 rounded-full transition-all duration-300 hover:scale-105">
                OUR BENEFITS
                </span>
                <h2 className="text-2xl font-bold transition-all duration-300 hover:text-[#2C473A]">Mengapa memilih layanan kami?</h2>
                <p className="text-gray-500 transition-all duration-300 hover:text-gray-700">
                Temukan berbagai keunggulan yang membuat reservasi lebih mudah dan nyaman.
                </p>
            </motion.div>
            <motion.div 
                className="grid md:grid-cols-2 gap-6"
                initial="hidden"
                animate={benefitsInView ? "visible" : "hidden"}
                variants={staggerContainer}
            >
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
                <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#D1F12F] text-black font-bold text-sm mt-1 transition-transform duration-300 group-hover:scale-110 aspect-square">
                    <CircleArrowRight className="w-4 h-4" /> {/* Ukuran icon lebih kecil */}
                    </div>
                    <div>
                    <h3 className="font-semibold mb-1 transition-all duration-300 hover:text-[#2C473A]">{item.title}</h3>
                    <p className="text-sm text-gray-600 transition-all duration-300 hover:text-gray-800">{item.desc}</p>
                    </div>
                </motion.div>
                ))}
            </motion.div>
            </section>

            {/* Our Facilities */}
            <section ref={facilitiesRef} className="pt-12 pb-[10px] px-4 max-w-6xl mx-auto">
            <motion.div 
                className="flex flex-col md:flex-row items-center gap-6 md:gap-8"
                initial="hidden"
                animate={facilitiesInView ? "visible" : "hidden"}
                variants={staggerContainer}
            >
                {/* Images */}
                <motion.div 
                className="relative w-full md:w-1/2"
                variants={fadeInUp}
                >
                <motion.div 
                    className="w-64 h-auto rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl"
                    whileHover={{ zIndex: 10 }}
                >
                    <img 
                    src="/images/fasilitas.png" 
                    alt="Futsal Court" 
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110" 
                    />
                </motion.div>
                <motion.div 
                    className="absolute top-24 left-36 w-64 h-auto rounded-xl overflow-hidden shadow-lg hidden md:block scale-95 transition-all duration-500 hover:scale-105 hover:shadow-xl"
                    whileHover={{ zIndex: 10 }}
                >
                    <img 
                    src="/images/fasilitas2.png" 
                    alt="Badminton Court" 
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110" 
                    />
                </motion.div>
                </motion.div>

                {/* Text */}
                <motion.div 
                className="w-full md:w-1/2 space-y-4"
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
                >
                <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-3 py-1 rounded-full transition-all duration-300 hover:scale-105">
                    OUR FACILITIES
                </span>
                <h2 className="text-2xl font-bold transition-all duration-500 hover:text-[#2C473A] hover:translate-x-1">
                    Fasilitas Lengkap untuk<br />Kemudahan dan Kenyamanan
                </h2>
                <p className="text-gray-500 transition-all duration-300 hover:text-gray-700">
                    Nikmati berbagai fasilitas unggulan yang kami sediakan untuk memastikan kenyamanan dan kemudahan dalam setiap reservasi.
                </p>
                </motion.div>
            </motion.div>
            </section>

            {/* Our Sports */}
            <section ref={sportsRef} className="pt-30 pb-[10px] px-4 max-w-6xl mx-auto">
            <motion.div 
                className="text-center space-y-3 mb-12"
                initial="hidden"
                animate={sportsInView ? "visible" : "hidden"}
                variants={fadeInUp}
            >
                <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-3 py-1 rounded-full transition-all duration-300 hover:scale-105">
                OUR SPORTS
                </span>
                <h2 className="text-3xl font-bold text-gray-800 transition-all duration-500 hover:text-[#2C473A] hover:scale-105">
                Temukan berbagai pilihan olahraga yang tersedia di sport center kami
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-base transition-all duration-300 hover:text-gray-700">
                Dari badminton, tenis, basket, hingga futsal, pilih cabang olahraga favoritmu dan nikmati pengalaman berolahraga dengan fasilitas terbaik.
                </p>
            </motion.div>

            <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
                initial="hidden"
                animate={sportsInView ? "visible" : "hidden"}
                variants={staggerContainer}
            >
                {[
                { name: "Badminton", count: "18 lapangan", icon: "/icons/badminton.png" },
                { name: "Tenis", count: "4 lapangan", icon: "/icons/tennis.png" },
                { name: "Basket", count: "7 lapangan", icon: "/icons/basket.png" },
                { name: "Futsal", count: "10 lapangan", icon: "/icons/futsal.png" },
                ].map((sport, i) => (
                <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-b from-white to-[#C5FC40]/30 hover:to-[#C5FC40] transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Tap Animation Effect */}
                    <span className="absolute inset-0 bg-[#C5FC40] opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity duration-200"></span>

                    <div className="relative z-10">
                    <div className="flex justify-center mb-3">
                        <motion.img
                        src={sport.icon}
                        alt={sport.name}
                        className="w-12 h-12 object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        />
                    </div>
                    <h3 className="text-gray-800 font-bold text-lg mb-1 group-hover:text-[#2C473A] transition-colors">
                        {sport.name}
                    </h3>
                    <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                        {sport.count}
                    </p>
                    </div>
                </motion.div>
                ))}
            </motion.div>
            </section>

            {/* How It Works */}
            <section ref={worksRef} className="pt-10 pb-[10px] px-4 max-w-6xl mx-auto">
            <motion.div 
                className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-stretch"
                initial="hidden"
                animate={worksInView ? "visible" : "hidden"}
                variants={staggerContainer}
            >
                {/* Left Column - Text */}
                <motion.div 
                className="md:w-1/2 flex flex-col justify-between"
                variants={fadeInUp}
                >
                <div className="space-y-4">
                    <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-3 py-1 rounded-full transition-all duration-300 hover:scale-105">
                    HOW IT WORKS
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 transition-all duration-500 hover:text-[#2C473A] hover:translate-x-1">
                    Proses reservasi lapangan kini lebih mudah dan cepat.
                    </h3>
                    <p className="text-gray-600 transition-all duration-300 hover:text-gray-800">
                    Ikuti langkah-langkah sederhana untuk menemukan, memesan, dan menikmati fasilitas olahraga tanpa ribet.
                    </p>
                </div>
                <Link href="/reservation" passHref>
                    <motion.button
                    className="bg-[#F67403] hover:bg-[#D26201] text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all w-fit mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    >
                    Reservasi Sekarang
                    </motion.button>
                </Link>
                </motion.div>

                {/* Right Column - Steps Grid */}
                <motion.div 
                className="md:w-1/2 grid grid-cols-2 gap-2 h-full"
                variants={staggerContainer}
                >
                {[
                    {
                    number: "1",
                    title: "Pilih Lokasi & Lapangan",
                    description: "Temukan cabang dan lapangan tersedia",
                    },
                    {
                    number: "2",
                    title: "Pilih Tanggal & Waktu",
                    description: "Pilih slot jadwal yang tersedia",
                    },
                    {
                    number: "3",
                    title: "Konfirmasi Pembayaran",
                    description: "Lihat detail dan lakukan pembayaran",
                    },
                    {
                    number: "4",
                    title: "Cek Status Pesanan",
                    description: "Pantau di menu riwayat",
                    },
                ].map((step, index) => (
                    <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-[#CBE2D4] p-5 rounded-lg flex flex-row h-full items-center gap-4 min-h-[120px] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    whileHover={{ scale: 1.02 }}
                    >
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#2C473A] text-white rounded-full text-lg font-bold transition-transform duration-300 group-hover:scale-110">
                        {step.number}
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-md font-semibold text-gray-800 transition-all duration-300 hover:text-[#2C473A]">
                        {step.title}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1 transition-all duration-300 hover:text-gray-800">{step.description}</p>
                    </div>
                    </motion.div>
                ))}
                </motion.div>
            </motion.div>
            </section>

            {/* Join Member Section - Matching Container Width */}
            <section className="py-10 px-4 max-w-6xl mx-auto">
            <motion.div 
                className="max-w-6xl mx-auto"
                whileInView={{ y: [20, 0], opacity: [0, 1] }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                {/* Background Container */}
                <div className="relative rounded-xl overflow-hidden group">
                {/* Background Image - Replace with your image */}
                <img
                    src="/images/member.png"
                    alt="Sports background"
                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-[#71847B]/60 to-[#2C473A]/80 transition-all duration-500 group-hover:opacity-90"></div>

                {/* Content */}
                <div className="relative py-16 px-8 sm:px-12 text-center">
                    <div className="space-y-6 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-white transition-all duration-500 group-hover:scale-105">
                        Gabung Sekarang & Dapatkan Keuntungan Eksklusif!
                    </h2>
                    <p className="text-white/90 transition-all duration-300 group-hover:text-white">
                        Jadilah member untuk menikmati akses prioritas, promo spesial, dan kemudahan dalam melakukan reservasi. Bergabung sekarang dan nikmati pengalaman olahraga yang lebih nyaman!
                    </p>
                    <Link href="/membership" passHref>
                        <motion.button
                        className="bg-white text-[#2C473A] font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-all mt-6"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        >
                        Bergabung Sekarang
                        </motion.button>
                    </Link>
                    </div>
                </div>
                </div>
            </motion.div>
            </section>

            {/* FAQ */}
            <section className="py-1 px-4 max-w-6xl mx-auto">
            <motion.div 
                className="text-center space-y-4"
                whileInView={{ y: [20, 0], opacity: [0, 1] }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-3 py-1 rounded-full transition-all duration-300 hover:scale-105">
                FAQ
                </span>
                <h2 className="text-2xl font-bold text-gray-800 transition-all duration-300 hover:text-[#2C473A]">Pertanyaan yang Sering Diajukan</h2>
                <p className="text-gray-500 transition-all duration-300 hover:text-gray-700">
                Temukan jawaban untuk berbagai pertanyaan yang sering ditanyakan seputar layanan reservasi lapangan olahraga.
                </p>
            </motion.div>
            <motion.div 
                className="mt-8"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp}>
                <FAQItem
                    question="Apa saja metode pembayaran yang tersedia?"
                    answer="Untuk pelunasan atau DP, kami hanya menerima pembayaran melalui QRIS. Anda dapat melakukan pelunasan langsung di tempat setelah membayar DP."
                />
                </motion.div>
                <motion.div variants={fadeInUp}>
                <FAQItem
                    question="Bisakah saya membatalkan atau mengubah jadwal reservasi?"
                    answer="Sementara ini, pembatalan atau perubahan jadwal belum tersedia melalui aplikasi. Silakan hubungi admin untuk bantuan lebih lanjut."
                />
                </motion.div>
                <motion.div variants={fadeInUp}>
                <FAQItem
                    question="Apakah ada biaya tambahan untuk reservasi online?"
                    answer="Tidak ada biaya tambahan untuk reservasi online. Harga yang tertera sudah termasuk biaya layanan."
                />
                </motion.div>
                <motion.div variants={fadeInUp}>
                <FAQItem
                    question="Apakah saya harus menjadi member untuk melakukan reservasi?"
                    answer="Tidak, Anda tetap bisa melakukan reservasi tanpa menjadi member. Namun, member mendapatkan keuntungan eksklusif seperti promo dan akses prioritas."
                />
                </motion.div>
            </motion.div>
            </section>
        </main>
    </UserLayout>
    </div>
  );
}
