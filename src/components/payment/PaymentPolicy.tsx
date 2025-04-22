'use client'
import { useState } from 'react'

const PaymentPolicy = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Tombol Buka Modal */}
      <button
        type="button"
        className="w-full p-2 bg-gray-200 rounded flex justify-between items-center"
        onClick={() => setIsOpen(true)}
      >
        <span>Kebijakan Sewa Lapangan</span>
        <span>{'>'}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-fit shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4 text-center">Kebijakan Sewa Lapangan</h2>
            <ol className="list-decimal list-inside text-sm space-y-4">
              <li>
                Ketentuan Reservasi
                <ul className="list-disc list-inside ml-5 space-y-1">
                  <li>Penyewa harus melakukan reservasi minimal 1 jam sebelum waktu penggunaan.</li>
                  <li>Maksimal durasi sewa adalah 3 jam per reservasi.</li>
                  <li>Reservasi dianggap berhasil setelah pembayaran dikonfirmasi.</li>
                </ul>
              </li>

              <li>
                Pembayaran
                <ul className="list-disc list-inside ml-5 space-y-1">
                  <li>Pembayaran dapat dilakukan melalui transfer bank, e-wallet, atau kartu kredit.</li>
                  <li>Penyewa harus menyelesaikan pembayaran dalam waktu 30 menit setelah melakukan reservasi.</li>
                  <li>Jika pembayaran tidak dilakukan dalam batas waktu, reservasi akan dibatalkan secara otomatis.</li>
                </ul>
              </li>

              <li>
                Pembatalan & Refund
                <ul className="list-disc list-inside ml-5 space-y-1">
                  <li>Pembatalan dapat dilakukan maksimal 12 jam sebelum jadwal sewa untuk mendapatkan refund 50%.</li>
                  <li>Pembatalan kurang dari 12 jam sebelum jadwal sewa tidak akan mendapatkan refund.</li>
                  <li>Jika penyewa tidak hadir tanpa pemberitahuan, uang sewa dianggap hangus.</li>
                </ul>
              </li>

              <li>
                Ketentuan Penggunaan Lapangan
                <ul className="list-disc list-inside ml-5 space-y-1">
                  <li>Penyewa dilarang merusak fasilitas dan wajib menjaga kebersihan lapangan.</li>
                  <li>Dilarang membawa makanan berat, minuman beralkohol, atau rokok ke dalam area lapangan.</li>
                  <li>Waktu penggunaan harus sesuai dengan jadwal yang telah dipilih.</li>
                </ul>
              </li>

              <li>
                Sanksi & Denda
                <ul className="list-disc list-inside ml-5 space-y-1">
                  <li>Kerusakan fasilitas akibat kelalaian penyewa akan dikenakan biaya ganti rugi sesuai kerusakan.</li>
                  <li>Penyewa yang melanggar aturan dapat dilarang melakukan reservasi di masa mendatang.</li>
                </ul>
              </li>

              <li>
                Hak & Kewajiban Penyewa
                <ul className="list-disc list-inside ml-5 space-y-1">
                  <li>Penyewa berhak menggunakan fasilitas yang disediakan selama waktu sewa.</li>
                  <li>Penyewa wajib mematuhi peraturan dan instruksi dari pengelola lapangan.</li>
                </ul>
              </li>
            </ol>

            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-orange-600 text-white mt-6 px-4 w-32 mx-auto block rounded-md hover:bg-orange-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default PaymentPolicy
