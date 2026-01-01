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

interface StockMovement {
  id: string
  itemName: string
  itemSku: string
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT'
  quantity: number
  previousStock: number
  newStock: number
  reason?: string
  recipient?: string
  notes?: string
  userName: string
  userEmail: string
  createdAt: string
}



export default function StockMovementsPage() {
  const { data: session } = useSession()
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [filteredMovements, setFilteredMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null)
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT' | 'ADJUSTMENT'>('ALL')
  const [filterReason, setFilterReason] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'quantity' | 'user'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchStockMovements()
  }, [])

  const fetchStockMovements = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<StockMovement[]>('/reports/stock-movements')
      setMovements(response.data)
      setFilteredMovements(response.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch stock movements:', err)
      setError('Failed to load stock movements')
      setMovements([])
      setFilteredMovements([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...movements]

    // Filter by movement type
    if (filterType !== 'ALL') {
      filtered = filtered.filter(m => m.movementType === filterType)
    }

    // Filter by reason
    if (filterReason !== 'ALL') {
      filtered = filtered.filter(m => (m.reason || '').toUpperCase() === filterReason)
    }

    // Filter by date range
    if (selectedDateRange) {
      filtered = filtered.filter(m => {
        const movementDate = new Date(m.createdAt)
        return movementDate >= selectedDateRange.start && movementDate <= selectedDateRange.end
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0
      switch (sortBy) {
        case 'date':
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'type':
          compareValue = a.movementType.localeCompare(b.movementType)
          break
        case 'quantity':
          compareValue = a.quantity - b.quantity
          break
        case 'user':
          compareValue = a.userName.localeCompare(b.userName)
          break
      }
      return sortOrder === 'asc' ? compareValue : -compareValue
    })

    setFilteredMovements(filtered)
  }, [movements, filterType, selectedDateRange, sortBy, sortOrder])

  const handleExport = async () => {
    if (filteredMovements.length === 0) {
      setError('No movements to export')
      return
    }

    setExportLoading(true)
    try {
      const filename = `stock-movements-${DateFilterService.formatDateForFilename(new Date())}.pdf`
      PDFExportService.generateStockMovementsPDF(filteredMovements, {
        filename,
        title: 'Stock Movements Report',
        timestamp: new Date(),
      })

      setSuccess(`Successfully exported ${filteredMovements.length} movements`)
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

  const getMovementBadgeColor = (type: string) => {
    switch (type) {
      case 'IN':
        return 'border border-chart-2/30 bg-chart-2/10 text-chart-2'
      case 'OUT':
        return 'border border-destructive/30 bg-destructive/10 text-destructive'
      case 'ADJUSTMENT':
        return 'border border-chart-1/30 bg-chart-1/10 text-chart-1'
      default:
        return 'border border-border bg-muted text-muted-foreground'
    }
  }

  const getReasonBadgeColor = (reason?: string) => {
    if (!reason) return 'bg-muted text-muted-foreground'
    switch (reason) {
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

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to view stock movements.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Stock movements</h1>
        <p className="text-muted-foreground mt-1">View all stock in, out, and adjustment movements</p>
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

          {/* Movement Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Movement Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Types</option>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>

          {/* Reason Filter */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Reason
            </label>
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Reasons</option>
              <option value="TRANSFERRED">Transferred</option>
              <option value="GIVEN">Given</option>
              <option value="EXPIRED">Expired</option>
              <option value="LOST">Lost</option>
              <option value="USED">Used</option>
              <option value="DAMAGED">Damaged</option>
            </select>
          </div>

          {/* Export Button */}
          <div className="flex items-end">
            <ExportButton
              onClick={handleExport}
              disabled={filteredMovements.length === 0}
              loading={exportLoading}
              exportType="stock-movements"
              label="Export to PDF"
            />
          </div>
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-sm font-semibold text-muted-foreground mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-sm text-foreground"
          >
            <option value="date">Date</option>
            <option value="type">Type</option>
            <option value="quantity">Quantity</option>
            <option value="user">User</option>
          </select>
        </div>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="px-3 py-1 bg-muted hover:bg-accent text-foreground rounded-lg text-sm font-medium transition-colors"
        >
          {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </button>
        <div className="ml-auto text-sm text-muted-foreground">
          Showing {filteredMovements.length} of {movements.length} movements
        </div>
      </div>

      {/* Movements Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Item</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Stock Change</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Reason</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Recipient</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredMovements.length > 0 ? (
                filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getMovementBadgeColor(movement.movementType)}`}>
                        {movement.movementType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{movement.itemName}</div>
                      <div className="text-xs text-muted-foreground">{movement.itemSku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        movement.movementType === 'IN'
                          ? 'border-chart-2/30 bg-chart-2/10 text-chart-2'
                          : movement.movementType === 'OUT'
                          ? 'border-destructive/30 bg-destructive/10 text-destructive'
                          : 'border-chart-1/30 bg-chart-1/10 text-chart-1'
                      }`}>
                        {movement.movementType === 'IN' ? '+' : '-'}{movement.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {movement.previousStock} → {movement.newStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {movement.reason ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getReasonBadgeColor(movement.reason)}`}>
                          {movement.reason}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {movement.recipient || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{movement.userName}</div>
                      <div className="text-xs text-muted-foreground">{movement.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(movement.createdAt).toLocaleDateString()} {new Date(movement.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                    No movements found for the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">Movement types</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li><strong>IN:</strong> Inventory received or added</li>
          <li><strong>OUT:</strong> Inventory removed (sales, transfers, damage, etc.)</li>
          <li><strong>ADJUSTMENT:</strong> Manual stock count corrections</li>
        </ul>
      </div>
    </div>
  )
}
