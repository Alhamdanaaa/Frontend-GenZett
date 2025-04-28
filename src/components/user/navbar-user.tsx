'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { UserButton, useUser, SignedIn,SignedOut } from '@clerk/nextjs'

export default function NavbarUser() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Reservasi', href: '/reservation' },
    { label: 'Riwayat', href: '/riwayat' },
  ]

  return (
    <nav className="w-full h-20 bg-[#2C473A] text-white shadow">
      <div className="max-w-7xl mx-auto px-4 w-full h-full flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-white font-bold text-lg flex items-center h-full">
          ReSports
        </Link>

        {/* HAMBURGER (Mobile only) */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* NAVIGATION (Desktop) */}
        <div className="hidden md:flex gap-10 items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <div key={item.href} className="flex flex-col items-center justify-center space-y-1 h-full">
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-semibold transition-colors tracking-wide',
                    isActive ? 'text-white' : 'text-white/70 hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isActive ? 'bg-[#C5FC40]' : 'bg-transparent'
                  )}
                />
              </div>
            )
          })}
        </div>

        {/* CONDITIONAL ACCOUNT/LOGIN BUTTON */}
        <SignedIn>
            {/* Kalau sudah login, tampilkan user menu */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            {/* Kalau belum login, tampilkan tombol login */}
            <Link
              href="/login"
              className="hidden md:flex items-center justify-center h-10 px-5 bg-[#C5FC40] text-black font-semibold rounded-full text-sm hover:bg-lime-300 transition"
            >
              Login
            </Link>
          </SignedOut>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-[#2C473A] px-4 pb-4">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-semibold transition-colors',
                    isActive ? 'text-white' : 'text-white/70 hover:text-white'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}

            {/* CONDITIONAL ACCOUNT/LOGIN (Mobile) */}
            <SignedIn>
              <div className="flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <Link
                href="/login"
                className="bg-[#C5FC40] text-black font-semibold px-4 py-2 rounded-full text-sm hover:bg-lime-300 transition text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  )
}