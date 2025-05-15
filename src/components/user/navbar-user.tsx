'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

export default function NavbarUser() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Reservasi', href: '/reservation' },
    { label: 'Riwayat', href: '/history' },
  ]

  const isActive = (href: string) => {
    return href === '/'
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="bg-[#2C473A] text-white shadow">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg">
          ReSports
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 items-center">
          {navItems.map((item) => (
            <div key={item.href} className="flex flex-col items-center space-y-1">
              <Link
                href={item.href}
                className={cn(
                  'text-sm font-semibold transition-colors tracking-wide',
                  isActive(item.href) ? 'text-white' : 'text-white/70 hover:text-white'
                )}
              >
                {item.label}
              </Link>
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  isActive(item.href) ? 'bg-[#C5FC40]' : 'bg-transparent'
                )}
              />
            </div>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link
              href="/login"
              className="px-5 h-10 bg-[#C5FC40] text-black font-semibold rounded-full text-sm flex items-center justify-center hover:bg-lime-300 transition"
            >
              Login
            </Link>
          </SignedOut>
        </div>

        {/* Hamburger - Mobile */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#2C473A] px-4 pb-4">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-semibold transition-colors',
                  isActive(item.href) ? 'text-white' : 'text-white/70 hover:text-white'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

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