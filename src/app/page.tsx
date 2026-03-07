'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { ItemService } from '@/lib/services/itemService'
import { useCachedData } from '@/hooks/useCachedData'
import { DataFreshnessIndicator } from '@/components/pwa/DataFreshnessIndicator'
import {
  Package,
  AlertTriangle,
  PackageX,
  TrendingUp,
  BarChart3,
  Activity,
  Map,
  Layers,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import ChartCard from '@/components/dashboard/ChartCard'

interface Stats {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  mostUsedCount: number
}

// Vibrant color palette for "random" look
const VIBRANT_COLORS = [
  '#d5e6ba', // Primary Cyan
  '#a1cf8a', // Button Green
  '#0088a3', // Contrast Cyan
  '#10b981', // Green
  '#f59e0b', // Orange
  '#06b6d4', // Cyan
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#6366f1', // Indigo
]

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

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

  const {
    isLoading: loading,
    lastUpdated,
    isStale,
    isOffline,
    refetch,
  } = useCachedData<Stats>({
    cacheKey: 'dashboard-stats',
    fetchFn: fetchStats,
    staleTime: 5 * 60 * 1000,
    enabled: !!session,
  })

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

  // Demo Data
  const monthlyData = [
    { name: 'জানু', totalItems: 400, value: 2400, stockIn: 120, stockOut: 80, usage: 150 },
    { name: 'ফেব্রু', totalItems: 420, value: 2600, stockIn: 150, stockOut: 90, usage: 180 },
    { name: 'মার্চ', totalItems: 450, value: 2800, stockIn: 180, stockOut: 110, usage: 210 },
    { name: 'এপ্রিল', totalItems: 480, value: 3000, stockIn: 200, stockOut: 130, usage: 240 },
    { name: 'মে', totalItems: 510, value: 3200, stockIn: 220, stockOut: 140, usage: 260 },
    { name: 'জুন', totalItems: 550, value: 3500, stockIn: 250, stockOut: 160, usage: 290 },
    { name: 'জুলাই', totalItems: 580, value: 3800, stockIn: 240, stockOut: 170, usage: 310 },
    { name: 'আগস্ট', totalItems: 610, value: 4100, stockIn: 260, stockOut: 190, usage: 330 },
    { name: 'সেপ্টে', totalItems: 640, value: 4400, stockIn: 280, stockOut: 210, usage: 350 },
    { name: 'অক্টো', totalItems: 670, value: 4700, stockIn: 300, stockOut: 230, usage: 380 },
    { name: 'নভে', totalItems: 700, value: 5000, stockIn: 320, stockOut: 250, usage: 410 },
    { name: 'ডিসে', totalItems: 750, value: 5400, stockIn: 350, stockOut: 280, usage: 450 },
  ]

  const divisionData = [
    { name: 'ঢাকা', items: 1200, value: 85000, lowStock: 45, outOfStock: 12 },
    { name: 'চট্টগ্রাম', items: 950, value: 62000, lowStock: 30, outOfStock: 8 },
    { name: 'রাজশাহী', items: 600, value: 38000, lowStock: 15, outOfStock: 5 },
    { name: 'খুলনা', items: 550, value: 34000, lowStock: 12, outOfStock: 4 },
    { name: 'বরিশাল', items: 400, value: 25000, lowStock: 8, outOfStock: 2 },
    { name: 'সিলেট', items: 480, value: 31000, lowStock: 10, outOfStock: 3 },
    { name: 'রংপুর', items: 350, value: 21000, lowStock: 7, outOfStock: 1 },
    { name: 'ময়মনসিংহ', items: 320, value: 19000, lowStock: 5, outOfStock: 1 },
  ]

  const customTooltip = {
    contentStyle: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      padding: '10px',
      color: '#1e293b'
    },
    wrapperStyle: { zIndex: 1000 }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Dashboard</h1>
              <p className="mt-2 text-lg text-muted-foreground">Monitor and manage your inventory effectively</p>
            </div>
            {/* <DataFreshnessIndicator
              lastUpdated={lastUpdated}
              isStale={isStale}
              isOffline={isOffline}
              isLoading={loading}
              onRefresh={refetch}
              className="hidden sm:flex"
            /> */}
          </div>
        </div>

        {/* Monthly Charts */}
        <section className="mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1.5 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold text-foreground">মাসিক ইনভেন্টরি ট্রেন্ড (১২ মাস)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="মোট আইটেম" subtitle="মাসিক সামষ্টিক তথ্য" icon={Package}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={11} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis fontSize={11} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip {...customTooltip} />
                    <Bar dataKey="totalItems" radius={[4, 4, 0, 0]} name="আইটেম">
                      {monthlyData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={VIBRANT_COLORS[index % VIBRANT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="ইনভেন্টরি ভ্যালু" subtitle="মাসিক আর্থিক মূল্য" icon={BarChart3}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={11} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis fontSize={11} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip {...customTooltip} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} name="মূল্য">
                      {monthlyData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={VIBRANT_COLORS[(index + 2) % VIBRANT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="স্টক-ইন বনাম আউট" subtitle="আসা-যাওয়া তথ্য" icon={Activity}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={11} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis fontSize={11} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip {...customTooltip} />
                    <Bar dataKey="stockIn" fill="#10b981" radius={[4, 4, 0, 0]} name="ইন" />
                    <Bar dataKey="stockOut" fill="#f43f5e" radius={[4, 4, 0, 0]} name="আউট" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="ব্যবহারের হার" subtitle="মাসিক ব্যবহারের তথ্য" icon={TrendingUp}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={11} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis fontSize={11} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip {...customTooltip} />
                    <Bar dataKey="usage" radius={[4, 4, 0, 0]} name="ব্যবহার">
                      {monthlyData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={VIBRANT_COLORS[(index + 4) % VIBRANT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* Division Charts */}
        <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1.5 bg-success rounded-full" />
            <h2 className="text-2xl font-bold text-foreground">বিভাগীয় বিশ্লেষণ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="বিভাগ অনুযায়ী আইটেম" subtitle="ভৌগোলিক বন্টন" icon={Map}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={divisionData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" fontSize={11} width={80} tick={{ fill: '#1e293b' }} axisLine={false} tickLine={false} />
                    <Tooltip {...customTooltip} />
                    <Bar dataKey="items" radius={[0, 4, 4, 0]} name="আইটেম">
                      {divisionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={VIBRANT_COLORS[index % VIBRANT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="বিভাগীয় ভ্যালু" subtitle="অর্থনৈতিক পরিমাপ" icon={Layers}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={divisionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#1e293b' }} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                    <Tooltip {...customTooltip} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} name="মূল্য">
                      {divisionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={VIBRANT_COLORS[(index + 3) % VIBRANT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="কম স্টক" subtitle="রি-অর্ডার লেভেল" icon={AlertTriangle}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={divisionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#1e293b' }} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                    <Tooltip {...customTooltip} />
                    <Bar dataKey="lowStock" radius={[4, 4, 0, 0]} name="কম স্টক">
                      {divisionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill="#f59e0b" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="আউট অফ স্টক" subtitle="স্টক নেই" icon={PackageX}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={divisionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#1e293b' }} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                    <Tooltip {...customTooltip} />
                    <Bar dataKey="outOfStock" radius={[4, 4, 0, 0]} name="নেই">
                      {divisionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill="#f43f5e" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </section>
      </div>
    </div>
  )
}
