'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import { PurchaseOrderService, PurchaseOrder, CreatePurchaseOrderRequest } from '@/lib/services/purchaseOrderService'
import { SupplierService } from '@/lib/services/supplierService'
import { WarehouseService } from '@/lib/services/warehouseService'
import { formatDateDMY } from '@/lib/utils/date'

export default function PurchaseOrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreatePurchaseOrderRequest>({ supplierId: 0, warehouseId: 0, orderDate: new Date().toISOString().slice(0,10) })

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError(null)
      const [os, ss, ws] = await Promise.all([
        PurchaseOrderService.getPurchaseOrders().catch(() => []),
        SupplierService.getSuppliers().catch(() => []),
        WarehouseService.getWarehouses().catch(() => []),
      ])
      setOrders(os as any)
      setSuppliers(ss as any)
      setWarehouses(ws as any)
    } catch (err: any) {
      setError(err.message || 'Failed to load purchase orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (status === 'authenticated') fetchAll() }, [status])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.supplierId || !form.warehouseId || !form.orderDate) { setError('All required fields must be filled'); return }
    try {
      setError(null); setSuccess(null)
      const created = await PurchaseOrderService.createPurchaseOrder(form)
      setOrders([created, ...orders])
      setSuccess('Purchase order created')
      setShowForm(false)
      setForm({ supplierId: 0, warehouseId: 0, orderDate: new Date().toISOString().slice(0,10) })
    } catch (err: any) {
      setError(err.message || 'Failed to create purchase order')
    }
  }

  if (status === 'loading') { return <div className="p-6"><LoadingSpinner size="medium" text="Loading..." /></div> }
  if (!session) { return <div className="p-10 text-center">Please sign in to view purchase orders.</div> }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Purchase Orders</h1>
            <p className="mt-2 text-base text-muted-foreground">Manage incoming orders from suppliers</p>
          </div>
          <button onClick={() => setShowForm(true)} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">+ New Purchase Order</button>
        </div>

        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />}
        {error && <ErrorMessage message={error} onRetry={fetchAll} />}

        {showForm && (
          <form onSubmit={submit} className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Supplier</label>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={form.supplierId} onChange={e => setForm({ ...form, supplierId: parseInt(e.target.value) })}>
                <option value={0}>Select supplier</option>
                {suppliers.map((s: any) => (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Warehouse</label>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={form.warehouseId} onChange={e => setForm({ ...form, warehouseId: parseInt(e.target.value) })}>
                <option value={0}>Select warehouse</option>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-border px-4 py-2">Cancel</button>
              <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Create</button>
            </div>
          </form>
        )}

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Supplier</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Warehouse</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Order Date</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {orders.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No purchase orders found</td></tr>
                ) : orders.map(o => (
                  <tr key={o.purchaseOrderId} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">{o.supplierName || `#${o.supplierId}`}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{o.warehouseName || `#${o.warehouseId}`}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{o.status}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDateDMY(o.orderDate)}</td>
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
