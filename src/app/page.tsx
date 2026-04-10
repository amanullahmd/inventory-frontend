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

// DPE Administrative Divisions (দপ্তর) - 12 divisions
const divisionData = [
  { name: "DG's Dept", items: 1100, value: 78000, lowStock: 40, outOfStock: 10 },
  { name: "ADG's Dept", items: 850, value: 59000, lowStock: 28, outOfStock: 7 },
  { name: 'ADG (PEDP)', items: 920, value: 64000, lowStock: 32, outOfStock: 9 },
  { name: 'Admin Div', items: 750, value: 52000, lowStock: 25, outOfStock: 6 },
  { name: 'Planning & Dev', items: 630, value: 43000, lowStock: 18, outOfStock: 4 },
  { name: 'IMD', items: 580, value: 39000, lowStock: 16, outOfStock: 3 },
  { name: 'Policy & Op', items: 490, value: 33000, lowStock: 12, outOfStock: 2 },
  { name: 'Training Div', items: 720, value: 49000, lowStock: 22, outOfStock: 5 },
  { name: 'Finance Div', items: 840, value: 58000, lowStock: 30, outOfStock: 8 },
  { name: 'Procurement', items: 960, value: 67000, lowStock: 35, outOfStock: 11 },
  { name: 'M&E Div', items: 670, value: 46000, lowStock: 20, outOfStock: 5 },
  { name: 'Stipend Div', items: 1050, value: 73000, lowStock: 38, outOfStock: 9 },
]

const customTooltip = {
  contentStyle: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0 8px 32px rgb(0 0 0 / 0.3)',
    padding: '12px 16px',
    color: '#f1f5f9',
    fontSize: '12px',
  },
  wrapperStyle: { zIndex: 1000 }
}

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
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-4 animate-pulse">
            <Package size={32} className="text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-transparent">
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis dataKey="name" fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis dataKey="name" fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis dataKey="name" fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis dataKey="name" fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
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
            <h2 className="text-2xl font-bold text-foreground">দপ্তর ভিত্তিক বিশ্লেষণ (বিভাগীয় বিশ্লেষণ)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="বিভাগ অনুযায়ী আইটেম" subtitle="১২টি প্রশাসনিক দপ্তর" icon={Map}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={divisionData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" fontSize={11} width={80} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
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
