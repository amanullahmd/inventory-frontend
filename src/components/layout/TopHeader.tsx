'use client'

import { useSession } from 'next-auth/react'
import { Bell, Search, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

const THEME_STORAGE_KEY = 'dpe-theme-preference'

export default function TopHeader() {
  const { data: session } = useSession()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Read from the same storage key as ThemeContext
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    
    setTheme(initialTheme)
    setMounted(true)
  }, [])

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
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4 ml-4">
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

          {/* User Info */}
          <div className="hidden sm:flex items-center gap-3 pl-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {session.user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {session.roles?.join(', ').replace(/ROLE_/g, '')}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-white">
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
