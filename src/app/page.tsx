'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ItemService } from '@/lib/services/itemService'



export default function Home() {
  const { data: session } = useSession()
  const [profileExtra, setProfileExtra] = useState<{ position?: string; grade?: string }>({})
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!session) return
      setLoading(true)
      try {
        // fetch user profile extras
        try {
          const res = await fetch('/api/users/profile')
          // but our client uses app router; better use apiClient
        } catch {}
        const s = await ItemService.getStatistics()
        if (!active) return
        setStats({
          totalItems: s.totalItems,
          totalValue: s.totalValue,
          lowStockItems: s.lowStockCount,
          outOfStockItems: s.outOfStockCount,
        })
        try {
          const p = await (await import('@/lib/services/userService')).UserService.getCurrentUserProfile()
          if (active) setProfileExtra({ position: (p as any).position, grade: (p as any).grade })
        } catch {}
      } catch (error) {
        if (!active) return
        setStats({ totalItems: 0, totalValue: 0, lowStockItems: 0, outOfStockItems: 0 })
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [session])

  

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h1 className="text-lg font-semibold text-foreground">Inventory Management System</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to access your dashboard.</p>
              <Link
                href="/auth/signin"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isAdmin = (session as any)?.roles?.includes('ROLE_ADMIN')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">Overview and quick actions</p>
          </div>
          <div className="text-base text-muted-foreground bg-card rounded-lg px-4 py-3 border border-border">
            Signed in as <span className="font-semibold text-foreground text-lg">{session.user?.name || 'User'}</span>
            {profileExtra.position ? (
              <span className="ml-3 inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-foreground">Position: {profileExtra.position}</span>
            ) : null}
            {profileExtra.grade ? (
              <span className="ml-2 inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-foreground">Grade: {profileExtra.grade}</span>
            ) : null}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              <div className="rounded-xl border border-border bg-card p-6 shadow-md">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="h-12 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-md">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="h-12 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-md">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="h-12 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-md">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="h-12 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Items</div>
                <div className="mt-3 text-5xl font-bold text-foreground">{stats.totalItems}</div>
                <div className="mt-2 text-sm text-muted-foreground">Items in inventory</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Value</div>
                <div className="mt-3 text-5xl font-bold text-foreground">${stats.totalValue.toFixed(2)}</div>
                <div className="mt-2 text-sm text-muted-foreground">Inventory value</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Low Stock</div>
                <div className="mt-3 text-5xl font-bold text-yellow-600">{stats.lowStockItems}</div>
                <div className="mt-2 text-sm text-muted-foreground">Items below threshold</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Out of Stock</div>
                <div className="mt-3 text-5xl font-bold text-red-600">{stats.outOfStockItems}</div>
                <div className="mt-2 text-sm text-muted-foreground">Items unavailable</div>
              </div>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Quick Actions */}
          <div className="lg:col-span-8">
            <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
              <div className="border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4">
                <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
                <p className="mt-1 text-base text-muted-foreground">Jump to common workflows</p>
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <Link href="/items" className="group rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Items</div>
                      <div className="mt-2 text-base text-muted-foreground">Create and manage inventory items</div>
                    </div>
                    <div className="text-2xl">📦</div>
                  </div>
                </Link>
                <Link href="/stock-in" className="group rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Stock In</div>
                      <div className="mt-2 text-base text-muted-foreground">Record incoming inventory</div>
                    </div>
                    <div className="text-2xl">📥</div>
                  </div>
                </Link>
                <Link href="/stock-out" className="group rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Stock Out</div>
                      <div className="mt-2 text-base text-muted-foreground">Record outgoing inventory</div>
                    </div>
                    <div className="text-2xl">📤</div>
                  </div>
                </Link>
                <Link href="/stock-movements" className="group rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Movements</div>
                      <div className="mt-2 text-base text-muted-foreground">View movement history</div>
                    </div>
                    <div className="text-2xl">📊</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
              <div className="border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4">
                <h2 className="text-2xl font-bold text-foreground">Reports</h2>
                <p className="mt-1 text-base text-muted-foreground">Operational insights</p>
              </div>
              <div className="grid gap-4 p-6">
                <Link href="/reports/stock-out-reasons" className="group rounded-lg border border-border bg-background p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Stock-out Reasons</div>
                      <div className="mt-1 text-base text-muted-foreground">Breakdown by reason</div>
                    </div>
                    <div className="text-2xl">📈</div>
                  </div>
                </Link>
                <Link href="/stock-movements" className="group rounded-lg border border-border bg-background p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Movement History</div>
                      <div className="mt-1 text-base text-muted-foreground">Full audit trail</div>
                    </div>
                    <div className="text-2xl">📋</div>
                  </div>
                </Link>
                {isAdmin ? (
                  <Link href="/users" className="group rounded-lg border border-border bg-background p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">User Management</div>
                        <div className="mt-1 text-base text-muted-foreground">Manage users and roles</div>
                      </div>
                      <div className="text-2xl">👥</div>
                    </div>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
