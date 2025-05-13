'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

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
    { label: 'Riwayat', href: '/riwayat' },
  ]

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; Max-Age=-99999999;'
    setIsAuthenticated(false)
    router.push('/')
  }

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev)
  }

  const toggleMobileDropdown = () => {
    setIsOpen(prev => !prev)
  }

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
          onClick={toggleMobileDropdown}
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
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center text-white border border-transparent hover:border-white px-3 py-2 rounded-full transition-all duration-300"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-label="User menu"
            >
              <User className="w-6 h-6" />
            </button>

            <div
              className={`absolute right-0 mt-2 w-20 bg-[#2C473A] border-2 border-[#C5FC40] text-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                dropdownOpen 
                  ? 'opacity-100 translate-y-0 visible' 
                  : 'opacity-0 -translate-y-2 invisible'
              }`}
            >
              <div className="py-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm hover:bg-[#3a5a4a] transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setDropdownOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#3a5a4a] transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden md:flex items-center justify-center h-10 px-5 bg-[#C5FC40] text-black font-semibold rounded-full text-sm hover:bg-lime-300 transition"
          >
            Login
          </Link>
        )}
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-[#2C473A] px-4 pb-4 border-t border-[#3a5a4a]" ref={mobileDropdownRef}>
          <div className="flex flex-col gap-6 pt-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <div key={item.href} className="flex flex-col items-start space-y-1">
                  <Link
                    href={item.href}
                    className={cn(
                      'text-sm font-semibold transition-colors tracking-wide',
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    )}
                    onClick={() => setIsOpen(false)}
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

            {/* CONDITIONAL ACCOUNT/LOGIN (Mobile)*/}
            {isAuthenticated ? (
              <div className="relative mt-2">
                <button 
                  className="flex items-center text-white border border-transparent hover:border-white px-3 py-2 rounded-full transition-all duration-300"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                >
                  <User className="w-6 h-6" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-40 bg-[#2C473A] border-2 border-[#C5FC40] text-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
                  >
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-[#3a5a4a] transition-colors"
                        onClick={() => {
                          setDropdownOpen(false)
                          setIsOpen(false)
                        }}
                      >
                        Profil
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setDropdownOpen(false)
                          setIsOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[#3a5a4a] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-[#C5FC40] text-black font-semibold text-sm rounded-full p-2 hover:bg-lime-300 transition text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}