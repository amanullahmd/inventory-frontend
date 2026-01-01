'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import PermissionGuard from '@/components/PermissionGuard'

export default function Navbar() {
  const { data: session } = useSession()
  const { isAdmin } = usePermissions()
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = window.localStorage.getItem('theme')
    const initial = stored === 'dark' ? 'dark' : 'light'
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      window.localStorage.setItem('theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }

  if (!session) return null

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold text-foreground hover:text-primary transition-colors">
            📦 Inventory
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            <Link href="/" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/items" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Items
            </Link>
            <Link href="/suppliers" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Suppliers
            </Link>
            <Link href="/warehouses" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Warehouses
            </Link>
            <Link href="/categories" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Categories
            </Link>
            <Link href="/stock-in" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Stock In
            </Link>
            <Link href="/stock-out" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Stock Out
            </Link>
            <Link href="/stock-movements" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Movements
            </Link>
            <Link href="/transfers" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Transfers
            </Link>
            <Link href="/orders/purchase" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Purchase Orders
            </Link>
            <Link href="/orders/sales" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Sales Orders
            </Link>
            {isAdmin() && (
              <Link href="/users" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Users
              </Link>
            )}
            <Link href="/settings" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Settings
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-base font-medium text-foreground shadow-sm hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          <div className="hidden sm:flex items-center gap-3 rounded-md border border-border bg-card px-4 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/50" />
            <div className="leading-tight">
              <div className="text-base font-semibold text-foreground">{session.user?.name}</div>
              <div className="text-sm text-muted-foreground">{session.roles?.join(', ').replace('ROLE_', '')}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            Sign out
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background shadow-md">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-2">
              <Link href="/" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
              <Link href="/items" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Items
              </Link>
              <Link href="/suppliers" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Suppliers
              </Link>
              <Link href="/warehouses" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Warehouses
              </Link>
              <Link href="/categories" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Categories
              </Link>
              <Link href="/stock-in" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Stock In
              </Link>
              <Link href="/stock-out" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Stock Out
              </Link>
              <Link href="/stock-movements" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Movements
              </Link>
              <Link href="/transfers" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Transfers
              </Link>
              <Link href="/orders/purchase" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Purchase Orders
              </Link>
              <Link href="/orders/sales" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Sales Orders
              </Link>
              {isAdmin() && (
                <Link href="/users" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                  Users
                </Link>
              )}
              <Link href="/settings" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
