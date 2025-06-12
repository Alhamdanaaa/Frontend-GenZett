"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface CancelFormData {
  paymentPlatform?: string;
  accountName?: string;
  accountNumber?: string;
  reason?: string;
}

interface CancelBookingModalProps {
  booking: {
    originalData: {
      paymentStatus: string;
      reservationId: number;
    };
  };
  onClose: () => void;
  onConfirm: (formData: CancelFormData) => void;
}

const CancelBookingModal = ({ booking, onClose, onConfirm }: CancelBookingModalProps) => {
  const [formData, setFormData] = useState<CancelFormData>({});
  const [loading, setLoading] = useState(false);

  const isLunas = booking.originalData.paymentStatus === "complete";
  const isDP = booking.originalData.paymentStatus === "dp";

  useEffect(() => {
    // Reset form data when modal is opened for a new booking
    setFormData(isDP ? {} : { paymentPlatform: "", accountName: "", accountNumber: "", reason: "" });
  }, [booking, isDP]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLunas) {
      // Validate all fields for lunas
      if (
        !formData.paymentPlatform ||
        !formData.accountName ||
        !formData.accountNumber ||
        !formData.reason
      ) {
        alert("Harap lengkapi semua data untuk proses refund.");
        setLoading(false);
        return;
      }
    }

    try {
      await onConfirm(formData);
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Terjadi kesalahan saat membatalkan pemesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleDPConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm({});
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Terjadi kesalahan saat membatalkan pemesanan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl border pointer-events-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">
            {isDP ? "Konfirmasi Pembatalan" : "Batalkan Pemesanan"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {isDP ? (
          <div>
            <div className="text-sm text-gray-500 bg-merah-100 p-3 rounded">
              <p>
                <strong>Catatan:</strong> Pembatalan dengan status DP tidak akan ada pengembalian uang. Pastikan Anda yakin dengan keputusan ini.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleDPConfirm}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Konfirmasi Pembatalan"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank *</label>
              <select
                name="paymentPlatform"
                value={formData.paymentPlatform ?? ""}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#C5FC40] focus:outline-none"
                required
              >
                <option value="">Pilih Bank</option>
                <option value="BCA">BCA</option>
                <option value="Mandiri">Bank Mandiri</option>
                <option value="BNI">Bank BNI</option>
                <option value="BRI">Bank BRI</option>
                <option value="CIMB Niaga">CIMB Niaga</option>
                <option value="Danamon">Bank Danamon</option>
                <option value="Permata">Bank Permata</option>
                <option value="OCBC NISP">OCBC NISP</option>
                <option value="Maybank">Maybank Indonesia</option>
                <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                <option value="BTN">Bank BTN</option>
                <option value="Panin">Bank Panin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Akun *</label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName ?? ""}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#C5FC40] focus:outline-none"
                placeholder="Nama pemilik rekening"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening *</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber ?? ""}
                onChange={handleInputChange}
                inputMode="numeric"
                pattern="\d*"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#C5FC40] focus:outline-none"
                placeholder="Nomor rekening bank"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Pembatalan *</label>
              <select
                name="reason"
                value={formData.reason ?? ""}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#C5FC40] focus:outline-none"
                required
              >
                <option value="">Pilih alasan pembatalan</option>
                <option value="Berhalangan hadir">Berhalangan hadir</option>
                <option value="Kondisi cuaca buruk">Kondisi cuaca buruk</option>
                <option value="Sakit/kondisi kesehatan">Sakit/kondisi kesehatan</option>
                <option value="Konflik jadwal">Konflik jadwal</option>
                <option value="Keadaan darurat">Keadaan darurat</option>
                <option value="Perubahan rencana">Perubahan rencana</option>
                <option value="Masalah transportasi">Masalah transportasi</option>
                <option value="Alasan keluarga">Alasan keluarga</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500 bg-red-100 p-3 rounded">
                <p>
                  <strong>Catatan:</strong> Refund uang anda akan dikembalikan sebanyak 50% dari pembayaran total dan akan diproses dalam 1-3 hari kerja, pastikan anda telah yakin dengan pilihan anda.
                </p>
              </div>
              <div className="text-xs text-gray-500 bg-yellow-100 p-3 rounded">
                <p>
                  <strong>Pastikan data anda telah benar agar refund dapat dilakukan!.</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Batalkan Pemesanan"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CancelBookingModal;