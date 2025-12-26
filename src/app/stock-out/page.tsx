'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { ExportButton } from '@/components/ui/ExportButton'
import { PDFExportService } from '@/lib/services/pdfExportService'
import { DateFilterService } from '@/lib/services/dateFilterService'
import { ItemService } from '@/lib/services/itemService'
import { StockService } from '@/lib/services/stockService'
import { Item } from '@/lib/types'

const DUMMY_ITEMS: Item[] = [
  { id: '1', name: 'Laptop Pro 15"', sku: 'LP-001', unitCost: 2499.99, currentStock: 45, createdAt: '2024-01-15' },
  { id: '2', name: 'Wireless Mouse', sku: 'WM-002', unitCost: 99.99, currentStock: 156, createdAt: '2024-01-20' },
  { id: '3', name: 'USB-C Cable', sku: 'UC-003', unitCost: 12.99, currentStock: 8, createdAt: '2024-01-23' },
  { id: '4', name: 'Monitor 27"', sku: 'MN-004', unitCost: 799.99, currentStock: 0, createdAt: '2024-01-26' },
  { id: '5', name: 'Mechanical Keyboard', sku: 'MK-005', unitCost: 149.99, currentStock: 32, createdAt: '2024-01-30' },
]

export default function StockOutPage() {
  const { data: session } = useSession()
  const isAdmin = (session as any)?.roles?.includes('ROLE_ADMIN')
  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState('')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('TRANSFERRED')
  const [customReason, setCustomReason] = useState('')
  const [recipient, setRecipient] = useState('')
  const [branch, setBranch] = useState('Main Branch')
  const [notes, setNotes] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null)
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, item: 'Laptop Pro 15"', quantity: 5, reason: 'sale', branch: 'Main Branch', date: '2024-12-13', user: 'Alice Brown' },
    { id: 2, item: 'Wireless Mouse', quantity: 20, reason: 'damaged', branch: 'Branch B', date: '2024-12-12', user: 'Charlie Davis' },
    { id: 3, item: 'USB-C Cable', quantity: 15, reason: 'return', branch: 'Branch C', date: '2024-12-11', user: 'Eve Wilson' },
  ])

  useEffect(() => {
    // Initialize with dummy items on mount
    setItems(DUMMY_ITEMS)
    setLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedItem || !quantity || !reason) {
      setError('Please fill in all required fields')
      return
    }

    // Validate custom reason if "OTHER" is selected
    if (reason === 'OTHER' && !customReason.trim()) {
      setError('Please provide a custom reason')
      return
    }

    const item = items.find(i => String(i.id) === String(selectedItem))
    if (!item) {
      setError('Invalid item selected')
      return
    }

    if (parseInt(quantity) > item.currentStock) {
      setError(`Cannot remove ${quantity} units. Only ${item.currentStock} available.`)
      return
    }

    try {
      setLoading(true)
      const finalReason = reason === 'OTHER' ? customReason : reason
      
      await StockService.recordStockOut({
        itemId: String(selectedItem),
        quantity: parseInt(quantity),
        note: notes,
        branch: branch,
        reason: finalReason,
        recipient: recipient || undefined
      })

      const newTransaction = {
        id: recentTransactions.length + 1,
        item: item.name,
        quantity: parseInt(quantity),
        reason: finalReason,
        branch: branch,
        date: new Date().toISOString().split('T')[0],
        user: session?.user?.name || 'Unknown',
      }

      setRecentTransactions([newTransaction, ...recentTransactions])
      setSuccess(`Successfully removed ${quantity} units of ${item.name} from ${branch}`)
      setSelectedItem('')
      setQuantity('')
      setReason('TRANSFERRED')
      setCustomReason('')
      setRecipient('')
      setBranch('Main Branch')
      setNotes('')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to record stock out'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!selectedDateRange) {
      setError('Please select a date range')
      return
    }

    setExportLoading(true)
    try {
      const filteredTransactions = DateFilterService.filterByDateRange(
        recentTransactions,
        selectedDateRange.start,
        selectedDateRange.end
      )

      if (filteredTransactions.length === 0) {
        setError('No transactions found for the selected date range')
        setExportLoading(false)
        return
      }

      const filename = `stock-out-${DateFilterService.formatDateForFilename(new Date())}.pdf`
      PDFExportService.generateStockOutPDF(filteredTransactions, {
        filename,
        title: 'Stock Out Report',
        timestamp: new Date(),
      })

      setSuccess(`Successfully exported ${filteredTransactions.length} transactions`)
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

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to manage stock.</p>
        </div>
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
        <div className="rounded-xl border border-border bg-card p-8 max-w-md w-full text-center shadow-sm">
          <h1 className="text-xl font-semibold text-foreground mb-2">Access denied</h1>
          <p className="text-muted-foreground mb-6">
            Admins cannot perform stock operations. Only regular users can manage stock in/out.
          </p>
          <p className="text-sm text-muted-foreground">
            Your role: <span className="font-semibold text-foreground">Admin</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">📤 Stock Out</h1>
        <p className="text-lg text-muted-foreground mt-2">Remove inventory from your items</p>
      </div>

      {/* Export Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-md">
        <h2 className="text-2xl font-bold text-foreground mb-4">📊 Export stock out report</h2>
        <div className="space-y-4">
          <DateRangePicker
            onDateRangeChange={handleDateRangeChange}
            label="Select Date Range for Export"
          />
          <ExportButton
            onClick={handleExport}
            disabled={!selectedDateRange}
            loading={exportLoading}
            exportType="stock-out"
            label="Export to PDF"
          />
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Selection */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Select Item *
                </label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  disabled={loading}
                >
                  <option value="">Choose an item...</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (SKU: {item.sku}) - Available: {item.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Quantity to Remove *
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Reason for Stock Out *
                </label>
                <select
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value)
                    if (e.target.value !== 'OTHER') {
                      setCustomReason('')
                    }
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="TRANSFERRED">Transferred to branch</option>
                  <option value="GIVEN">Given to person</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="LOST">Lost</option>
                  <option value="USED">Used</option>
                  <option value="DAMAGED">Damaged</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Custom Reason (conditional) */}
              {reason === 'OTHER' && (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">
                    Please specify the reason *
                  </label>
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter custom reason"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}

              {/* Recipient */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Recipient (Optional)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Person, branch, or department receiving the stock"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Branch */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Branch * (Type or Select)
                </label>
                <input
                  type="text"
                  list="branchList"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="Enter branch name or select from list"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <datalist id="branchList">
                  <option value="Main Branch" />
                  <option value="Branch A" />
                  <option value="Branch B" />
                  <option value="Branch C" />
                  <option value="Branch D" />
                </datalist>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this stock out..."
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
              >
                Confirm stock out
              </button>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground">How it works</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Record when inventory leaves your warehouse. Track transfers, usage, damage, and losses.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground">Important</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ensure you have sufficient stock before removing items. Verify quantities carefully.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h2 className="text-sm font-semibold text-foreground">Recent stock out transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Item</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">User</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-accent/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{tx.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-chart-3/30 bg-chart-3/10 text-chart-3">
                      -{tx.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground capitalize">
                      {tx.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-chart-1/30 bg-chart-1/10 text-chart-1">
                      {tx.branch}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{tx.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{tx.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
