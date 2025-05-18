'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from "@/lib/api/auth";


export default function NavbarUser() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)

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
    const token = localStorage.getItem('token') || document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))?.split('=')[1]
    
    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout(); // Panggil API logout ke backend
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=-99999999;';
    setIsAuthenticated(false);
    router.push('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev)
  }

  const toggleMobileDropdown = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <nav className="bg-[#2C473A] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-wide">
          ReSports
        </Link>

        {/* Hamburger - Mobile */}
        <button
          className="md:hidden p-2 rounded hover:bg-[#3a5a4a] transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

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

        {/* Auth Button (Desktop) */}
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-label="User menu"
              className="flex items-center p-2 rounded-full border hover:border-white transition-all"
            >
              <User className="w-6 h-6" />
            </button>

            <div
              className={cn(
                'absolute right-0 mt-3 w-28 bg-[#2C473A] border-2 border-[#C5FC40] text-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300 z-10',
                dropdownOpen
                  ? 'opacity-100 translate-y-0 visible'
                  : 'opacity-0 -translate-y-2 invisible'
              )}
            >
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 hover:bg-[#3a5a4a] transition-colors"
              >
                Profil
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setDropdownOpen(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#3a5a4a] transition-colors"
              >
                Logout
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
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block text-sm font-semibold transition-colors',
                  isActive(item.href) ? 'text-white' : 'text-white/70 hover:text-white'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

  )
}