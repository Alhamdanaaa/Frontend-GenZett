'use client';

import { useEffect, useState } from 'react';
import {
  Pencil,
  Mail,
  Phone,
  User,
  UserCircle,
  Lock,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import EditProfileModal from '@/components/modal/EditProfileModal';
import ChangePasswordModal from '@/components/modal/ChangePasswordModal';
import Swal from 'sweetalert2';

export default function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    name: '',
    phone: '',
    email: ''
  });

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
    return null;
  }

  useEffect(() => {
    const token = getCookie('token');
    if (!token) {
      redirect('/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.user_id;

      if (userId) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              const user = data.user;
              setUserData({
                id: user.id,
                username: `user${user.id}`,
                name: user.name,
                phone: user.phone,
                email: user.email
              });
            }
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    } catch (err) {
      console.error('Token decode error:', err);
      redirect('/login');
    }
  }, []);

  const handleSave = async (updated: { name: string; phone: string }) => {
    const result = await Swal?.fire({
      title: 'Simpan Perubahan?',
      text: 'Apakah kamu yakin ingin menyimpan perubahan profil?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, simpan',
      cancelButtonText: 'Batal'
    });

    if (!result?.isConfirmed) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userData.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updated.name,
          phone: updated.phone
        })
      }
    );

    const data = await res.json();
    if (data.success) {
      setUserData((prev) => ({
        ...prev,
        name: updated.name,
        phone: updated.phone
      }));

      Swal?.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil berhasil diperbarui.',
        confirmButtonColor: '#f97316'
      });
    } else {
      Swal?.fire({
        icon: 'error',
        title: 'Gagal!',
        text: data.message || 'Terjadi kesalahan saat menyimpan data.',
        confirmButtonColor: '#f97316'
      });
    }

    setShowModal(false);
  };

  const handlePasswordChange = async (data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => {
    const result = await Swal?.fire({
      title: 'Konfirmasi',
      text: 'Yakin ingin mengganti password?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, ganti',
      cancelButtonText: 'Batal'
    });

    if (!result?.isConfirmed) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userData.id}/change-password`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );

    const resData = await res.json();

    if (res.ok && resData.success) {
      Swal?.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Password berhasil diganti.',
        confirmButtonColor: '#f97316'
      });
      setShowPasswordModal(false);
    } else {
      Swal?.fire({
        icon: 'error',
        title: 'Gagal!',
        text: resData.message || 'Gagal mengganti password.',
        confirmButtonColor: '#f97316'
      });
    }
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#F8F8F8] px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-6xl'>
        {/* Header Section */}
        <div className='animate-fade-in mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-gray-800 sm:text-4xl'>
            Profil Saya
          </h1>
          <div className='mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-orange-400 to-orange-600'></div>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Profile Card */}
          <div className='lg:col-span-1'>
            <div className='transform rounded-2xl border border-orange-100 bg-white p-8 shadow-2xl transition-all duration-300 hover:scale-105'>
              <div className='text-center'>
                {/* Avatar */}
                <div className='relative mb-6 inline-block'>
                  <div className='flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg'>
                    <UserCircle className='text-white' size={64} />
                  </div>
                  <div className='absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-green-500'>
                    <div className='h-3 w-3 animate-pulse rounded-full bg-white'></div>
                  </div>
                </div>

                {/* User Info */}
                <h2 className='mb-2 text-2xl font-bold text-gray-800'>
                  {userData.name || 'Nama Lengkap'}
                </h2>
                <p className='mb-1 text-gray-500'>{userData.email}</p>
                <p className='mb-6 text-sm text-gray-400'>{userData.phone}</p>

                {/* Action Buttons */}
                <div className='space-y-3'>
                  <Button
                    className='w-full transform rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl'
                    onClick={() => setShowModal(true)}
                  >
                    <Pencil size={16} className='mr-2' />
                    Ubah Profil
                  </Button>

                  <Button
                    className='w-full transform rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 py-3 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl'
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <Lock size={16} className='mr-2' />
                    Ganti Password
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className='lg:col-span-2'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              {/* Personal Information */}
              <InfoCard
                title='Informasi Personal'
                icon={<User className='text-orange-500' size={24} />}
                items={[
                  { label: 'Nama Lengkap', value: userData.name }
                  // { label: "Email", value: userData.email, icon: <Mail size={16} /> },
                ]}
              />

              {/* Contact Information */}
              <InfoCard
                title='Informasi Kontak'
                icon={<Phone className='text-orange-500' size={24} />}
                items={[
                  { label: 'Nomor Telepon', value: userData.phone },
                  { label: 'Email', value: userData.email }
                ]}
              />

              {/* Account Settings */}
              {/* <div className="sm:col-span-2">
                <SettingsCard />
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onChangePassword={handlePasswordChange}
        />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

function InfoCard({
  title,
  icon,
  items
}: {
  title: string;
  icon: React.ReactNode;
  items: Array<{ label: string; value: string; icon?: React.ReactNode }>;
}) {
  return (
    <div className='transform rounded-2xl border border-orange-100 bg-white p-6 shadow-xl transition-all duration-300 hover:scale-105'>
      <div className='mb-6 flex items-center gap-3'>
        {icon}
        <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
      </div>

      <div className='space-y-4'>
        {items.map((item, index) => (
          <div key={index} className='group'>
            <label className='mb-2 flex items-center gap-2 text-sm text-gray-500'>
              <span className='text-orange-500'>{item.icon}</span>
              {item.label}
            </label>
            <div className='rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-orange-50 p-4 transition-colors duration-300 group-hover:border-orange-200'>
              <p className='font-medium text-gray-800'>{item.value || '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsCard() {
  const settingsItems = [
    {
      label: 'Keamanan Akun',
      description: 'Kelola password dan keamanan',
      icon: <Lock size={20} />
    },
    {
      label: 'Notifikasi',
      description: 'Atur preferensi notifikasi',
      icon: <Settings size={20} />
    }
  ];

  return (
    <div className='transform rounded-2xl border border-orange-100 bg-white p-6 shadow-xl transition-all duration-300 hover:scale-105'>
      <div className='mb-6 flex items-center gap-3'>
        <Settings className='text-orange-500' size={24} />
        <h3 className='text-lg font-semibold text-gray-800'>Pengaturan Akun</h3>
      </div>

      <div className='space-y-3'>
        {settingsItems.map((item, index) => (
          <div key={index} className='group cursor-pointer'>
            <div className='flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-orange-50 p-4 transition-all duration-300 group-hover:border-orange-200 group-hover:shadow-md'>
              <div className='flex items-center gap-3'>
                <span className='text-orange-500'>{item.icon}</span>
                <div>
                  <p className='font-medium text-gray-800'>{item.label}</p>
                  <p className='text-sm text-gray-500'>{item.description}</p>
                </div>
              </div>
              <ChevronRight
                className='text-gray-400 transition-colors duration-300 group-hover:text-orange-500'
                size={20}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
