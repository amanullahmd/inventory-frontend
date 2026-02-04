'use client'

import * as React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

/**
 * Theme Toggle Component
 * 
 * Allows users to switch between light and dark modes:
 * - Visual toggle button
 * - Persists preference to localStorage
 * - Detects OS-level dark mode preference
 * - Smooth transitions
 * 
 * Validates: Requirements 7.1, 7.2, 7.4, 7.5
 */

interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'icon' | 'button'
}

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, variant = 'icon', ...props }, ref) => {
    const { mode, toggleTheme } = useTheme()

    if (variant === 'icon') {
      return (
        <button
          ref={ref}
          onClick={toggleTheme}
          className={cn(
            'inline-flex items-center justify-center w-10 h-10 rounded-lg',
            'text-gray-700 dark:text-gray-300',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            className
          )}
          aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          {...props}
        >
          {mode === 'light' ? (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      )
    }

    return (
      <button
        ref={ref}
        onClick={toggleTheme}
        className={cn(
          'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
          'border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800',
          'text-gray-700 dark:text-gray-300',
          'hover:bg-gray-50 dark:hover:bg-gray-700',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          className
        )}
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        {...props}
      >
        {mode === 'light' ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span className="text-sm font-medium">Dark</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <span className="text-sm font-medium">Light</span>
          </>
        )}
      </button>
    )
  }
)

ThemeToggle.displayName = 'ThemeToggle'

export { ThemeToggle, type ThemeToggleProps }
