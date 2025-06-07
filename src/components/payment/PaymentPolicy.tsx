// 'use client'

import { useState } from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '../ui/dialog'
import { IconChevronRight } from '@tabler/icons-react'

type Props = {
  control: Control<any>
  errors: FieldErrors<any>
}

const PaymentPolicy = ({ control, errors }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-4">
        {/* Tombol Buka Modal */}
        <DialogTrigger asChild>
          <button
            type="button"
            className="w-full p-2 bg-gray-200 rounded flex text-sm justify-between items-center hover:bg-gray-300 text-gray-700"
          >
            <span>Kebijakan Sewa Lapangan</span>
            <IconChevronRight size={18} />
          </button>
        </DialogTrigger>

        {/* Modal */}
        <DialogContent className="!max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-lg font-semibold text-center">
            Kebijakan Sewa Lapangan
          </DialogTitle>

          <ol className="list-decimal list-inside text-sm space-y-4">
            <li>
              <strong>Ketentuan Reservasi</strong>
              <ul className="list-disc list-inside ml-5 space-y-1">
                <li>Penyewa harus melakukan reservasi minimal 1 jam sebelum waktu penggunaan.</li>
                <li>Maksimal durasi sewa adalah 3 jam per reservasi.</li>
                <li>Reservasi dianggap berhasil setelah pembayaran dikonfirmasi.</li>
              </ul>
            </li>
            <li>
              <strong>Pembayaran</strong>
              <ul className="list-disc list-inside ml-5 space-y-1">
                <li>Pembayaran dapat dilakukan melalui transfer bank, e-wallet, atau kartu kredit.</li>
                <li>Penyewa harus menyelesaikan pembayaran dalam waktu 30 menit setelah melakukan reservasi.</li>
                <li>Jika pembayaran tidak dilakukan dalam batas waktu, reservasi akan dibatalkan secara otomatis.</li>
              </ul>
            </li>
            <li>
              <strong>Pembatalan & Refund</strong>
              <ul className="list-disc list-inside ml-5 space-y-1">
                <li>Pembatalan dapat dilakukan maksimal 12 jam sebelum jadwal sewa untuk mendapatkan refund 50%.</li>
                <li>Pembatalan kurang dari 12 jam sebelum jadwal sewa tidak akan mendapatkan refund.</li>
                <li>Jika penyewa tidak hadir tanpa pemberitahuan, uang sewa dianggap hangus.</li>
              </ul>
            </li>
            <li>
              <strong>Ketentuan Penggunaan Lapangan</strong>
              <ul className="list-disc list-inside ml-5 space-y-1">
                <li>Penyewa dilarang merusak fasilitas dan wajib menjaga kebersihan lapangan.</li>
                <li>Dilarang membawa makanan berat, minuman beralkohol, atau rokok ke dalam area lapangan.</li>
                <li>Waktu penggunaan harus sesuai dengan jadwal yang telah dipilih.</li>
              </ul>
            </li>
            <li>
              <strong>Sanksi & Denda</strong>
              <ul className="list-disc list-inside ml-5 space-y-1">
                <li>Kerusakan fasilitas akibat kelalaian penyewa akan dikenakan biaya ganti rugi sesuai kerusakan.</li>
                <li>Penyewa yang melanggar aturan dapat dilarang melakukan reservasi di masa mendatang.</li>
              </ul>
            </li>
            <li>
              <strong>Hak & Kewajiban Penyewa</strong>
              <ul className="list-disc list-inside ml-5 space-y-1">
                <li>Penyewa berhak menggunakan fasilitas yang disediakan selama waktu sewa.</li>
                <li>Penyewa wajib mematuhi peraturan dan instruksi dari pengelola lapangan.</li>
              </ul>
            </li>
          </ol>

          {/* Checkbox Persetujuan */}
            <div className="flex items-center space-x-2 mt-4 mb-2">
            <Controller
              control={control}
              name="policyAgreement"
              rules={{ required: 'Anda harus menyetujui kebijakan' }}
              render={({ field }) => (
              <input
                id="agreement"
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              )}
            />
            <label htmlFor="agreement" className="text-sm">
              Saya telah membaca dan menyetujui Kebijakan Sewa Lapangan
            </label>
            </div>
          {errors.policyAgreement && (
            <p className="text-sm text-red-500">{errors.policyAgreement.message as string}</p>
          )}

          {/* Tombol Tutup */}
            <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-orange-600 text-white mt-3 px-4 py-2 h-10 w-25 mx-auto font-semibold block rounded-md hover:bg-orange-700"
            >
            Tutup
            </button>
        </DialogContent>
      </div>
    </Dialog>
  )
}

export default PaymentPolicy
