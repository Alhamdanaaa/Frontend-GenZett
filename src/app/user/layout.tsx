import React from 'react'
import ClientNavbarLayout from './client-navbar-layout'
import FooterUser from '@/components/user/footer-user'
// import { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Beranda User',
//   description: 'Halaman utama bagi pengguna sport center',
// }

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ClientNavbarLayout />  {/* Navbar yang client-side */}
      <main className="pt-4 px-6">{children}</main>
      <FooterUser />
    </div>
  )
}