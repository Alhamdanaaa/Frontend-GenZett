import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export default function ChangePasswordModal({
  onClose,
  onChangePassword,
}: {
  onClose: () => void
  onChangePassword: (data: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }) => void
}) {
  const [current_password, setcurrent_password] = useState("")
  const [new_password, setnew_password] = useState("")
  const [new_password_confirmation, setnew_password_confirmation] = useState("")

  const modalRef = useRef<HTMLDivElement>(null)

  // Tutup modal jika klik di luar area modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center text-gray-700">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700 text-center">Ubah Password</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password Lama</label>
          <input
            type="password"
            value={current_password}
            onChange={(e) => setcurrent_password(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password Baru</label>
          <input
            type="password"
            value={new_password}
            onChange={(e) => setnew_password(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
          <input
            type="password"
            value={new_password_confirmation}
            onChange={(e) => setnew_password_confirmation(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => onChangePassword({ current_password, new_password, new_password_confirmation })}
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  )
}
