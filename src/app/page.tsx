'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback, memo } from 'react'
import Link from 'next/link'
import { ItemService } from '@/lib/services/itemService'
import { useCachedData } from '@/hooks/useCachedData'
import { DataFreshnessIndicator } from '@/components/pwa/DataFreshnessIndicator'
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  AlertTriangle,
  PackageX,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  ArrowRight,
} from 'lucide-react'

interface Stats {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  mostUsedCount: number
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  // Fetch function for statistics
  const fetchStats = useCallback(async (): Promise<Stats> => {
    const [s, mostUsed] = await Promise.all([
      ItemService.getStatistics(),
      ItemService.getMostUsedItems(),
    ])
    return {
      totalItems: Number(s.totalItems ?? 0),
      totalValue: Number(s.totalValue ?? 0),
      lowStockItems: Number((s as Record<string, unknown>).lowStockCount ?? 0),
      outOfStockItems: Number((s as Record<string, unknown>).outOfStockCount ?? 0),
      mostUsedCount: mostUsed.length,
    }
  }, [])

  // Use cached data hook for offline support
  const {
    data: stats,
    isLoading: loading,
    lastUpdated,
    isStale,
    isOffline,
    refetch,
  } = useCachedData<Stats>({
    cacheKey: 'dashboard-stats',
    fetchFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!session,
  })

  // Default stats if no data
  const displayStats = stats || {
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    mostUsedCount: 0,
  }

  // Show loading while redirecting
  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-4 animate-pulse">
            <Package size={32} className="text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const isAdmin = (session as { roles?: string[] })?.roles?.includes('ROLE_ADMIN')

  const StatCard = memo(({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    href, 
    trend,
    color = 'primary'
  }: { 
    title: string
    value: number | string
    subtitle: string
    icon: React.ElementType
    href: string
    trend?: 'up' | 'down'
    color?: 'primary' | 'success' | 'warning' | 'destructive'
  }) => {
    const colorClasses = {
      primary: 'from-primary/20 to-primary/5 text-primary',
      success: 'from-success/20 to-success/5 text-success',
      warning: 'from-warning/20 to-warning/5 text-warning',
      destructive: 'from-destructive/20 to-destructive/5 text-destructive'
    }

    return (
      <Link href={href} className="group">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-hover">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
              <Icon size={24} />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </div>
      </Link>
    )
  })

  StatCard.displayName = 'StatCard'

  const QuickAction = memo(({ 
    title, 
    description, 
    icon: Icon, 
    href 
  }: { 
    title: string
    description: string
    icon: React.ElementType
    href: string
  }) => (
    <Link href={href} className="group">
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all card-hover">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground transition-all">
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</p>
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        </div>
        <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  ))

  QuickAction.displayName = 'QuickAction'

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Store Dashboard
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Monitor your stock levels, track movements, and manage inventory efficiently
              </p>
            </div>
            <DataFreshnessIndicator
              lastUpdated={lastUpdated}
              isStale={isStale}
              isOffline={isOffline}
              isLoading={loading}
              onRefresh={refetch}
              className="hidden sm:flex"
            />
          </div>
          {/* Mobile freshness indicator */}
          <div className="sm:hidden mt-4">
            <DataFreshnessIndicator
              lastUpdated={lastUpdated}
              isStale={isStale}
              isOffline={isOffline}
              isLoading={loading}
              onRefresh={refetch}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-8">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse">
                  <div className="w-12 h-12 rounded-xl skeleton mb-4" />
                  <div className="h-4 w-24 skeleton mb-2" />
                  <div className="h-8 w-16 skeleton mb-2" />
                  <div className="h-4 w-32 skeleton" />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
                <StatCard
                  title="Total Items"
                  value={displayStats.totalItems.toLocaleString()}
                  subtitle="Items in inventory"
                  icon={Package}
                  href="/items?filter=all"
                  color="primary"
                />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
                <StatCard
                  title="Total Value"
                  value={`$${displayStats.totalValue.toLocaleString()}`}
                  subtitle="Inventory worth"
                  icon={BarChart3}
                  href="/items"
                  color="success"
                  trend="up"
                />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <StatCard
                  title="Low Stock"
                  value={displayStats.lowStockItems}
                  subtitle="Items below threshold"
                  icon={AlertTriangle}
                  href="/items?filter=low_stock"
                  color="warning"
                />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
                <StatCard
                  title="Out of Stock"
                  value={displayStats.outOfStockItems}
                  subtitle="Items unavailable"
                  icon={PackageX}
                  href="/items?filter=out_of_stock"
                  color="destructive"
                />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <StatCard
                  title="Most Used"
                  value={displayStats.mostUsedCount}
                  subtitle="Items tracked by usage"
                  icon={TrendingUp}
                  href="/reports/most-used-items"
                  color="primary"
                />
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '250ms' }}>
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
                <p className="text-sm text-muted-foreground mt-1">Common inventory operations</p>
              </div>
              <div className="p-4 grid gap-3">
                <QuickAction
                  title="Manage Items"
                  description="View, add, or edit inventory items"
                  icon={Package}
                  href="/items"
                />
                <QuickAction
                  title="Stock In"
                  description="Record incoming inventory"
                  icon={ArrowDownToLine}
                  href="/stock-in"
                />
                <QuickAction
                  title="Stock Out"
                  description="Record outgoing inventory"
                  icon={ArrowUpFromLine}
                  href="/stock-out"
                />
                <QuickAction
                  title="Movement History"
                  description="View all stock movements"
                  icon={History}
                  href="/stock-movements"
                />
              </div>
            </div>
          </div>

          {/* Reports & Admin */}
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Reports</h2>
                <p className="text-sm text-muted-foreground mt-1">Analytics & insights</p>
              </div>
              <div className="p-4 grid gap-3">
                <Link href="/reports/stock-out-reasons" className="group">
                  <div className="p-4 rounded-xl border border-border hover:bg-accent/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-chart-5/10 text-chart-5">
                        <BarChart3 size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Stock-out Reasons</p>
                        <p className="text-xs text-muted-foreground">Breakdown by reason</p>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/stock-movements" className="group">
                  <div className="p-4 rounded-xl border border-border hover:bg-accent/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-chart-2/10 text-chart-2">
                        <History size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Audit Trail</p>
                        <p className="text-xs text-muted-foreground">Full movement history</p>
                      </div>
                    </div>
                  </div>
                </Link>
                {isAdmin && (
                  <Link href="/users" className="group">
                    <div className="p-4 rounded-xl border border-border hover:bg-accent/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-chart-4/10 text-chart-4">
                          <Users size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">User Management</p>
                          <p className="text-xs text-muted-foreground">Manage users & roles</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Status Card */}
            <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-foreground">System Status</span>
              </div>
              <p className="text-sm text-muted-foreground">
                All systems operational. Last sync completed successfully.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
