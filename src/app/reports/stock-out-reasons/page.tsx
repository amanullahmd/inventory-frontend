'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { ExportButton } from '@/components/ui/ExportButton'
import { PDFExportService } from '@/lib/services/pdfExportService'
import { DateFilterService } from '@/lib/services/dateFilterService'
import { apiClient } from '@/lib/api/client'

interface ReasonBreakdown {
  reasonType: string
  reasonLabel: string
  count: number
  percentage: number
}



export default function StockOutReasonsReportPage() {
  const { data: session } = useSession()
  const [reasons, setReasons] = useState<ReasonBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null)
  const [filterType, setFilterType] = useState<'ALL' | 'ITEM' | 'CATEGORY'>('ALL')
  const [filterId, setFilterId] = useState<string>('')

  useEffect(() => {
    fetchStockOutReasons()
  }, [])

  const fetchStockOutReasons = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<ReasonBreakdown[]>('/reports/stock-out-reasons')
      setReasons(response.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch stock-out reasons:', err)
      setError('Failed to load stock-out reasons')
      setReasons([])
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (reasons.length === 0) {
      setError('No data to export')
      return
    }

    setExportLoading(true)
    try {
      const filename = `stock-out-reasons-${DateFilterService.formatDateForFilename(new Date())}.pdf`
      PDFExportService.generateReasonBreakdownPDF(reasons, {
        filename,
        title: 'Stock-Out Reasons Report',
        timestamp: new Date(),
        dateRange: selectedDateRange,
      })

      setSuccess(`Successfully exported stock-out reasons report`)
    } catch (err) {
      setError('Failed to generate PDF. Please try again.')
      console.error('Export error:', err)
    } finally {
      setExportLoading(false)
    }
  }

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setSelectedDateRange({ start: startDate, end: endDate })
  }

  const getReasonColor = (index: number) => {
    const colors = ['bg-chart-1', 'bg-chart-4', 'bg-chart-3', 'bg-destructive', 'bg-chart-5', 'bg-chart-2', 'bg-chart-1']
    return colors[index % colors.length]
  }

  const getReasonBadgeColor = (reasonType: string) => {
    switch (reasonType) {
      case 'TRANSFERRED':
        return 'bg-chart-1/10 text-chart-1'
      case 'GIVEN':
        return 'bg-chart-4/10 text-chart-4'
      case 'EXPIRED':
        return 'bg-chart-5/10 text-chart-5'
      case 'LOST':
        return 'bg-destructive/10 text-destructive'
      case 'USED':
        return 'bg-chart-3/10 text-chart-3'
      case 'DAMAGED':
        return 'bg-chart-4/10 text-chart-4'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const totalCount = reasons.reduce((sum, r) => sum + r.count, 0)
  const topReason = reasons.length > 0 ? reasons[0] : null

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to view reports.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Stock-out reasons</h1>
        <p className="text-muted-foreground mt-1">Analyze why inventory is leaving your warehouse</p>
      </div>

      {/* Messages */}
      {success ? (
        <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
          <SuccessMessage 
            message={success} 
            onDismiss={() => setSuccess(null)}
            autoHide
          />
        </div>
      ) : null}
      {error ? (
        <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
          <ErrorMessage 
            message={error} 
            onRetry={() => setError(null)}
          />
        </div>
      ) : null}

      {/* Filters and Export */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range Filter */}
          <div className="lg:col-span-2">
            <DateRangePicker
              onDateRangeChange={handleDateRangeChange}
              label="Filter by Date Range"
            />
          </div>

          {/* Filter Type */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Filter Type
            </label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as any)
                setFilterId('')
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Items</option>
              <option value="ITEM">Specific Item</option>
              <option value="CATEGORY">Specific Category</option>
            </select>
          </div>

          {/* Export Button */}
          <div className="flex items-end">
            <ExportButton
              onClick={handleExport}
              disabled={reasons.length === 0}
              loading={exportLoading}
              exportType="report"
              label="Export to PDF"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Total stock-outs</div>
          <div className="mt-2 text-2xl font-semibold text-foreground">{totalCount}</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Unique reasons</div>
          <div className="mt-2 text-2xl font-semibold text-foreground">{reasons.length}</div>
        </div>

        {topReason && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground">Top reason</div>
            <div className="mt-2 text-sm font-medium text-foreground">{topReason.reasonLabel}</div>
            <div className="mt-1 text-xs text-muted-foreground">{topReason.count} occurrences ({topReason.percentage}%)</div>
          </div>
        )}
      </div>

      {/* Pie Chart Visualization */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-6">Reason distribution</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Chart */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {reasons.map((reason, index) => {
                  const startAngle = reasons.slice(0, index).reduce((sum, r) => sum + (r.percentage / 100) * 360, 0)
                  const endAngle = startAngle + (reason.percentage / 100) * 360
                  
                  const startRad = (startAngle - 90) * (Math.PI / 180)
                  const endRad = (endAngle - 90) * (Math.PI / 180)
                  
                  const x1 = 100 + 80 * Math.cos(startRad)
                  const y1 = 100 + 80 * Math.sin(startRad)
                  const x2 = 100 + 80 * Math.cos(endRad)
                  const y2 = 100 + 80 * Math.sin(endRad)
                  
                  const largeArc = endAngle - startAngle > 180 ? 1 : 0
                  
                  const colors = [
                    'hsl(var(--chart-1))',
                    'hsl(var(--chart-4))',
                    'hsl(var(--chart-3))',
                    'hsl(var(--destructive))',
                    'hsl(var(--chart-5))',
                    'hsl(var(--chart-2))',
                    'hsl(var(--chart-1))',
                  ]
                  
                  return (
                    <path
                      key={index}
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={colors[index % colors.length]}
                      stroke="white"
                      strokeWidth="2"
                    />
                  )
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">{totalCount}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${getReasonColor(index)}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{reason.reasonLabel}</p>
                  <p className="text-xs text-muted-foreground">{reason.count} ({reason.percentage}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h2 className="text-2xl font-semibold text-foreground">Detailed breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Reason</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Count</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Percentage</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {reasons.map((reason, index) => (
                <tr key={index} className="hover:bg-accent/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getReasonBadgeColor(reason.reasonType)}`}>
                      {reason.reasonLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-muted text-foreground">
                      {reason.count}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="bg-chart-1 h-2 rounded-full"
                          style={{ width: `${reason.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-foreground">{reason.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {index === 0 ? 'Highest' : index === reasons.length - 1 ? 'Lowest' : 'Stable'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">Insights</h3>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
          <li>• Track the most common reasons for stock-out to identify patterns</li>
          <li>• Use this data to improve inventory management and reduce losses</li>
          <li>• Monitor damaged and lost items to prevent future occurrences</li>
          <li>• Analyze transfers to optimize branch distribution</li>
        </ul>
      </div>
    </div>
  )
}
