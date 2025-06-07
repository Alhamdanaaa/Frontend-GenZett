import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function EditProfileModal({
  name,
  phone,
  username,
  email,
  onClose,
  onSave,
}: {
  name: string;
  phone: string;
  username: string;
  email: string;
  onClose: () => void;
  onSave: (data: { name: string; phone: string }) => void;
}) {
  const [newName, setNewName] = useState(name);
  const [newPhone, setNewPhone] = useState(phone);

  const modalRef = useRef<HTMLDivElement>(null);

  // Menutup modal jika klik di luar area modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center text-gray-700">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700 text-center">
          Edit Profil
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="text"
            value={email}
            disabled
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nama</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
          <input
            type="text"
            inputMode="numeric"
            value={newPhone}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setNewPhone(onlyNumbers);
            }}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => onSave({ name: newName, phone: newPhone })}
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
