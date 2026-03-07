'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import { PurchaseOrderService, PurchaseOrder, CreatePurchaseOrderRequest, AddPurchaseOrderItemsRequest, UpdatePurchaseOrderRequest } from '@/lib/services/purchaseOrderService'
import { SupplierService } from '@/lib/services/supplierService'
import { WarehouseService } from '@/lib/services/warehouseService'
import { formatDateDMY } from '@/lib/utils/date'
import { ItemService } from '@/lib/services/itemService'

export default function PurchaseOrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreatePurchaseOrderRequest>({ supplierId: 0, warehouseId: 0, orderDate: new Date().toISOString().slice(0, 10) })
  const [items, setItems] = useState<any[]>([])
  const [lines, setLines] = useState<Array<{ itemId: string; quantity: string; unitPrice: string }>>([{ itemId: '', quantity: '', unitPrice: '' }])
  const [editingId, setEditingId] = useState<number | null>(null)
  const STATUSES = ['DRAFT', 'APPROVED', 'PARTIAL_RECEIVED', 'RECEIVED', 'CLOSED', 'CANCELLED']
  const [formStatus, setFormStatus] = useState<string>('DRAFT')
  const [rangeStart, setRangeStart] = useState<string>('')
  const [rangeEnd, setRangeEnd] = useState<string>('')

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError(null)
      const [os, ss, ws, is] = await Promise.all([
        PurchaseOrderService.getPurchaseOrders().catch(() => []),
        SupplierService.getSuppliers().catch(() => []),
        WarehouseService.getWarehouses().catch(() => []),
        ItemService.getItems().catch(() => []),
      ])
      setOrders(os as any)
      setSuppliers(((ss as any[]) || []).filter(s => s.isActive))
      setWarehouses(ws as any)
      setItems(is as any)
    } catch (err: any) {
      setError(err.message || 'Failed to load purchase orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (status === 'authenticated') fetchAll() }, [status])

  const sumForDate = (predicate: (d: Date) => boolean) =>
    orders.reduce((acc, o) => {
      const d = new Date(o.orderDate)
      return predicate(d) ? acc + (Number(o.totalAmount ?? 0) || 0) : acc
    }, 0)
  const todayTotal = sumForDate(d => {
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  })
  const monthTotal = sumForDate(d => {
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const yearTotal = sumForDate(d => d.getFullYear() === new Date().getFullYear())
  const filtered = orders.filter(o => {
    if (!rangeStart && !rangeEnd) return true
    const d = new Date(o.orderDate)
    const s = rangeStart ? new Date(rangeStart) : null
    const e = rangeEnd ? new Date(rangeEnd) : null
    if (s && d < s) return false
    if (e) { const ed = new Date(e); ed.setHours(23, 59, 59, 999); if (d > ed) return false }
    return true
  })
  const rangeTotal = filtered.reduce((acc, o) => acc + (Number(o.totalAmount ?? 0) || 0), 0)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.supplierId || !form.warehouseId || !form.orderDate) { setError('All required fields must be filled'); return }
    try {
      setError(null); setSuccess(null)
      const created = await PurchaseOrderService.createPurchaseOrder(form)
      setOrders([created, ...orders])
      setSuccess('Purchase order created')
      // Optional: add lines if provided
      const payloadItems = lines.filter(l => l.itemId && l.quantity && l.unitPrice).map(l => ({
        itemId: parseInt(l.itemId), quantity: parseInt(l.quantity), unitPrice: parseFloat(l.unitPrice)
      }))
      if (payloadItems.length > 0) {
        const updated = await PurchaseOrderService.addItems(created.purchaseOrderId, { items: payloadItems } as AddPurchaseOrderItemsRequest)
        setOrders([updated, ...orders.filter(o => o.purchaseOrderId !== created.purchaseOrderId)])
      }
      // Update status and header fields
      const updatedHeader = await PurchaseOrderService.updatePurchaseOrder(created.purchaseOrderId, {
        expectedDeliveryDate: form.expectedDeliveryDate,
        notes: form.notes,
        status: formStatus
      } as UpdatePurchaseOrderRequest)
      setOrders(prev => prev.map(o => o.purchaseOrderId === updatedHeader.purchaseOrderId ? updatedHeader : o))
      setShowForm(false)
      setForm({ supplierId: 0, warehouseId: 0, orderDate: new Date().toISOString().slice(0, 10) })
      setLines([{ itemId: '', quantity: '', unitPrice: '' }])
      setFormStatus('DRAFT')
    } catch (err: any) {
      setError(err.message || 'Failed to create purchase order')
    }
  }

  const saveEdits = async () => {
    try {
      const payloadItems = lines.filter(l => l.itemId && l.quantity && l.unitPrice).map(l => ({
        itemId: parseInt(l.itemId), quantity: parseInt(l.quantity), unitPrice: parseFloat(l.unitPrice)
      }))
      if (payloadItems.length === 0) { setError('Add at least one item'); return }
      if (!editingId) { setError('No purchase order selected'); return }
      const updatedHeader = await PurchaseOrderService.updatePurchaseOrder(editingId, {
        expectedDeliveryDate: form.expectedDeliveryDate,
        notes: form.notes,
        status: formStatus
      } as UpdatePurchaseOrderRequest)
      const updatedItems = await PurchaseOrderService.replaceItems(editingId, { items: payloadItems })
      const merged = { ...updatedHeader, totalAmount: updatedItems.totalAmount }
      setOrders(orders.map(o => o.purchaseOrderId === merged.purchaseOrderId ? merged : o))
      setSuccess('Purchase order updated')
      setShowForm(false)
      setEditingId(null)
    } catch (err: any) {
      setError(err.message || 'Failed to update purchase order')
    }
  }

  if (status === 'loading') { return <div className="p-6"><LoadingSpinner size="medium" text="Loading..." /></div> }
  if (!session) { return <div className="p-10 text-center">Please sign in to view purchase orders.</div> }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-down">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Purchase Orders</h1>
            <p className="mt-2 text-muted-foreground">Manage incoming orders from suppliers</p>
          </div>
          <button onClick={() => { setError(null); setShowForm(true) }} className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 transition-all">+ New Purchase Order</button>
        </div>

        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />}
        {error && <ErrorMessage message={error} onRetry={fetchAll} />}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-hover">
            <div className="text-sm font-semibold text-muted-foreground">Today</div>
            <div className="mt-2 text-3xl font-bold text-foreground">${todayTotal.toFixed(2)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Total value today</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-hover">
            <div className="text-sm font-semibold text-muted-foreground">This Month</div>
            <div className="mt-2 text-3xl font-bold text-foreground">${monthTotal.toFixed(2)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Total value this month</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-hover">
            <div className="text-sm font-semibold text-muted-foreground">This Year</div>
            <div className="mt-2 text-3xl font-bold text-foreground">${yearTotal.toFixed(2)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Total value this year</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-hover">
            <div className="text-sm font-semibold text-muted-foreground">Selected Range</div>
            <div className="mt-2 text-3xl font-bold text-foreground">${rangeTotal.toFixed(2)}</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">Start</label>
                <input type="date" value={rangeStart} onChange={e => setRangeStart(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-1" />
              </div>
              <div>
                <label className="block text-xs mb-1">End</label>
                <input type="date" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-1" />
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <form onSubmit={submit} className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
            <div>
              <label className="block text-sm font-medium mb-2">Supplier</label>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={form.supplierId} onChange={e => setForm({ ...form, supplierId: parseInt(e.target.value) })}>
                <option value={0}>Select supplier</option>
                {suppliers.map((s: any) => (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Branch</label>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={form.warehouseId} onChange={e => setForm({ ...form, warehouseId: parseInt(e.target.value) })}>
                <option value={0}>Select branch</option>
                {warehouses.map((w: any) => (<option key={w.warehouseId} value={w.warehouseId}>{w.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Order Date</label>
              <input type="date" className="w-full rounded-lg border border-border px-3 py-2" value={form.orderDate} onChange={e => setForm({ ...form, orderDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Expected Delivery</label>
              <input type="date" className="w-full rounded-lg border border-border px-3 py-2" value={form.expectedDeliveryDate || ''} onChange={e => setForm({ ...form, expectedDeliveryDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                {STATUSES.map(s => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Items</label>
              <div className="space-y-3">
                {lines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select value={line.itemId} onChange={e => setLines(lines.map((l, i) => i === idx ? { ...l, itemId: e.target.value } : l))} className="w-full rounded-lg border border-border px-3 py-2">
                      <option value="">Choose an item</option>
                      {items.map(it => (<option key={it.id} value={it.id}>{it.name} ({it.sku})</option>))}
                    </select>
                    <input type="number" min="1" value={line.quantity} onChange={e => setLines(lines.map((l, i) => i === idx ? { ...l, quantity: e.target.value } : l))} placeholder="Qty" className="w-full rounded-lg border border-border px-3 py-2" />
                    <input type="number" step="0.01" min="0.01" value={line.unitPrice} onChange={e => setLines(lines.map((l, i) => i === idx ? { ...l, unitPrice: e.target.value } : l))} placeholder="Unit Price" className="w-full rounded-lg border border-border px-3 py-2" />
                    <button type="button" onClick={() => setLines(lines.filter((_, i) => i !== idx))} className="rounded-lg border border-border px-3 py-2">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => setLines([...lines, { itemId: '', quantity: '', unitPrice: '' }])} className="rounded-lg border border-border px-3 py-2">+ Add Item</button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-border px-4 py-2">Cancel</button>
              {editingId ? (
                <button type="button" onClick={saveEdits} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Save</button>
              ) : (
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Create</button>
              )}
            </div>
          </form>
        )}

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">PO ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Supplier</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Branch</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Order Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No purchase orders found</td></tr>
                ) : filtered.map(o => (
                  <tr key={o.purchaseOrderId} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      <button
                        className="text-primary-foreground hover:underline"
                        onClick={async () => {
                          try {
                            const detail = await PurchaseOrderService.getPurchaseOrderDetail(o.purchaseOrderId)
                            setSuccess(null)
                            setError(null)
                            setShowForm(false)
                            setForm({ supplierId: detail.supplierId, warehouseId: detail.warehouseId, orderDate: detail.orderDate, expectedDeliveryDate: detail.expectedDeliveryDate, notes: detail.notes })
                            setLines(detail.items.map(it => ({ itemId: String(it.itemId), quantity: String(it.quantity), unitPrice: String(it.unitPrice) })))
                            // Open inline editor by reusing form with prefilled values
                            setEditingId(detail.purchaseOrderId)
                            setFormStatus(detail.status || 'DRAFT')
                            setShowForm(true)
                          } catch (err: any) {
                            setError(err.message || 'Failed to open purchase order')
                          }
                        }}
                      >
                        {o.purchaseOrderCode || `PO-${o.purchaseOrderId}`}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{o.supplierName || `#${o.supplierId}`}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{o.warehouseName || `#${o.warehouseId}`}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{o.status}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDateDMY(o.orderDate)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{o.totalAmount !== undefined ? `$${o.totalAmount?.toFixed?.(2) ?? o.totalAmount}` : '-'}</td>
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
