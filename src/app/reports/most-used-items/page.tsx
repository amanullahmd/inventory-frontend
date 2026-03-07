'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ItemService } from '@/lib/services/itemService'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { TrendingUp, Package } from 'lucide-react'
import { PDFExportService } from '@/lib/services/pdfExportService'
import { ExportButton } from '@/components/ui/ExportButton'
import { Button } from '@/components/ui/button'

interface MostUsedItem {
  itemId: string
  name: string
  sku: string
  totalUsed: number
  categoryName?: string
}

export default function MostUsedItemsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<MostUsedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleExportPDF = async () => {
    try {
      await PDFExportService.generateMostUsedPDF(items, {
        filename: `most_used_items_${new Date().toISOString().split('T')[0]}.pdf`,
        title: 'Most Used Items Report',
        timestamp: new Date(),
      })
    } catch (err) {
      console.error('Export failed:', err)
      setError('Failed to export PDF')
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMostUsedItems()
    }
  }, [status])

  const fetchMostUsedItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ItemService.getMostUsedItems()
      setItems(data)
    } catch (err) {
      console.error('Error fetching most used items:', err)
      setError('Failed to fetch most used items')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6">
          <LoadingSpinner size="medium" text="Loading..." />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-10 text-center">
          <p className="text-foreground font-medium">Please sign in to view most used items.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <LoadingSpinner size="large" text="Loading most used items..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-slide-down">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Most Used Items</h1>
                <p className="mt-2 text-muted-foreground">Items ranked by total usage quantity</p>
              </div>
              <div className="flex items-center gap-3">
                <ExportButton
                  onClick={handleExportPDF}
                  label="Export PDF"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={fetchMostUsedItems} />
          </div>
        )}

        {/* Items Table */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm animate-slide-up">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-base font-semibold text-foreground">No usage data available</h3>
            <p className="mt-2 text-sm text-muted-foreground">Items will appear here once they are used.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Item Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Total Used</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.itemId || `item-${index}`} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary-foreground font-semibold text-sm">
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Package size={18} className="text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{item.sku}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{item.categoryName || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TrendingUp size={16} className="text-success" />
                          <span className="font-semibold text-foreground">{item.totalUsed}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {items.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Total Items Tracked</p>
              <p className="text-3xl font-bold text-foreground">{items.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Most Used Item</p>
              <p className="text-lg font-semibold text-foreground">{items[0]?.name}</p>
              <p className="text-sm text-success mt-1">{items[0]?.totalUsed} units</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Total Usage</p>
              <p className="text-3xl font-bold text-foreground">{items.reduce((sum, item) => sum + item.totalUsed, 0)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
