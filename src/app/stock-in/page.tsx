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
  const isAdmin = (session as any)?.roles?.includes('ROLE_ADMIN')
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
  const [groups, setGroups] = useState<Array<{ referenceNumber: string; count: number; createdBy?: string; createdAt: string }>>([])
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
    
    if (!selectedSupplier || !selectedWarehouse) { setError('Select supplier and warehouse'); return }
    const payloadItems = lines
      .filter(l => l.itemId && l.quantity)
      .map(l => ({ itemId: parseInt(l.itemId), quantity: parseInt(l.quantity) }))
    if (payloadItems.length === 0) { setError('Add at least one item'); return }

    try {
      setLoading(true)
      const res = await StockService.recordStockInBatch({
        supplierId: parseInt(selectedSupplier),
        warehouseId: parseInt(selectedWarehouse),
        notes,
        items: payloadItems
      })
      const ref = res.referenceNumber || ''
      setSuccess(`Stock-in saved (ID ${ref})`)
      setSelectedSupplier('')
      setSelectedWarehouse('')
      setLines([{ itemId: '', quantity: '' }])
      setNotes('')
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
              {/* Supplier */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">Supplier *</label>
                <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring" required>
                  <option value="">Choose a supplier...</option>
                  {suppliers.map(s => (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>))}
                </select>
              </div>
              
              {/* Warehouse */}
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
                  {warehouses.map(w => (<option key={w.warehouseId || w.id} value={w.warehouseId || w.id}>{w.name}</option>))}
                </select>
              </div>

              {/* Lines */}
              <div className="space-y-4">
                <label className="block text-base font-semibold text-foreground">Items *</label>
                {lines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select value={line.itemId} onChange={e => updateLine(idx, 'itemId', e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3">
                      <option value="">Choose an item...</option>
                      {items.map(item => (<option key={item.id} value={item.id}>{item.name} (SKU: {item.sku})</option>))}
                    </select>
                    <input type="number" min="1" value={line.quantity} onChange={e => updateLine(idx, 'quantity', e.target.value)} placeholder="Qty" className="w-full rounded-lg border border-border bg-background px-4 py-3" />
                    <button type="button" onClick={() => removeLine(idx)} className="rounded-md border border-border px-3 py-2">Remove</button>
                  </div>
                ))}
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
      <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">📋 Recent stock in transactions</h2>
            <span className="text-xs text-muted-foreground">By whom and when</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Stock In ID</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Items Count</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">By</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {groups.length === 0 ? (
                <tr><td className="px-6 py-8 text-center text-muted-foreground" colSpan={4}>No stock in transactions</td></tr>
              ) : groups.map((row) => (
                <tr key={row.referenceNumber} className="hover:bg-accent/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-foreground">
                    <button onClick={async () => {
                      try {
                        const rows = await StockService.getStockInByReference(row.referenceNumber)
                        setDetails(rows as any)
                        setDetailsRef(row.referenceNumber)
                        setError(null)
                      } catch (err) {
                        const e = err as Error
                        setError(e.message || 'Failed to load stock-in details')
                      }
                    }} className="text-primary hover:underline">{row.referenceNumber}</button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-muted-foreground">
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">{row.count}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{row.createdBy || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {detailsRef && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <button aria-label="Close" className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setDetailsRef(null); setDetails([]); setEditingRef(null) }} />
          <div className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-foreground">Stock In ID: {detailsRef}</h3>
              <button className="rounded-md border border-border bg-background px-3 py-2" onClick={() => { setDetailsRef(null); setDetails([]); setEditingRef(null) }}>Close</button>
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
              {details.every(d => isToday(d.createdAt)) ? (
                <>
                  <button
                    className="rounded-md bg-primary px-3 py-2 text-primary-foreground"
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
                    className="rounded-md border border-destructive text-destructive px-3 py-2"
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
                </>
              ) : (
                <span className="text-xs text-muted-foreground">Past day: editing disabled</span>
              )}
            </div>
            
            {editingRef && (
              <div className="mt-6 border-t border-border pt-4">
                <h4 className="font-semibold mb-2">Edit Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="md:col-span-3">
                    <label className="block text-sm mb-1">Supplier *</label>
                    <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                      <option value="">Choose a supplier...</option>
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
                {editLines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                    <select value={line.itemId} onChange={e => setEditLines(editLines.map((l,i)=> i===idx?{...l,itemId:e.target.value}:l))} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                      <option value="">Choose an item...</option>
                      {items.map(item => (<option key={item.id} value={item.id}>{item.name} (SKU: {item.sku})</option>))}
                    </select>
                    <input type="number" min="1" value={line.quantity} onChange={e => setEditLines(editLines.map((l,i)=> i===idx?{...l,quantity:e.target.value}:l))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
                    <button type="button" onClick={() => setEditLines(editLines.filter((_,i)=>i!==idx))} className="rounded-md border border-border px-3 py-2">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => setEditLines([...editLines, { itemId: '', quantity: '' }])} className="rounded-md border border-border px-3 py-2 mb-3">+ Add Item</button>
                <div className="flex gap-3">
                  <button
                    className="rounded-md bg-primary px-3 py-2 text-primary-foreground"
                    onClick={async () => {
                      if (!selectedSupplier || !selectedWarehouse) { setError('Select supplier and warehouse'); return }
                      const payloadItems = editLines.filter(l => l.itemId && l.quantity).map(l => ({ itemId: parseInt(l.itemId), quantity: parseInt(l.quantity) }))
                      if (payloadItems.length === 0) { setError('Add at least one item'); return }
                      try {
                        await StockService.updateStockIn(editingRef!, { supplierId: parseInt(selectedSupplier), warehouseId: parseInt(selectedWarehouse), items: payloadItems, notes })
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
                  <button className="rounded-md border border-border px-3 py-2" onClick={() => setEditingRef(null)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
