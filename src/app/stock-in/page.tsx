'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { ItemService } from '@/lib/services/itemService'
import { StockService } from '@/lib/services/stockService'
import { Item } from '@/lib/types'
import { SupplierService } from '@/lib/services/supplierService'
import { WarehouseService } from '@/lib/services/warehouseService'

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
  const [detailsRef, setDetailsRef] = useState<string | null>(null)
  const [details, setDetails] = useState<Array<{ itemId: number; sku: string; name: string; quantity: number; createdAt: string; supplierId?: number; warehouseId?: number }>>([])
  const [editingRef, setEditingRef] = useState<string | null>(null)
  const [editLines, setEditLines] = useState<Array<{ itemId: string; quantity: string }>>([])
  const isToday = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
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
  }

  const addLine = () => setLines([...lines, { itemId: '', quantity: '' }])
  const updateLine = (idx: number, field: 'itemId' | 'quantity', value: string) => {
    setLines(lines.map((l, i) => i === idx ? { ...l, [field]: value } : l))
  }
  const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx))

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
                      <button onClick={async () => {
                        try {
                          const rows = await StockService.getStockInByReference(row.referenceNumber)
                          setError(null)
                          setEditingRef(row.referenceNumber)
                          setLines(rows.map(d => ({ itemId: String(d.itemId), quantity: String(d.quantity) })))
                          setSelectedSupplier(String(rows[0]?.supplierId || ''))
                          setSelectedWarehouse(String(rows[0]?.warehouseId || ''))
                        } catch (err) {
                          const e = err as Error
                          setEditingRef(row.referenceNumber)
                          setLines([{ itemId: '', quantity: '' }])
                          setError(e.message || 'Failed to open stock-in')
                        }
                      }} className="text-primary-foreground hover:underline">{row.referenceNumber}</button>
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

        {detailsRef && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <button aria-label="Close" className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setDetailsRef(null); setDetails([]); setEditingRef(null) }} />
            <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl animate-scale-in">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-foreground">Stock In ID: {detailsRef}</h3>
                <button className="rounded-lg border border-border bg-background px-3 py-2 hover:bg-accent transition-colors" onClick={() => { setDetailsRef(null); setDetails([]); setEditingRef(null) }}>Close</button>
              </div>
              {details.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Item</th>
                      <th className="text-left py-2">SKU</th>
                      <th className="text-left py-2">Qty</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map(r => (
                      <tr key={`${r.itemId}-${r.sku}`}>
                        <td className="py-1">{r.name}</td>
                        <td className="py-1">{r.sku}</td>
                        <td className="py-1">{r.quantity}</td>
                        <td className="py-1">{new Date(r.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="mt-4 flex gap-3">
                <button
                  className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition-all"
                  onClick={() => {
                    setEditingRef(detailsRef)
                    setEditLines(details.map(d => ({ itemId: String(d.itemId), quantity: String(d.quantity) })))
                    setSelectedSupplier(String(details[0].supplierId || ''))
                    setSelectedWarehouse(String(details[0].warehouseId || ''))
                  }}
                >
                  Edit
                </button>
                <button
                  className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive px-4 py-2 hover:bg-destructive/20 transition-colors"
                  onClick={async () => {
                    try {
                      await StockService.deleteStockIn(detailsRef!)
                      setSuccess('Stock-in deleted')
                      setDetailsRef(null)
                      setDetails([])
                      const grouped = await StockService.getStockInTransactions().catch(() => [])
                      setGroups(grouped)
                    } catch (err) {
                      const e = err as Error
                      setError(e.message || 'Delete failed')
                    }
                  }}
                >
                  Delete
                </button>
              </div>

              {editingRef && (
                <div className="mt-6 border-t border-border pt-4">
                  <h4 className="font-semibold mb-2">Edit Items</h4>
                  <div className="md:col-span-3 mb-3">
                    <label className="block text-sm mb-1">Stock In ID</label>
                    <input value={editingRef || ''} onChange={e => setEditingRef(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="md:col-span-3">
                      <label className="block text-sm mb-1">Supplier (Optional)</label>
                      <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                        <option value="">No supplier</option>
                        {suppliers.map(s => (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>))}
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm mb-1">Warehouse *</label>
                      <select value={selectedWarehouse} onChange={e => setSelectedWarehouse(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                        <option value="">Select a warehouse...</option>
                        {warehouses.map(w => (<option key={w.warehouseId || w.id} value={w.warehouseId || w.id}>{w.name}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden mb-3">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-muted-foreground">Item</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-muted-foreground">Qty</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {editLines.map((line, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">
                              <select value={line.itemId} onChange={e => setEditLines(editLines.map((l, i) => i === idx ? { ...l, itemId: e.target.value } : l))} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                                <option value="">Choose an item...</option>
                                {items.map(item => (<option key={item.id} value={item.id}>{item.name} (SKU: {item.sku})</option>))}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <input type="number" min="1" value={line.quantity} onChange={e => setEditLines(editLines.map((l, i) => i === idx ? { ...l, quantity: e.target.value } : l))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
                            </td>
                            <td className="px-4 py-2">
                              <button type="button" onClick={() => setEditLines(editLines.filter((_, i) => i !== idx))} className="rounded-lg border border-border px-3 py-2 hover:bg-accent transition-colors">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={() => setEditLines([...editLines, { itemId: '', quantity: '' }])} className="rounded-lg border border-border px-3 py-2 hover:bg-accent transition-colors">+ Add Item</button>
                  <div className="flex gap-3 mt-3">
                    <button
                      className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition-all"
                      onClick={async () => {
                        if (!selectedWarehouse) { setError('Select warehouse'); return }
                        const payloadItems = editLines.filter(l => l.itemId && l.quantity).map(l => ({ itemId: parseInt(l.itemId), quantity: parseInt(l.quantity) }))
                        if (payloadItems.length === 0) { setError('Add at least one item'); return }
                        try {
                          const updatePayload: any = { warehouseId: parseInt(selectedWarehouse), items: payloadItems, notes, referenceNumber: editingRef! }
                          if (selectedSupplier) updatePayload.supplierId = parseInt(selectedSupplier)
                          await StockService.updateStockIn(detailsRef!, updatePayload)
                          setSuccess('Stock-in updated')
                          setDetailsRef(null)
                          setEditingRef(null)
                          setDetails([])
                          const grouped = await StockService.getStockInTransactions().catch(() => [])
                          setGroups(grouped)
                        } catch (err) {
                          const e = err as Error
                          setError(e.message || 'Update failed')
                        }
                      }}
                    >
                      Save
                    </button>
                    <button className="rounded-lg border border-border px-4 py-2 hover:bg-accent transition-colors" onClick={() => setEditingRef(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
