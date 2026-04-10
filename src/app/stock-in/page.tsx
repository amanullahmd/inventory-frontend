'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { ItemService } from '@/lib/services/itemService'
import { StockService } from '@/lib/services/stockService'
import { Item } from '@/lib/types'
import { SupplierService } from '@/lib/services/supplierService'
import { WarehouseService } from '@/lib/services/warehouseService'
import Link from 'next/link'

const isToday = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

export default function StockInPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<Item[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState<Array<{ itemId: string; quantity: string }>>([{ itemId: '', quantity: '' }])
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<Array<{ referenceNumber: string; count: number; createdBy?: string; createdAt: string; updatedAt?: string; supplierName?: string; sourceMode?: 'SUPPLIER' | 'NON_SUPPLIER' }>>([])
  const [editingRef, setEditingRef] = useState<string | null>(null)

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true)
        const results = await Promise.allSettled([
          ItemService.getItems(),
          SupplierService.getSuppliers(),
          WarehouseService.getWarehouses(),
          StockService.getStockInTransactions(),
        ])
        if (results[0].status === 'fulfilled') setItems(results[0].value as any)
        if (results[1].status === 'fulfilled') setSuppliers(((results[1].value as any[]) || []).filter(s => s.isActive))
        if (results[2].status === 'fulfilled') setWarehouses(((results[2].value as any[]) || []).filter(w => w.isActive))
        if (results[3].status === 'fulfilled') setGroups(results[3].value as any)
        const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[]
        if (failed.length === results.length) {
          const msg = (failed[0].reason?.message as string) || 'Failed to load resources'
          setError(msg)
        } else {
          setError(null)
        }
      } finally {
        setLoading(false)
      }
    }
    if (status === 'authenticated') loadAll()
  }, [status])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedWarehouse) { setError('Select warehouse'); return }
    const payloadItems = lines
      .filter(l => l.itemId && l.quantity)
      .map(l => ({ itemId: parseInt(l.itemId), quantity: parseInt(l.quantity) }))
    if (payloadItems.length === 0) { setError('Add at least one item'); return }

    try {
      setLoading(true)
      const payload: any = { warehouseId: parseInt(selectedWarehouse), notes, items: payloadItems }
      if (selectedSupplier) payload.supplierId = parseInt(selectedSupplier)
      if (editingRef) {
        payload.referenceNumber = editingRef
        await StockService.updateStockIn(editingRef, payload)
        setSuccess('Stock-in updated')
      } else {
        const res = await StockService.recordStockInBatch(payload)
        const ref = res.referenceNumber || ''
        setSuccess(`Stock-in saved (ID ${ref})`)
      }
      setSelectedSupplier('')
      setSelectedWarehouse('')
      setLines([{ itemId: '', quantity: '' }])
      setNotes('')
      setEditingRef(null)
      const grouped = await StockService.getStockInTransactions()
      setGroups(grouped as any)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to record stock in'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [selectedWarehouse, lines, selectedSupplier, notes, editingRef])

  const addLine = () => setLines(prev => [...prev, { itemId: '', quantity: '' }])
  const updateLine = useCallback((idx: number, field: 'itemId' | 'quantity', value: string) => {
    setLines(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l))
  }, [])
  const removeLine = useCallback((idx: number) => {
    setLines(prev => prev.filter((_, i) => i !== idx))
  }, [])

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to manage stock.</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-slide-down">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Stock In</h1>
          <p className="text-muted-foreground mt-2">Add inventory to your items</p>
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
          <div className="lg:col-span-2 animate-slide-up">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-hover">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Supplier */}
                <div>
                  <label className="block text-base font-semibold text-foreground mb-3">Supplier (Optional)</label>
                  <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="">No supplier</option>
                    {suppliers.map(s => (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>))}
                  </select>
                </div>

                {/* Warehouse */}
                <div>
                  <label className="block text-base font-semibold text-foreground mb-3">
                    Branch *
                  </label>
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select a branch...</option>
                    {warehouses.map(w => (<option key={w.warehouseId || w.id} value={w.warehouseId || w.id}>{w.name}</option>))}
                  </select>
                </div>

                {/* Lines */}
                <div className="space-y-3">
                  {editingRef && (
                    <div>
                      <label className="block text-base font-semibold text-foreground mb-3">Stock In ID</label>
                      <input value={editingRef} onChange={e => setEditingRef(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  )}
                  <label className="block text-base font-semibold text-foreground">Items *</label>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-muted-foreground">Item</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-muted-foreground">Qty</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {lines.map((line, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">
                              <select value={line.itemId} onChange={e => updateLine(idx, 'itemId', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                                <option value="">Choose an item...</option>
                                {items.map(item => (<option key={item.id} value={item.id}>{item.name} (SKU: {item.sku})</option>))}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <input type="number" min="1" value={line.quantity} onChange={e => updateLine(idx, 'quantity', e.target.value)} placeholder="Qty" className="w-full rounded-lg border border-border bg-background px-3 py-2" />
                            </td>
                            <td className="px-4 py-2">
                              <button type="button" onClick={() => removeLine(idx)} className="rounded-md border border-border px-3 py-2">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={addLine} className="rounded-md border border-border px-3 py-2">+ Add Item</button>
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


        </div>

        {/* Stock In Transactions */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Recent Transactions</h2>
                <p className="text-sm text-muted-foreground mt-1">Stock in history</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Stock In ID</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Items Count</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Mode</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Supplier</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">By</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Created</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Updated</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {groups.length === 0 ? (
                  <tr><td className="px-6 py-8 text-center text-muted-foreground" colSpan={5}>No stock in transactions</td></tr>
                ) : groups.map((row) => (
                  <tr key={row.referenceNumber} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-foreground">
                      <Link href={`/stock-in/${encodeURIComponent(row.referenceNumber)}`} className="text-foreground font-bold hover:underline hover:text-primary transition-colors">{row.referenceNumber}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-muted-foreground">
                      <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">{row.count}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{row.sourceMode || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{row.supplierName || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{row.createdBy || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
