'use client'

import { memo } from 'react'
import { Car, DollarSign, Award, Activity, TrendingUp, TrendingDown, Fuel, Wrench, Droplets, PenTool, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const VIBRANT_COLORS = [
  '#0088a3', '#10b981', '#f59e0b', '#06b6d4',
  '#8b5cf6', '#ec4899', '#f43f5e', '#6366f1',
]

interface SummaryCardProps {
  icon: 'car' | 'dollar' | 'award' | 'activity'
  value: string | number
  label: string
  sublabel?: string
  badge?: { text: string; positive: boolean }
  topRightLabel?: string
}

export const SummaryCard = memo(({ icon, value, label, sublabel, badge, topRightLabel }: SummaryCardProps) => {
  const iconMap = {
    car: Car,
    dollar: DollarSign,
    award: Award,
    activity: Activity,
  }
  const Icon = iconMap[icon]
  const bgColors: Record<string, string> = {
    car: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    dollar: 'bg-green-500/20 text-green-500',
    award: 'bg-amber-500/20 text-amber-500',
    activity: 'bg-blue-500/20 text-blue-500',
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bgColors[icon]}`}>
          <Icon size={18} />
        </div>
        {badge ? (
          <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            badge.positive ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
          }`}>
            {badge.positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {badge.text}
          </span>
        ) : topRightLabel ? (
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{topRightLabel}</span>
        ) : null}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
    </div>
  )
})

SummaryCard.displayName = 'SummaryCard'

interface VehicleCardProps {
  carModel: string
  carNo: string
  vehicleType: string
  totalCost: number
  dieselCost: number
  serviceCost: number
  engineOilCost: number
  otherCost: number
  maxCost: number
  index: number
}

export const VehicleCard = memo(({ 
  carModel, carNo, vehicleType, totalCost, dieselCost, 
  serviceCost, engineOilCost, otherCost, maxCost, index 
}: VehicleCardProps) => {
  const costPercent = (totalCost / maxCost * 100).toFixed(0)

  return (
    <Link
      href={`/vehicle-management/${encodeURIComponent(carModel)}`}
      className="group rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-lg hover:border-emerald-500/40 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs"
          style={{ backgroundColor: VIBRANT_COLORS[index % VIBRANT_COLORS.length] }}
        >
          {carModel.substring(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
            {carModel}
          </h3>
          <p className="text-[10px] text-muted-foreground">{carNo} · {vehicleType}</p>
        </div>
        <ArrowRight size={14} className="text-muted-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>

      {/* Cost bar visualization */}
      <div className="mb-3">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">৳{totalCost.toLocaleString()}</span>
          <span className="text-[10px] text-muted-foreground">{costPercent}% of highest</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${costPercent}%`,
              backgroundColor: VIBRANT_COLORS[index % VIBRANT_COLORS.length],
            }}
          />
        </div>
      </div>

      {/* Category breakdown mini */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground flex items-center gap-1"><Fuel size={10} /> Diesel</span>
          <span className="font-medium text-foreground">৳{(dieselCost / 1000).toFixed(1)}k</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground flex items-center gap-1"><Wrench size={10} /> Service</span>
          <span className="font-medium text-foreground">৳{(serviceCost / 1000).toFixed(1)}k</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground flex items-center gap-1"><Droplets size={10} /> Oil</span>
          <span className="font-medium text-foreground">৳{(engineOilCost / 1000).toFixed(1)}k</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground flex items-center gap-1"><PenTool size={10} /> Other</span>
          <span className="font-medium text-foreground">৳{(otherCost / 1000).toFixed(1)}k</span>
        </div>
      </div>
    </Link>
  )
})

VehicleCard.displayName = 'VehicleCard'
