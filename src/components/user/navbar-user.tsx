'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from "@/lib/api/auth"
import { AlertModal } from '@/components/modal/alert-modal'

export default function NavbarUser() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const router = useRouter()
  const desktopDropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)
  const [openLogoutModal, setOpenLogoutModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))?.split('=')[1]
      setIsAuthenticated(!!token)
    }

    checkToken()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
        setDesktopDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setMobileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=-99999999;';
    document.cookie = 'role=; Max-Age=0; path=/;';
    setIsAuthenticated(false);
    router.push('/');
  };

  const toggleDesktopDropdown = () => {
    setDesktopDropdownOpen(prev => !prev)
  }

  const toggleMobileDropdown = () => {
    setMobileDropdownOpen(prev => !prev)
  }

  return (
    <>
      <nav className="bg-[#2C473A] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/Logo.svg" alt="ReSports Logo" className="h-11 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <div key={item.href} className="flex flex-col items-center space-y-1">
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-semibold tracking-wide transition-colors',
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
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

          {/* Desktop Auth Button */}
          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={desktopDropdownRef}>
              <button
                onClick={toggleDesktopDropdown}
                aria-expanded={desktopDropdownOpen}
                aria-label="User menu"
                className="flex items-center p-2 rounded-full border hover:border-white transition-all"
              >
                <User className="w-6 h-6" />
              </button>

              <div
                className={cn(
                  'absolute right-0 mt-3 w-40 bg-[#2C473A] border-2 border-[#C5FC40] text-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300 z-10',
                  desktopDropdownOpen
                    ? 'opacity-100 translate-y-0 visible'
                    : 'opacity-0 -translate-y-2 invisible'
                )}
              >
                <Link
                  href="/profile"
                  onClick={() => setDesktopDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-[#3a5a4a] transition-colors"
                >
                  Profil
                </Link>
                <Link
                  href="/membership"
                  onClick={() => setDesktopDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-[#3a5a4a] transition-colors"
                >
                  Paket Langganan
                </Link>
                <button
                  onClick={() => {
                    setOpenLogoutModal(true)
                    setDesktopDropdownOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#3a5a4a] transition-colors"
                >
                  {isLoading ? 'Logout...' : 'Logout'}
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-block bg-[#C5FC40] text-black font-semibold text-sm px-5 py-2 rounded-full hover:bg-lime-300 transition"
            >
              Login
            </Link>
          )}

          {/* Mobile Buttons - Hamburger on far right */}
          <div className="md:hidden flex items-center gap-4">
            {/* Hamburger Button - Now on far right */}
            <button
              className="p-2 rounded hover:bg-[#3a5a4a] transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile User Button */}
            {isAuthenticated && (
              <div className="relative" ref={mobileDropdownRef}>
                <button
                  onClick={toggleMobileDropdown}
                  aria-expanded={mobileDropdownOpen}
                  aria-label="User menu"
                  className="flex items-center p-2 rounded-full border hover:border-white transition-all"
                >
                  <User className="w-6 h-6" />
                </button>

                {/* Mobile User Dropdown */}
                <div
                  className={cn(
                    'absolute right-0 mt-2 w-28 bg-[#2C473A] border-2 border-[#C5FC40] text-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300 z-10',
                    mobileDropdownOpen
                      ? 'opacity-100 translate-y-0 visible'
                      : 'opacity-0 -translate-y-2 invisible'
                  )}
                >
                  <Link
                    href="/profile"
                    onClick={() => setMobileDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-[#3a5a4a] transition-colors"
                  >
                    Profil
                  </Link>
                  <Link
                    href="/membership"
                    onClick={() => setMobileDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-[#3a5a4a] transition-colors"
                  >
                    Paket Langganan
                  </Link>
                  <button
                    onClick={() => {
                      setOpenLogoutModal(true);
                      setMobileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#3a5a4a] transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logout...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden md:hidden bg-[#2C473A] px-4 pt-4 pb-6 space-y-4"
              ref={mobileMenuRef}
            >
              {navItems.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block text-sm font-semibold transition-colors text-center',
                    isActive(item.href) ? 'text-white' : 'text-white/70 hover:text-white'
                  )}
                  onClick={() => setIsOpen(false)}
                  style={{ borderBottom: idx !== navItems.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none', paddingBottom: '0.5rem' }}
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex justify-center mt-4">
                  <Link
                    href="/login"
                    className="bg-[#C5FC40] text-black font-semibold text-sm px-5 py-2 rounded-full hover:bg-lime-300 transition w-full max-w-[200px] text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AlertModal
        isOpen={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        onConfirm={async () => {
          setIsLoading(true)
          try {
            await handleLogout()
          } finally {
            setIsLoading(false)
            setOpenLogoutModal(false)
          }
        }}
        loading={isLoading}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin keluar dari akun?"
        confirmText={isLoading ? 'Logout...' : 'Logout'}
      />
    </>
  )
}