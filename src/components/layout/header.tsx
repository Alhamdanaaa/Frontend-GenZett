"use client"
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { ThemeSelector } from '../theme-selector';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import { logout } from "@/lib/api/auth";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function Header() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false)
  const router = useRouter()
  const toggleDesktopDropdown = () => {
    setDesktopDropdownOpen(prev => !prev)
  }
  const desktopDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('token') || document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))?.split('=')[1];
    setIsAuthenticated(!!token);
  }, []);

  // Update your handleLogout function
  const handleLogout = async () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin logout?');
    if (!confirmed) return;

    try {
      // Get token from storage
      const token = localStorage.getItem('token') ||
        document.cookie.split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Try server logout
      await logout();

    } catch (error: unknown) {
      // Handle different error types
      if (error instanceof Error) {
        console.error('Logout error:', error.message);

        // Check if it's an Axios error
        if (typeof window !== 'undefined' && (error as any).isAxiosError) {
          const axiosError = error as any;
          console.error('HTTP Status:', axiosError.response?.status);
          console.error('Response Data:', axiosError.response?.data);
        }
      } else {
        console.error('Unknown error during logout:', error);
      }
    } finally {
      // Always perform client-side cleanup
      localStorage.removeItem('token');
      document.cookie = 'token=; Max-Age=-99999999; path=/;';
      document.cookie = 'role=; Max-Age=0; path=/;';
      setIsAuthenticated(false);
      setDesktopDropdownOpen(false);
      router.push('/login');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)) {
        setDesktopDropdownOpen(false)
      }
    }

    // Add when the dropdown is open
    if (desktopDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [desktopDropdownOpen])

  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2 px-4'>
        {/* <CtaGithub /> */}
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        <UserNav />
        <ModeToggle />
        {isAuthenticated && (
          <div className="relative hidden md:block" ref={desktopDropdownRef}>
            <button
              onClick={toggleDesktopDropdown}
              aria-expanded={desktopDropdownOpen}
              aria-label="User menu"
              className="flex items-center p-1 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-all"
            >
              <User className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors" />
            </button>

            <div
              className={cn(
                'absolute right-0 mt-3 w-40 bg-white border border-gray-200 text-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300 z-10',
                desktopDropdownOpen
                  ? 'opacity-100 translate-y-0 visible'
                  : 'opacity-0 -translate-y-2 invisible'
              )}
            >
              <Link
                href="/dashboard/profile"
                onClick={() => setDesktopDropdownOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Profil
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setDesktopDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
        <ThemeSelector />

      </div>
    </header>
  );
}
