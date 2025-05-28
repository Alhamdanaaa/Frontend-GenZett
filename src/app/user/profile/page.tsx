"use client"

import { useEffect, useState } from "react"
import { Pencil, Mail, Phone, User, UserCircle } from "lucide-react"
import EditProfileModal from "@/components/modal/EditProfileModal"
import { Button } from "@/components/ui/button"
import { redirect } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

export default function ProfilePage() {    
  const [showModal, setShowModal] = useState(false)
  const [userData, setUserData] = useState({
    id: "",
    username: "",
    name: "",
    phone: "",
    email: "",
  })

  // Fungsi bantu baca cookie
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null
    return null
  }

  const token = getCookie("token")
  if (!token) {
    redirect('/login')
  }

  useEffect(() => {
    if (!token) return
    try {
      const decoded: any = jwtDecode(token)
      const userId = decoded.user_id

      if (userId) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              const user = data.user
              setUserData({
                id: user.id,
                username: `user${user.id}`,
                name: user.name,
                phone: user.phone,
                email: user.email,
              })
            }
          })
      }
    } catch (err) {
      console.error("Token decode error:", err)
      redirect('/login')
    }
  }, [token])

  const handleSave = async (updated: { name: string; phone: string }) => {
    const result = await window.Swal?.fire({
      title: 'Simpan Perubahan?',
      text: 'Apakah kamu yakin ingin menyimpan perubahan profil?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, simpan',
      cancelButtonText: 'Batal'
    })

    if (!result?.isConfirmed) return

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: updated.name,
        phone: updated.phone,
      }),
    })

    const data = await res.json()
    if (data.success) {
      setUserData(prev => ({
        ...prev,
        name: updated.name,
        phone: updated.phone,
      }))

      window.Swal?.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil berhasil diperbarui.',
      })
    } else {
      window.Swal?.fire({
        icon: 'error',
        title: 'Gagal!',
        text: data.message || 'Terjadi kesalahan saat menyimpan data.',
      })
    }

    setShowModal(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white shadow-xl rounded-xl p-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-gray-100 border-neutral-800">
          <div className="flex items-center gap-4">
            <UserCircle className="text-orange-500" size={48} />
            <div>
              <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-700">
                {userData.name || 'Nama Lengkap'}
              </h1>
              <p className="text-sm text-gray-500 text-gray-700 dark:text-neutral-400">
                {userData.username || 'Username'}
              </p>
            </div>
          </div>
          
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 w-full sm:w-auto"
            onClick={() => setShowModal(true)}
          >
            <Pencil size={16} /> Edit Profil
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UserInfo label="Username" icon={<User size={16} />} value={userData.username} />
          <UserInfo label="Nama Lengkap" icon={<UserCircle size={16} />} value={userData.name} />
          <UserInfo label="Nomor Telepon" icon={<Phone size={16} />} value={userData.phone} />
          <UserInfo label="Email" icon={<Mail size={16} />} value={userData.email} />
        </div>
      </div>

      {showModal && (
        <EditProfileModal
          name={userData.name}
          phone={userData.phone}
          username={userData.username}
          email={userData.email}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function UserInfo({ label, icon, value }: { label: string; icon: React.ReactNode; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
        {icon} {label}
      </label>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  )
}
