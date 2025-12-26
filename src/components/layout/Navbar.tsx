'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const isAdmin = (session as any)?.roles?.includes('ROLE_ADMIN')

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
            <div className="relative group">
              <button className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center gap-1">
                Categories
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/categories" className="block px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors rounded-t-md">
                  📁 Manage Categories
                </Link>
                <div className="border-t border-border"></div>
                <Link href="/items?category=laptops" className="block px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  💻 Laptops
                </Link>
                <Link href="/items?category=peripherals" className="block px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  🖱️ Peripherals
                </Link>
                <Link href="/items?category=monitors" className="block px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  🖥️ Monitors
                </Link>
                <Link href="/items?category=audio" className="block px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  🎤 Audio
                </Link>
                <Link href="/items?category=accessories" className="block px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors rounded-b-md">
                  🎁 Accessories
                </Link>
              </div>
            </div>
            <Link href="/stock-in" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Stock In
            </Link>
            <Link href="/stock-out" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Stock Out
            </Link>
            <Link href="/stock-movements" className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              Movements
            </Link>
            {isAdmin && (
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
              <div className="rounded-md border border-border bg-background/50 p-2">
                <div className="px-2 py-2 text-sm font-semibold text-foreground">📁 Categories</div>
                <Link href="/categories" className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors rounded-md">
                  Manage Categories
                </Link>
                <Link href="/items?category=laptops" className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors rounded-md">
                  💻 Laptops
                </Link>
                <Link href="/items?category=peripherals" className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors rounded-md">
                  🖱️ Peripherals
                </Link>
                <Link href="/items?category=monitors" className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors rounded-md">
                  🖥️ Monitors
                </Link>
                <Link href="/items?category=audio" className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors rounded-md">
                  🎤 Audio
                </Link>
                <Link href="/items?category=accessories" className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors rounded-md">
                  🎁 Accessories
                </Link>
              </div>
              <Link href="/stock-in" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Stock In
              </Link>
              <Link href="/stock-out" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Stock Out
              </Link>
              <Link href="/stock-movements" className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Movements
              </Link>
              {isAdmin && (
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
