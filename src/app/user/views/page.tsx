"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import FAQItem from "@/components/user/FAQItem";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CircleArrowRight } from "lucide-react";
import UserLayout from "@/app/user/layout";
import { useEffect, useState } from "react";
import { CirclePlus } from 'lucide-react';
import {getSport} from '@/lib/api/sports';

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

export async function getSportsByLocation(locationId: string) {
  const res = await fetch(`/api/sports?locationId=${locationId}`);
  return res.json();
}

export default function HomePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [aboutRef, aboutInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [facilitiesRef, facilitiesInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [sportsRef, sportsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [worksRef, worksInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeFAQIndex, setActiveFAQIndex] = useState<number | null>(null);
  const [sportsData, setSportsData] = useState<any[]>([]);
  const toggleFAQ = (index: number) => {
    setActiveFAQIndex(prev => (prev === index ? null : index));
  };
useEffect(() => {
  async function fetchSports() {
    try {
      const response = await getSport(); 
      
      console.log('API Response', response);

      if (response.success) {
        // Corrected from response.sport to response.sports
        setSportsData(response.sports || []); // Fallback to empty array if sports is undefined
      } else {
        console.warn("API response indicated no sports data:", response);
        setSportsData([]);
      }
    } catch (error) {
      console.error('Error fetching sports data:', error);
      setSportsData([]);
    }
  }
  fetchSports();
}, []);
  const faqData = [
    { question: "Bagaimana cara melakukan reservasi lapangan?", answer: "Kamu bisa melakukan reservasi melalui website kami dengan login terlebih dahulu, memilih cabang, tanggal, dan slot waktu yang tersedia." },
    { question: "Bagaimana cara mengetahui lapangan yang tersedia?", answer: "Kamu dapat melihat ketersediaan lapangan setelah memilih tanggal dan cabang olahraga yang diinginkan. Jika ada slot waktu yang tersedia, kamu bisa memilihnya untuk dimasukkan ke dalam keranjang." },
    { question: "Apakah saya bisa memilih lebih dari satu slot waktu?", answer: "Ya, kamu bisa memilih beberapa slot waktu dari lapangan yang sama maupun berbeda, semuanya akan masuk ke dalam keranjang." },
    { question: "Metode pembayaran apa saja yang tersedia?", answer: "Untuk pelunasan atau DP, kami hanya menerima pembayaran melalui QRIS. Anda dapat melakukan pelunasan langsung di tempat setelah membayar DP." },
    { question: "Bagaimana cara mendapatkan promo atau diskon?", answer: "Dapatkan diskon dengan memilih paket membership. Semakin banyak pertemuan, semakin besar potongan harga yang kamu dapat!" },
    { question: "Apa yang terjadi jika saya tidak melakukan pembayaran setelah memilih slot waktu?", answer: "Jika pembayaran tidak dilakukan dalam waktu yang ditentukan, slot waktu yang dipilih akan dibatalkan dan lapangan dapat digunakan oleh orang lain." },
    { question: "Apakah saya perlu membayar di muka untuk melakukan reservasi?", answer: "Kamu bisa melakukan pembayaran penuh secara online untuk reservasi, atau membayar DP terlebih dahulu secara online. Sisa pembayaran dapat dilakukan secara online atau langsung di tempat saat datang." },
    { question: "Apakah saya bisa membatalkan reservasi?", answer: "Ya, Anda dapat membatalkan reservasi maksimal H-1 sebelum jadwal dimulai. Saat ini, perubahan jadwal (reschedule) belum tersedia melalui aplikasi. Silakan hubungi admin untuk bantuan lebih lanjut."},
  ];



  return (
    <div className="overflow-hidden">
      <UserLayout>
        <main className="text-gray-800">
          {/* Hero Section */}
          <section
            ref={heroRef}
            className="px-4 md:py-10 flex flex-col-reverse md:flex-row items-center max-w-6xl mx-auto gap-8"
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
              <p className="text-gray-600 text-base transition-all duration-500 hover:text-gray-800">
                Atur jadwal olahraga dengan mudah dan praktis. Pesan lapangan favoritmu hanya dalam beberapa klik!
              </p>
              <Button
                onClick={() => {
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white text-base transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 rounded-full px-6 py-2 w-full sm:w-auto min-w-[180px] flex items-center justify-center"
              >
                Selengkapnya <MoveRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
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
          <section id="about" ref={aboutRef} className="mt-10 pt-1 pb-[1px]">
            <motion.div
              className="max-w-6xl mx-auto text-center border-2 border-dashed border-[#2C473A] rounded-xl p-8 space-y-4 hover:shadow-lg transition-all duration-500"
              initial="hidden"
              animate={aboutInView ? "visible" : "hidden"}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-5 py-1.5 rounded-full transition-all duration-300 hover:scale-105">
                ABOUT US
              </span>
              <h2 className="text-2xl font-bold transition-all duration-500 hover:text-[#2C473A] hover:scale-105">
                Solusi Reservasi Lapangan yang Cepat & Praktis
              </h2>
              <p className="text-gray-600 text-base transition-all duration-300 hover:text-gray-800">
                Kami menawarkan kemudahan reservasi lapangan olahraga secara online. Dengan sistem terintegrasi, Anda dapat
                mencari sport center terdekat, memilih jadwal, dan melakukan pemesanan dengan cepat serta aman.
                Nikmati fleksibilitas pembayaran dan pengalaman reservasi yang lebih praktis.
              </p>
            </motion.div>
          </section>

          {/* Our Benefits */}
          <section ref={benefitsRef} className="pt-10 pb-[10px] px-4 max-w-6xl mx-auto space-y-6">
            <motion.div
              className="text-left space-y-2"
              initial="hidden"
              animate={benefitsInView ? "visible" : "hidden"}
              variants={fadeInUp}
            >
              <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-5 py-1.5 rounded-full transition-all duration-300 hover:scale-105">
                OUR BENEFITS
              </span>
              <h2 className="text-2xl font-bold transition-all duration-300 hover:text-[#2C473A]">Mengapa memilih layanan kami?</h2>
              <p className="text-gray-500 text-base transition-all duration-300 hover:text-gray-700">
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
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#D1F12F] text-black transition-transform duration-300 group-hover:scale-110 flex-shrink-0 my-auto">
                    <CircleArrowRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-base transition-all duration-300 hover:text-[#2C473A]">{item.title}</h3>
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
              <motion.div
                className="relative w-full md:w-1/2"
                variants={fadeInUp}
              >
                <div className="flex md:hidden gap-4 mb-4">
                  <motion.div
                    className="w-1/2 h-auto rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl"
                    whileHover={{ zIndex: 10 }}
                  >
                    <img
                      src="/images/fasilitas.png"
                      alt="Futsal Court"
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                    />
                  </motion.div>
                  <motion.div
                    className="w-1/2 h-auto rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl"
                    whileHover={{ zIndex: 10 }}
                  >
                    <img
                      src="/images/fasilitas2.png"
                      alt="Badminton Court"
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                    />
                  </motion.div>
                  <motion.div
                    className="w-1/2 h-auto rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl"
                    whileHover={{ zIndex: 10 }}
                  >
                    <img
                      src="/images/fasilitas3.png"
                      alt="Futsal Court"
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                    />
                  </motion.div>
                </div>
                {/* Desktop */}
                <motion.div
                  className="hidden md:block w-64 h-auto rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src="/images/fasilitas.png"
                    alt="Futsal Court"
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                </motion.div>
                <motion.div
                  className="hidden md:block absolute top-0 left-72 w-64 h-full rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src="/images/fasilitas3.png"
                    alt="Futsal Court"
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                </motion.div>
                <motion.div
                  className="hidden md:block absolute top-24 left-36 w-64 h-auto rounded-xl overflow-hidden scale-95 transition-all duration-500 hover:scale-105 hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src="/images/fasilitas2.png"
                    alt="Badminton Court"
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="w-full md:w-1/2 space-y-4"
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-5 py-1.5 rounded-full transition-all duration-300 hover:scale-105">
                  OUR FACILITIES
                </span>
                <h2 className="text-2xl font-bold transition-all duration-500 hover:text-[#2C473A] hover:translate-x-1">
                  Fasilitas Lengkap untuk<br />Kemudahan dan Kenyamanan
                </h2>
                <p className="text-gray-500 text-base transition-all duration-300 hover:text-gray-700">
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
              <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-5 py-1.5 rounded-full transition-all duration-300 hover:scale-105">
                OUR SPORTS
              </span>
              <h2 className="text-2xl font-bold text-gray-800 transition-all duration-500 hover:text-[#2C473A] hover:scale-105">
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
              {sportsData.length === 0 ? (
                <p>Loading sports...</p>
              ) : (
                <>
                  {sportsData.map((sport) => (
                    <motion.div
                      key={sport.sportId}
                      variants={fadeInUp}
                      className="group relative overflow-hidden rounded-xl p-8 bg-gradient-to-b from-white to-[#C5FC40]/30 hover:to-[#C5FC40] transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer border border-transparent hover:border-[#6CC28F] h-[250px] flex flex-col justify-center"
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Icon container */}
                      <div className="flex justify-center items-center mb-3 h-24">
                        <motion.img
                          src={`/icons/${sport.sportName.toLowerCase().replace(/\s/g, '')}.png`}
                          alt={sport.sportName}
                          className="w-24 h-24 object-contain max-h-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </div>

                      <div className="mt-auto">
                        <h3 className="text-gray-800 font-bold text-lg mb-1 group-hover:text-[#2C473A] transition-colors">
                          {sport.sportName}
                        </h3>
                        <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                          {sport.totalFields} lapangan
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Card Dan Lainnya */}
                  <motion.div
                    key="others"
                    variants={fadeInUp}
                    className="group relative overflow-hidden rounded-xl p-8 bg-gradient-to-b from-white to-[#C5FC40]/30 hover:to-[#C5FC40] transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer border border-transparent hover:border-[#6CC28F] h-[250px] flex flex-col items-center justify-center space-y-3"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="text-[#2C473A]"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CirclePlus size={96} /> {/* size bisa disesuaikan */}
                    </motion.div>

                    <h3 className="text-gray-800 font-medium text-lg group-hover:text-[#2C473A] transition-colors">
                      Masih Banyak Lagi
                    </h3>
                  </motion.div>

                </>
              )}
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
                className="md:w-1/2 flex flex-col justify-between space-y-6 mb-8 md:mb-0"
                variants={fadeInUp}
              >
                <div className="space-y-4">
                  <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-5 py-1.5 rounded-full transition-all duration-300 hover:scale-105">
                    HOW IT WORKS
                  </span>
                  <h2 className="text-2xl font-bold transition-all duration-500 hover:text-[#2C473A] hover:translate-x-1">
                    Proses reservasi lapangan kini lebih mudah dan cepat.
                  </h2>
                  <p className="text-gray-600 text-base transition-all duration-300 hover:text-gray-800">
                    Ikuti langkah-langkah sederhana untuk menemukan, memesan, dan menikmati fasilitas olahraga tanpa ribet.
                  </p>
                </div>
                <Link href="/reservation" passHref className="block w-full sm:w-auto">
                  <motion.button
                    className="bg-[#F67403] hover:bg-[#D26201] text-white font-medium text-base py-2 px-6 rounded-full shadow-md transition-all w-full sm:w-auto mb-30 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reservasi Sekarang
                    <MoveRight size={20} />
                  </motion.button>
                </Link>
              </motion.div>

              {/* Right Column - Steps Grid */}
              <motion.div
                className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full"
                variants={staggerContainer}
              >
                {[
                  {
                    number: "1.",
                    title: "Pilih Lokasi & Lapangan",
                    description: "Temukan lokasi cabang, cabang olahraga dan lapangan yang tersedia.",
                  },
                  {
                    number: "2.",
                    title: "Pilih Tanggal & Waktu",
                    description: "Pilih tanggal, waktu sesuai dengan slot jadwal yang tersedia.",
                  },
                  {
                    number: "3.",
                    title: "Konfirmasi Pembayaran",
                    description: "Lihat detail pesanan dan lakukan pembayaran.",
                  },
                  {
                    number: "4.",
                    title: "Cek Status Pesanan",
                    description: "Cek status pesanan pada menu riwayat.",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-[#CBE2D4] p-5 rounded-lg flex flex-col items-start text-left h-full min-h-[150px] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm w-8 h-8 mb-3 flex items-center justify-center bg-[#2C473A] text-white font-bold rounded-md transition-transform duration-300 hover:scale-110">
                      {step.number}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-md font-semibold text-gray-800 transition-all duration-300 hover:text-[#2C473A]">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1 transition-all duration-300 hover:text-gray-800">
                        {step.description}
                      </p>
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
                <div className="absolute inset-0 bg-gradient-to-b from-[#2C473A] via-[#2C473A]/80 to-white transition-all duration-500 group-hover:opacity-90"></div>

                {/* Content */}
                <div className="relative py-16 px-8 sm:px-12 text-center">
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-white transition-all duration-500 group-hover:scale-105">
                      Langganan Sekarang & Nikmati Banyak Keuntungan!
                    </h2>
                    <p className="text-white/90 text-base transition-all duration-300 group-hover:text-white">
                      Dapatkan akses mudah ke reservasi, harga spesial, dan promo menarik dengan paket langganan terjangkau. Mulai langganan sekarang dan rasakan kenyamanan berolahraga tanpa ribet!
                    </p>
                    <Link href="/membership" passHref>
                      <motion.button
                        className="bg-[#2C473A] text-white text-base font-medium py-2 px-6 rounded-full transition-all mt-6 hover:bg-[#1A2D24] shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Langganan Sekarang
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
              className="text-left space-y-2"
              whileInView={{ y: [20, 0], opacity: [0, 1] }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-xs font-semibold tracking-widest bg-[#2C473A] text-white px-5 py-1.5 rounded-full transition-all duration-300 hover:scale-105">
                FAQ
              </span>
              <h2 className="text-2xl font-bold text-gray-800 transition-all duration-300 hover:text-[#2C473A]">Pertanyaan yang Sering Diajukan</h2>
              <p className="text-gray-500 text-base transition-all duration-300 hover:text-gray-700">
                Temukan jawaban untuk berbagai pertanyaan yang sering ditanyakan seputar layanan reservasi lapangan olahraga.
              </p>
            </motion.div>
            <motion.div
              className="mt-4"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <div className="space-y-1">
                  {faqData.map((item, index) => (
                    <FAQItem
                      key={index}
                      question={item.question}
                      answer={item.answer}
                      isOpen={activeFAQIndex === index}
                      onToggle={() => toggleFAQ(index)}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </section>
        </main>
      </UserLayout>
    </div>
  );
}
