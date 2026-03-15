'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Car, ArrowLeft, Fuel, Wrench, Droplets, PenTool, TrendingUp, Calendar } from 'lucide-react'
import { formatDateDMY } from '@/lib/utils/date'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface VehicleRequisition {
  id: string
  carNo: string
  carModel: string
  vehicleType: string
  date: string
  type: 'Oil' | 'Service' | 'Diesel' | 'Engine Oil' | 'Other'
  details: string
  amount: number
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected'
}

// Same demo data as vehicle management page
const ALL_REQUISITIONS: VehicleRequisition[] = [
  { id: 'VR-001', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-01-10T10:00:00Z', type: 'Diesel', details: '50 Liters for Toyota Hiace', amount: 5500, status: 'Completed' },
  { id: 'VR-002', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-02-05T14:30:00Z', type: 'Service', details: 'Regular service - Toyota Hiace', amount: 8000, status: 'Completed' },
  { id: 'VR-003', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-02-20T09:15:00Z', type: 'Diesel', details: '60 Liters for Toyota Hiace', amount: 6600, status: 'Completed' },
  { id: 'VR-004', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-03-01T10:00:00Z', type: 'Diesel', details: '50 Liters for Toyota Hiace', amount: 5500, status: 'Completed' },
  { id: 'VR-005', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-03-15T11:00:00Z', type: 'Engine Oil', details: 'Engine oil change', amount: 3200, status: 'Completed' },
  { id: 'VR-006', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-01-08T08:00:00Z', type: 'Diesel', details: '40 Liters diesel', amount: 4400, status: 'Completed' },
  { id: 'VR-007', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-02-12T14:00:00Z', type: 'Service', details: 'Monthly service', amount: 10000, status: 'Completed' },
  { id: 'VR-008', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-03-03T14:30:00Z', type: 'Service', details: 'Brake pad replacement', amount: 12000, status: 'Approved' },
  { id: 'VR-009', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-01-20T10:00:00Z', type: 'Diesel', details: '55 Liters diesel', amount: 6050, status: 'Completed' },
  { id: 'VR-010', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-02-18T09:00:00Z', type: 'Engine Oil', details: 'Engine oil + filter', amount: 5200, status: 'Completed' },
  { id: 'VR-011', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-03-05T09:15:00Z', type: 'Engine Oil', details: 'Scheduled maintenance', amount: 4500, status: 'Pending' },
  { id: 'VR-012', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-01-25T11:00:00Z', type: 'Diesel', details: '30 Liters', amount: 3300, status: 'Completed' },
  { id: 'VR-013', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-02-22T10:00:00Z', type: 'Service', details: 'Regular service', amount: 5000, status: 'Completed' },
  { id: 'VR-014', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-03-06T11:45:00Z', type: 'Other', details: 'Car wash and cleaning', amount: 800, status: 'Completed' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Diesel': return <Fuel size={14} className="text-blue-500" />
    case 'Service': return <Wrench size={14} className="text-orange-500" />
    case 'Engine Oil':
    case 'Oil': return <Droplets size={14} className="text-amber-500" />
    default: return <PenTool size={14} className="text-purple-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'Approved': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export default function VehicleModelPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const modelParam = decodeURIComponent(params?.model as string || '')

  const [selectedYear, setSelectedYear] = useState(2024)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

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

  const vehicleRequisitions = ALL_REQUISITIONS.filter(r => r.carModel === modelParam)
  const vehicleInfo = vehicleRequisitions[0]

  if (!vehicleInfo) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No records found for "{modelParam}"</p>
        <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">← Go back</button>
      </div>
    )
  }

  // Group by month for selected year
  const monthlyData = MONTHS.map((month, idx) => {
    const monthRecords = vehicleRequisitions.filter(r => {
      const d = new Date(r.date)
      return d.getFullYear() === selectedYear && d.getMonth() === idx
    })
    const total = monthRecords.reduce((sum, r) => sum + r.amount, 0)
    return { month, records: monthRecords, total }
  })

  const filteredRecords = selectedMonth !== null
    ? vehicleRequisitions.filter(r => {
        const d = new Date(r.date)
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
      })
    : vehicleRequisitions.filter(r => new Date(r.date).getFullYear() === selectedYear)

  const totalYearlyCost = vehicleRequisitions
    .filter(r => new Date(r.date).getFullYear() === selectedYear)
    .reduce((sum, r) => sum + r.amount, 0)

  const maxMonthlyAmount = Math.max(...monthlyData.map(m => m.total), 1)

  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Vehicle Management
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Car className="text-primary-foreground" size={28} />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{vehicleInfo.carModel}</h1>
                <p className="mt-1 text-muted-foreground">
                  {vehicleInfo.carNo} · {vehicleInfo.vehicleType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedYear}
                onChange={e => { setSelectedYear(Number(e.target.value)); setSelectedMonth(null) }}
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              >
                {[2022, 2023, 2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Records</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{vehicleRequisitions.filter(r => new Date(r.date).getFullYear() === selectedYear).length}</p>
            <p className="text-xs text-muted-foreground mt-1">{selectedYear}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Cost</p>
            <p className="mt-1 text-2xl font-bold text-foreground">৳{totalYearlyCost.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{selectedYear}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Monthly</p>
            <p className="mt-1 text-2xl font-bold text-foreground">৳{Math.round(totalYearlyCost / 12).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Per month</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Months</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{monthlyData.filter(m => m.total > 0).length}</p>
            <p className="text-xs text-muted-foreground mt-1">With records</p>
          </div>
        </div>

        {/* Monthly Cost Bar Chart */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp size={18} className="text-primary-foreground" />
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
            {monthlyData.map((m, idx) => {
              const height = m.total > 0 ? Math.max((m.total / maxMonthlyAmount) * 100, 8) : 0
              const isSelected = selectedMonth === idx
              return (
                <div
                  key={m.month}
                  className="flex-1 min-w-[40px] flex flex-col items-center gap-1 cursor-pointer group"
                  onClick={() => setSelectedMonth(isSelected ? null : idx)}
                >
                  <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                    {m.total > 0 ? (
                      <div
                        style={{ height: `${height}%` }}
                        className={`w-full rounded-t-lg transition-all ${isSelected
                          ? 'bg-primary-foreground'
                          : 'bg-primary/60 group-hover:bg-primary/80'
                        }`}
                        title={`৳${m.total.toLocaleString()}`}
                      />
                    ) : (
                      <div className="w-full h-1 bg-border/40 rounded" />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {m.month}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {m.total > 0 ? `৳${(m.total / 1000).toFixed(1)}k` : '—'}
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
                          {getTypeIcon(req.type)}
                          {req.type}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground max-w-[220px] truncate" title={req.details}>{req.details}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-foreground">৳{req.amount.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(req.status)}`}>
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
                ৳{filteredRecords.reduce((s, r) => s + r.amount, 0).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
