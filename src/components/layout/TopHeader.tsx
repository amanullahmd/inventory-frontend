'use client'

import { useSession, signOut } from 'next-auth/react'
import { Bell, Search, Sun, Moon, LogOut, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
const THEME_STORAGE_KEY = 'dpe-theme-preference'

export default function TopHeader() {
  const { data: session } = useSession()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Read from the same storage key as ThemeContext
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')

    setTheme(initialTheme)
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(THEME_STORAGE_KEY, next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }

  if (!session || !mounted) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left Section - Spacer */}
        <div className="flex-1"></div>

        {/* Right Section - Search and Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="hidden md:flex max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Mobile Search */}
          <button className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Info Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 pl-2 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 transition-all cursor-pointer bg-transparent outline-none border-none"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="hidden sm:flex flex-col text-right cursor-pointer mr-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none">
                  {session.user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {session.roles?.join(', ').replace(/ROLE_/g, '')}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center shrink-0 cursor-pointer text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
                <span className="text-sm font-bold">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 ml-1 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Dropdown Content */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in duration-200"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 sm:hidden">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.roles?.join(', ').replace(/ROLE_/g, '')}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false)
                    signOut({ callbackUrl: '/auth/signin' })
                  }}
                  className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors cursor-pointer outline-none group"
                  role="menuitem"
                >
                  <LogOut className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
