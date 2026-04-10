'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Car,
  ArrowLeft,
  Fuel,
  Wrench,
  Droplets,
  PenTool,
  TrendingUp,
  Calendar,
  PieChart as PieChartIcon,
  LayoutDashboard,
  List,
} from 'lucide-react'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  Area,
  AreaChart,
} from 'recharts'
import { formatDateDMY, formatCurrency } from '@/lib/utils/date'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ChartCard from '@/components/dashboard/ChartCard'
import { VehicleService } from '@/lib/services/vehicleService'
import type { VehicleRequisition } from '@/lib/types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CATEGORY_COLORS: Record<string, string> = {
  Diesel: '#0088a3',
  Service: '#f59e0b',
  'Engine Oil': '#a1cf8a',
  Other: '#8b5cf6',
}

const VIBRANT_COLORS = [
  '#0088a3', '#10b981', '#f59e0b', '#06b6d4',
  '#8b5cf6', '#ec4899', '#f43f5e', '#6366f1',
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
  wrapperStyle: { zIndex: 1000 },
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Diesel: <Fuel size={14} className="text-blue-500" />,
  Service: <Wrench size={14} className="text-orange-500" />,
  'Engine Oil': <Droplets size={14} className="text-amber-500" />,
  Oil: <Droplets size={14} className="text-amber-500" />,
}

const DEFAULT_ICON = <PenTool size={14} className="text-purple-500" />

const STATUS_COLORS: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function VehicleModelPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const modelParam = decodeURIComponent(params?.model as string || '')

  const [selectedYear, setSelectedYear] = useState(() => VehicleService.getAvailableYears()[0] || 2024)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value))
    setSelectedMonth(null)
  }, [])

  const handleMonthSelect = useCallback((month: number | null) => {
    setSelectedMonth(month)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (status === 'loading') {
    return <div className="p-8"><LoadingSpinner size="medium" text="Loading..." /></div>
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-muted-foreground">Please sign in to view this page.</p>
      </div>
    )
  }

  const vehicleRequisitions = useMemo(() => VehicleService.getRequisitionsByModel(modelParam), [modelParam])
  const vehicleInfo = vehicleRequisitions[0]

  if (!vehicleInfo) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No records found for "{modelParam}"</p>
        <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">← Go back</button>
      </div>
    )
  }

  // Memoized computations
  const monthlyCosts = useMemo(() => VehicleService.getMonthlyCosts(modelParam, selectedYear), [modelParam, selectedYear])

  const filteredRecords = useMemo(() => selectedMonth !== null
    ? vehicleRequisitions.filter(r => {
        const d = new Date(r.date)
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
      })
    : vehicleRequisitions.filter(r => new Date(r.date).getFullYear() === selectedYear), [vehicleRequisitions, selectedMonth, selectedYear])

  const yearlyRecords = useMemo(() => vehicleRequisitions.filter(r => new Date(r.date).getFullYear() === selectedYear), [vehicleRequisitions, selectedYear])
  
  const totalYearlyCost = useMemo(() => yearlyRecords.reduce((sum, r) => sum + r.amount, 0), [yearlyRecords])

  const categoryCosts = useMemo(() => {
    let dieselCost = 0, serviceCost = 0, engineOilCost = 0, otherCost = 0
    yearlyRecords.forEach(r => {
      switch (r.type) {
        case 'Diesel': dieselCost += r.amount; break
        case 'Service': serviceCost += r.amount; break
        case 'Engine Oil':
        case 'Oil': engineOilCost += r.amount; break
        case 'Other': otherCost += r.amount; break
      }
    })
    return { dieselCost, serviceCost, engineOilCost, otherCost }
  }, [yearlyRecords])

  const pieData = useMemo(() => [
    { name: 'Diesel', value: categoryCosts.dieselCost },
    { name: 'Service', value: categoryCosts.serviceCost },
    { name: 'Engine Oil', value: categoryCosts.engineOilCost },
    { name: 'Other', value: categoryCosts.otherCost },
  ].filter(d => d.value > 0), [categoryCosts])

  const trendData = useMemo(() => monthlyCosts.map(m => ({
    month: m.month,
    Diesel: m.dieselCost,
    Service: m.serviceCost,
    'Engine Oil': m.engineOilCost,
    Other: m.otherCost,
    Total: m.totalCost,
  })), [monthlyCosts])

  const maxMonthlyAmount = useMemo(() => Math.max(...monthlyCosts.map(m => m.totalCost), 1), [monthlyCosts])

  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-4 lg:p-6 max-w-350 mx-auto">
        {/* Header */}
        <div className="mb-6 animate-slide-down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/vehicle-management/dashboard')}
                className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors shrink-0"
              >
                <ArrowLeft size={18} className="text-muted-foreground" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Car size={22} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">{vehicleInfo.carModel}</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {vehicleInfo.carNo} · {vehicleInfo.vehicleType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
                <Calendar size={14} className="text-muted-foreground" />
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="bg-transparent text-sm text-foreground font-medium focus:outline-none cursor-pointer"
                >
                  {VehicleService.getAvailableYears().map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 border-b border-border">
            <Link
              href="/vehicle-management/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-border -mb-px transition-colors"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link
              href="/vehicle-management/list"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-border -mb-px transition-colors"
            >
              <List size={16} />
              Vehicle List
            </Link>
            <span className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400 -mb-px">
              <Car size={16} />
              {vehicleInfo.carModel}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Records</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{yearlyRecords.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{selectedYear}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Cost</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">৳{formatCurrency(totalYearlyCost)}</p>
            <p className="text-xs text-muted-foreground mt-1">{selectedYear}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Monthly</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">৳{formatCurrency(Math.round(totalYearlyCost / 12))}</p>
            <p className="text-xs text-muted-foreground mt-1">Per month</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Months</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{monthlyCosts.filter(m => m.totalCost > 0).length}</p>
            <p className="text-xs text-muted-foreground mt-1">With records</p>
          </div>
        </div>

        {/* Category Breakdown Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Fuel size={16} className="text-blue-500" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diesel</p>
            </div>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">৳{formatCurrency(categoryCosts.dieselCost)}</p>
            <p className="text-xs text-muted-foreground mt-1">{yearlyRecords.filter(r => r.type === 'Diesel').length} records</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Wrench size={16} className="text-orange-500" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Service</p>
            </div>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">৳{formatCurrency(categoryCosts.serviceCost)}</p>
            <p className="text-xs text-muted-foreground mt-1">{yearlyRecords.filter(r => r.type === 'Service').length} records</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Droplets size={16} className="text-amber-500" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Engine Oil</p>
            </div>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">৳{formatCurrency(categoryCosts.engineOilCost)}</p>
            <p className="text-xs text-muted-foreground mt-1">{yearlyRecords.filter(r => r.type === 'Engine Oil' || r.type === 'Oil').length} records</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <PenTool size={16} className="text-purple-500" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Other</p>
            </div>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">৳{formatCurrency(categoryCosts.otherCost)}</p>
            <p className="text-xs text-muted-foreground mt-1">{yearlyRecords.filter(r => r.type === 'Other').length} records</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {/* Cost Trend Line Chart */}
          <ChartCard
            title="Monthly Cost Trend"
            subtitle="Category-wise breakdown over months"
            icon={TrendingUp}
          >
            <div className="h-75 w-full">
              {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="month" fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `৳${(v / 1000).toFixed(0)}k`} />
                  <Tooltip {...customTooltip} formatter={(value: unknown) => typeof value === 'number' ? `৳${value.toLocaleString()}` : String(value)} />
                  <Legend />
                  <Area type="monotone" dataKey="Diesel" stackId="1" stroke={CATEGORY_COLORS.Diesel} fill={CATEGORY_COLORS.Diesel} fillOpacity={0.3} />
                  <Area type="monotone" dataKey="Service" stackId="1" stroke={CATEGORY_COLORS.Service} fill={CATEGORY_COLORS.Service} fillOpacity={0.3} />
                  <Area type="monotone" dataKey="Engine Oil" stackId="1" stroke={CATEGORY_COLORS['Engine Oil']} fill={CATEGORY_COLORS['Engine Oil']} fillOpacity={0.3} />
                  <Area type="monotone" dataKey="Other" stackId="1" stroke={CATEGORY_COLORS.Other} fill={CATEGORY_COLORS.Other} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner size="small" />
                </div>
              )}
            </div>
          </ChartCard>

          {/* Category Distribution Pie */}
          <ChartCard
            title="Cost Distribution"
            subtitle="Category-wise spending share"
            icon={PieChartIcon}
          >
            <div className="h-75 w-full">
              {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }: { name?: string; value?: number }) => `${name || ''}: ৳${(value || 0).toLocaleString()}`}
                    outerRadius={100}
                    innerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || VIBRANT_COLORS[index % VIBRANT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...customTooltip} formatter={(value: unknown) => typeof value === 'number' ? `৳${value.toLocaleString()}` : String(value)} />
                </PieChart>
              </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner size="small" />
                </div>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Monthly Cost Bar Chart (existing CSS-style, now with recharts) */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 mb-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar size={18} className="text-emerald-700 dark:text-emerald-400" />
                Monthly Cost Breakdown — {selectedYear}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Click a month to filter records below</p>
            </div>
            {selectedMonth !== null && (
              <button
                onClick={() => setSelectedMonth(null)}
                className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="flex items-end gap-2 h-48 overflow-x-auto pb-2">
            {monthlyCosts.map((m, idx) => {
              const height = m.totalCost > 0 ? Math.max((m.totalCost / maxMonthlyAmount) * 100, 8) : 0
              const isSelected = selectedMonth === idx
              return (
                <div
                  key={m.month}
                  className="flex-1 min-w-10 flex flex-col items-center gap-1 cursor-pointer group"
                  onClick={() => setSelectedMonth(isSelected ? null : idx)}
                >
                  <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                    {m.totalCost > 0 ? (
                      <div
                        style={{ height: `${height}%` }}
                        className={`w-full rounded-t-lg transition-all ${isSelected
                          ? 'bg-primary'
                          : 'bg-primary/60 group-hover:bg-primary/80'
                        }`}
                        title={`৳${m.totalCost.toLocaleString()}`}
                      />
                    ) : (
                      <div className="w-full h-1 bg-border/40 rounded" />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {m.month}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {m.totalCost > 0 ? `৳${(m.totalCost / 1000).toFixed(1)}k` : '—'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Records Table */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar size={16} />
                {selectedMonth !== null ? `${MONTHS[selectedMonth]} ${selectedYear} Records` : `All ${selectedYear} Records`}
              </h2>
              <p className="text-sm text-muted-foreground">{filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground text-sm">
                      No records found for this period
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(req => (
                    <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 text-sm text-muted-foreground">{formatDateDMY(req.date)}</td>
                      <td className="px-5 py-3 text-sm">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          {TYPE_ICONS[req.type] || DEFAULT_ICON}
                          {req.type}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground max-w-55 truncate" title={req.details}>{req.details}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-foreground">৳{formatCurrency(req.amount)}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[req.status] || 'bg-gray-100 text-gray-700'}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredRecords.length > 0 && (
            <div className="border-t border-border px-5 py-3 bg-muted/20 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total for period</span>
              <span className="text-sm font-bold text-foreground">
                ৳{formatCurrency(filteredRecords.reduce((s, r) => s + r.amount, 0))}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
