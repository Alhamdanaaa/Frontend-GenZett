"use client"

import { useState } from "react"
import { Pencil, Mail, Phone, User, UserCircle } from "lucide-react"
import EditProfileModal from "@/components/modal/EditProfileModal"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const [showModal, setShowModal] = useState(false)

  const [userData, setUserData] = useState({
    username: "JDoe",
    name: "Jhon Doe",
    phone: "081234567890",
    email: "alexarawles@gmail.com",
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white shadow-xl rounded-xl p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserCircle className="text-orange-500" size={36} />
            <h2 className="text-2xl font-semibold">Profil Saya</h2>
          </div>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Pencil size={16} /> Edit Profil
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
              <User size={16} /> Username
            </label>
            <p className="font-medium text-gray-800">{userData.username}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
              <UserCircle size={16} /> Nama Lengkap
            </label>
            <p className="font-medium text-gray-800">{userData.name}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
              <Phone size={16} /> Nomor Telepon
            </label>
            <p className="font-medium text-gray-800">{userData.phone}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
              <Mail size={16} /> Email
            </label>
            <p className="font-medium text-gray-800">{userData.email}</p>
          </div>
        </div>
      </div>

      {showModal && (
        <EditProfileModal
          name={userData.name}
          phone={userData.phone}
          username={userData.username}
          email={userData.email}
          onClose={() => setShowModal(false)}
          onSave={(updated) => {
            setUserData((prev) => ({
              ...prev,
              name: updated.name,
              phone: updated.phone
            }))
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}