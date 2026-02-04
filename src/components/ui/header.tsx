'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

/**
 * Header Component
 * 
 * Modern header/navbar component with:
 * - Logo and branding area
 * - Navigation links
 * - User menu
 * - Theme toggle
 * - Sticky positioning
 * - Mobile responsive
 * 
 * Validates: Requirements 16.1, 16.3
 */

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  sticky?: boolean
  showThemeToggle?: boolean
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, logo, sticky = true, showThemeToggle = true, children, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
        'shadow-sm transition-all duration-200',
        sticky && 'sticky top-0 z-50',
        className
      )}
      {...props}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {logo && <div className="flex items-center">{logo}</div>}
        <div className="flex-1">{children}</div>
        {showThemeToggle && <ThemeToggle variant="icon" />}
      </div>
    </header>
  )
)

Header.displayName = 'Header'

interface HeaderNavProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeaderNav = React.forwardRef<HTMLDivElement, HeaderNavProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn('hidden lg:flex items-center gap-1', className)}
      {...props}
    />
  )
)

HeaderNav.displayName = 'HeaderNav'

interface HeaderNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

const HeaderNavItem = React.forwardRef<HTMLAnchorElement, HeaderNavItemProps>(
  ({ className, active, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      )}
      {...props}
    />
  )
)

HeaderNavItem.displayName = 'HeaderNavItem'

interface HeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeaderActions = React.forwardRef<HTMLDivElement, HeaderActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-3', className)}
      {...props}
    />
  )
)

HeaderActions.displayName = 'HeaderActions'

interface HeaderUserMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  userName?: string
  userRole?: string
}

const HeaderUserMenu = React.forwardRef<HTMLDivElement, HeaderUserMenuProps>(
  ({ className, userName, userRole, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'hidden sm:flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800',
        className
      )}
      {...props}
    >
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
      <div className="leading-tight">
        {userName && (
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {userName}
          </div>
        )}
        {userRole && (
          <div className="text-xs text-gray-600 dark:text-gray-400">{userRole}</div>
        )}
      </div>
    </div>
  )
)

HeaderUserMenu.displayName = 'HeaderUserMenu'

export {
  Header,
  HeaderNav,
  HeaderNavItem,
  HeaderActions,
  HeaderUserMenu,
  type HeaderProps,
}
