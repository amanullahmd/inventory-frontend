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

export default function StockInPage() {
  const { data: session } = useSession()
  const isAdmin = (session as any)?.roles?.includes('ROLE_ADMIN')
  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null)
  const [batches, setBatches] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([
    { id: '1', name: 'Main Warehouse' },
    { id: '2', name: 'Branch A Warehouse' },
    { id: '3', name: 'Branch B Warehouse' },
  ])
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, item: 'Laptop Pro 15"', quantity: 10, date: '2024-12-13', user: 'John Doe', warehouse: 'Main Warehouse', batch: 'BATCH-001' },
    { id: 2, item: 'Wireless Mouse', quantity: 50, date: '2024-12-12', user: 'Jane Smith', warehouse: 'Branch A Warehouse', batch: 'BATCH-002' },
    { id: 3, item: 'USB-C Cable', quantity: 100, date: '2024-12-11', user: 'Bob Johnson', warehouse: 'Main Warehouse', batch: 'BATCH-003' },
  ])

  useEffect(() => {
    // Fetch items from backend on component mount
    const fetchItems = async () => {
      try {
        setLoading(true)
        const backendItems = await ItemService.getItems()
        setItems(backendItems)
      } catch (err) {
        console.error('Failed to fetch items:', err)
        setError('Failed to load items from server')
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchItems()
    }
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedItem || !quantity || !selectedWarehouse) {
      setError('Please fill in all required fields')
      return
    }

    const item = items.find(i => String(i.id) === String(selectedItem))
    if (!item) {
      setError('Invalid item selected')
      return
    }

    try {
      setLoading(true)
      await StockService.recordStockIn({
        itemId: String(selectedItem),
        quantity: parseInt(quantity),
        note: notes,
        batchId: selectedBatch || undefined,
        warehouseId: selectedWarehouse,
      })

      const newTransaction = {
        id: recentTransactions.length + 1,
        item: item.name,
        quantity: parseInt(quantity),
        date: new Date().toISOString().split('T')[0],
        user: session?.user?.name || 'Unknown',
        warehouse: warehouses.find(w => w.id === selectedWarehouse)?.name || 'Unknown',
        batch: selectedBatch || 'N/A',
      }

      setRecentTransactions([newTransaction, ...recentTransactions])
      setSuccess(`Successfully added ${quantity} units of ${item.name}`)
      setSelectedItem('')
      setSelectedBatch('')
      setSelectedWarehouse('')
      setQuantity('')
      setNotes('')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to record stock in'
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

      const filename = `stock-in-${DateFilterService.formatDateForFilename(new Date())}.pdf`
      PDFExportService.generateStockInPDF(filteredTransactions, {
        filename,
        title: 'Stock In Report',
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
        <h1 className="text-4xl font-bold tracking-tight text-foreground">📥 Stock In</h1>
        <p className="text-lg text-muted-foreground mt-2">Add inventory to your items</p>
      </div>

      {/* Export Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-md">
        <h2 className="text-2xl font-bold text-foreground mb-4">📊 Export stock in report</h2>
        <div className="space-y-4">
          <DateRangePicker
            onDateRangeChange={handleDateRangeChange}
            label="Select Date Range for Export"
          />
          <ExportButton
            onClick={handleExport}
            disabled={!selectedDateRange}
            loading={exportLoading}
            exportType="stock-in"
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
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Selection */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">
                  Select Item *
                </label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  disabled={loading}
                >
                  <option value="">Choose an item...</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (SKU: {item.sku}) - Current: {item.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warehouse Selection */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">
                  Warehouse *
                </label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select a warehouse...</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Selection */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">
                  Batch (Optional)
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  disabled={!selectedItem}
                >
                  <option value="">Select a batch...</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchNumber} (Exp: {batch.expiryDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">
                  Quantity to Add *
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this stock in..."
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              >
                ✅ Confirm stock in
              </button>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <h3 className="text-lg font-bold text-foreground">ℹ️ How it works</h3>
            <p className="mt-3 text-base text-muted-foreground">
              Use this form to add inventory when new stock arrives. All transactions are logged automatically.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <h3 className="text-lg font-bold text-foreground">💡 Tip</h3>
            <p className="mt-3 text-base text-muted-foreground">
              Keep detailed notes for audit trails and inventory reconciliation.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h2 className="text-2xl font-bold text-foreground">📋 Recent stock in transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Item</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Quantity</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Warehouse</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Batch</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">User</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-accent/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-foreground">{tx.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-base font-semibold border border-chart-2/30 bg-chart-2/10 text-chart-2">
                      +{tx.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-muted-foreground">{(tx as any).warehouse || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-muted-foreground">{(tx as any).batch || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-muted-foreground">{tx.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-muted-foreground">{tx.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
