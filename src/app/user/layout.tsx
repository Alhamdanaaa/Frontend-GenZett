import React from 'react'
// import { Metadata } from 'next'
import NavbarUser from '@/components/user/navbar-user'
import FooterUser from '@/components/user/footer-user'

// export const metadata: Metadata = {
//   title: 'Beranda User',
//   description: 'Halaman utama bagi pengguna sport center',
// }

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavbarUser /> 
      <main className="bg-[#f8f8f8]">{children}</main>
      <FooterUser />
    </div>
  )
}