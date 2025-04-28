import React from 'react'
import { Metadata } from 'next'
import NavbarUser from '@/components/user/navbar-user'

// export const metadata: Metadata = {
//   title: 'Beranda User',
//   description: 'Halaman utama bagi pengguna sport center',
// }

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavbarUser /> 
      <main className="pt-4 px-6">{children}</main>
    </div>
  )
}