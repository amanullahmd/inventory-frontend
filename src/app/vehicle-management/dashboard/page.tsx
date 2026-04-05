'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Car,
  Fuel,
  Wrench,
  Droplets,
  PenTool,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  DollarSign,
  Award,
  Calendar,
  ArrowRight,
  List,
  LayoutDashboard,
  Activity,
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
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { VehicleService } from '@/lib/services/vehicleService'
import ChartCard from '@/components/dashboard/ChartCard'

const VIBRANT_COLORS = [
  '#0088a3', '#10b981', '#f59e0b', '#06b6d4',
  '#8b5cf6', '#ec4899', '#f43f5e', '#6366f1',
]

const CATEGORY_COLORS: Record<string, string> = {
  Diesel: '#0088a3',
  Service: '#f59e0b',
  'Engine Oil': '#10b981',
  Other: '#8b5cf6',
}

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

export default function VehicleDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const availableYears = VehicleService.getAvailableYears()
  const [selectedYear, setSelectedYear] = useState(availableYears[0] || 2024)

  if (status === 'loading') {
    return <div className="p-8"><LoadingSpinner size="medium" text="Loading..." /></div>
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please sign in to view this page.</p>
      </div>
    )
  }

  // Data
  const totals = VehicleService.getDashboardTotals(selectedYear)
  const costSummaries = VehicleService.getCostSummaries(selectedYear)
  const categoryByVehicle = VehicleService.getCategoryCostsByVehicle(selectedYear)
  const categoryDistribution = VehicleService.getOverallCategoryDistribution(selectedYear)
  const monthlyTotals = VehicleService.getMonthlyTotalCosts(selectedYear)

  // Previous year for comparison
  const prevYearTotals = VehicleService.getDashboardTotals(selectedYear - 1)
  const costChange = prevYearTotals.totalCost > 0
    ? ((totals.totalCost - prevYearTotals.totalCost) / prevYearTotals.totalCost * 100)
    : 0

  // Chart data
  const categoryChartData = categoryByVehicle.map(v => ({
    name: v.vehicle.length > 12 ? v.vehicle.substring(0, 12) + '…' : v.vehicle,
    fullName: v.vehicle,
    Diesel: v.diesel,
    Service: v.service,
    'Engine Oil': v.engineOil,
    Other: v.other,
    total: v.total,
  }))

  const rankingData = costSummaries.map(s => ({
    name: s.carModel,
    total: s.totalCost,
    carNo: s.carNo,
  })).sort((a, b) => b.total - a.total)

  const pieData = categoryDistribution
    .filter(c => c.totalCost > 0)
    .map(c => ({
      name: c.category,
      value: c.totalCost,
      percentage: c.percentage.toFixed(1),
      count: c.recordCount,
    }))

  const totalRecords = categoryDistribution.reduce((sum, c) => sum + c.recordCount, 0)

  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
        {/* Header with Tab Navigation */}
        <div className="mb-6 animate-slide-down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Car size={22} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                Vehicle Management
              </h1>
              <p className="mt-1 text-sm text-muted-foreground ml-[52px]">Fleet cost analytics and management</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
                <Calendar size={14} className="text-muted-foreground" />
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(Number(e.target.value))}
                  className="bg-transparent text-sm text-foreground font-medium focus:outline-none cursor-pointer"
                >
                  {availableYears.map(y => (
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
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400 -mb-px"
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
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 animate-slide-up">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Car size={18} className="text-emerald-700 dark:text-emerald-400" />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Fleet</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totals.totalVehicles}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Active Vehicles</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign size={18} className="text-green-500" />
              </div>
              {costChange !== 0 && (
                <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  costChange > 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                }`}>
                  {costChange > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(costChange).toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">৳{(totals.totalCost / 1000).toFixed(0)}k</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Cost (YTD)</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Award size={18} className="text-amber-500" />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Highest</span>
            </div>
            <p className="text-lg font-bold text-foreground truncate">{totals.highestCostVehicle || '—'}</p>
            <p className="text-xs text-muted-foreground mt-0.5">৳{totals.highestCostAmount.toLocaleString()}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Activity size={18} className="text-blue-500" />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{totalRecords} Records</span>
            </div>
            <p className="text-lg font-bold text-foreground">{totals.mostActiveCategory}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Top Category · ৳{totals.mostActiveCategoryAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Monthly Trend Chart — Full Width */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <ChartCard
            title="Monthly Cost Trend"
            subtitle={`${selectedYear} — Diesel, Service, Engine Oil, Other`}
            icon={TrendingUp}
          >
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTotals} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dieselGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CATEGORY_COLORS.Diesel} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CATEGORY_COLORS.Diesel} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="serviceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CATEGORY_COLORS.Service} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CATEGORY_COLORS.Service} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="oilGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CATEGORY_COLORS['Engine Oil']} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CATEGORY_COLORS['Engine Oil']} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="otherGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CATEGORY_COLORS.Other} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CATEGORY_COLORS.Other} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="month" fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `৳${(v / 1000).toFixed(0)}k`} />
                  <Tooltip {...customTooltip} formatter={(value: unknown) => typeof value === 'number' ? `৳${value.toLocaleString()}` : String(value)} />
                  <Legend />
                  <Area type="monotone" dataKey="diesel" name="Diesel" stroke={CATEGORY_COLORS.Diesel} fill="url(#dieselGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="service" name="Service" stroke={CATEGORY_COLORS.Service} fill="url(#serviceGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="engineOil" name="Engine Oil" stroke={CATEGORY_COLORS['Engine Oil']} fill="url(#oilGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="other" name="Other" stroke={CATEGORY_COLORS.Other} fill="url(#otherGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Charts Row — Category Bar + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {/* Category-wise cost per vehicle — takes 2/3 */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Cost by Category per Vehicle"
              subtitle="Grouped breakdown by expense type"
              icon={BarChart3}
            >
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                    <XAxis
                      dataKey="name"
                      fontSize={10}
                      tick={{ fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      angle={-25}
                      textAnchor="end"
                      height={55}
                    />
                    <YAxis fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `৳${(v / 1000).toFixed(0)}k`} />
                    <Tooltip {...customTooltip} formatter={(value: unknown) => typeof value === 'number' ? `৳${value.toLocaleString()}` : String(value)} />
                    <Legend />
                    <Bar dataKey="Diesel" fill={CATEGORY_COLORS.Diesel} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Service" fill={CATEGORY_COLORS.Service} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Engine Oil" fill={CATEGORY_COLORS['Engine Oil']} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Other" fill={CATEGORY_COLORS.Other} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Overall cost distribution — takes 1/3 */}
          <ChartCard
            title="Cost Distribution"
            subtitle="Category-wise spending share"
            icon={PieChartIcon}
          >
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || VIBRANT_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip {...customTooltip} formatter={(value: unknown) => typeof value === 'number' ? `৳${value.toLocaleString()}` : String(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend below pie */}
            <div className="grid grid-cols-2 gap-2 mt-2 px-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[entry.name] }} />
                  <span className="text-muted-foreground truncate">{entry.name}</span>
                  <span className="font-semibold text-foreground ml-auto">{entry.percentage}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Vehicle Cost Ranking */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <ChartCard
            title="Vehicle Cost Ranking"
            subtitle="Sorted by total cost — click to view details"
            icon={BarChart3}
          >
            <div style={{ height: Math.max(200, rankingData.length * 40 + 20) }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankingData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.1)" />
                  <XAxis type="number" fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `৳${(v / 1000).toFixed(0)}k`} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    fontSize={11}
                    width={130}
                    tick={{ fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip {...customTooltip} formatter={(value: unknown) => typeof value === 'number' ? `৳${value.toLocaleString()}` : String(value)} />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]} name="Total Cost" cursor="pointer">
                    {rankingData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={VIBRANT_COLORS[index % VIBRANT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Vehicle Quick-Access Cards */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-1 bg-primary rounded-full" />
              <h2 className="text-xl font-bold text-foreground">Fleet Overview</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{costSummaries.length} vehicles</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {costSummaries.map((vehicle, idx) => {
              const maxCost = costSummaries[0]?.totalCost || 1
              const costPercent = (vehicle.totalCost / maxCost * 100).toFixed(0)
              return (
                <Link
                  key={vehicle.carModel}
                  href={`/vehicle-management/${encodeURIComponent(vehicle.carModel)}`}
                  className="group rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-lg hover:border-emerald-500/40 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: VIBRANT_COLORS[idx % VIBRANT_COLORS.length] }}
                    >
                      {vehicle.carModel.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {vehicle.carModel}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">{vehicle.carNo} · {vehicle.vehicleType}</p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>

                  {/* Cost bar visualization */}
                  <div className="mb-3">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-lg font-bold text-foreground">৳{vehicle.totalCost.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground">{costPercent}% of highest</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${costPercent}%`,
                          backgroundColor: VIBRANT_COLORS[idx % VIBRANT_COLORS.length],
                        }}
                      />
                    </div>
                  </div>

                  {/* Category breakdown mini */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1"><Fuel size={10} /> Diesel</span>
                      <span className="font-medium text-foreground">৳{(vehicle.dieselCost / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1"><Wrench size={10} /> Service</span>
                      <span className="font-medium text-foreground">৳{(vehicle.serviceCost / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1"><Droplets size={10} /> Oil</span>
                      <span className="font-medium text-foreground">৳{(vehicle.engineOilCost / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1"><PenTool size={10} /> Other</span>
                      <span className="font-medium text-foreground">৳{(vehicle.otherCost / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
