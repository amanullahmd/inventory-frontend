'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import { SalesOrderService, SalesOrder, CreateSalesOrderRequest } from '@/lib/services/salesOrderService'
import { WarehouseService } from '@/lib/services/warehouseService'

export default function SalesOrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<SalesOrder[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateSalesOrderRequest>({ warehouseId: 0, orderDate: new Date().toISOString().slice(0,10) })

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError(null)
      const [os, ws] = await Promise.all([
        SalesOrderService.getSalesOrders().catch(() => []),
        WarehouseService.getWarehouses().catch(() => []),
      ])
      setOrders(os as any)
      setWarehouses(ws as any)
    } catch (err: any) {
      setError(err.message || 'Failed to load sales orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (status === 'authenticated') fetchAll() }, [status])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.warehouseId || !form.orderDate) { setError('All required fields must be filled'); return }
    try {
      setError(null); setSuccess(null)
      const created = await SalesOrderService.createSalesOrder(form)
      setOrders([created, ...orders])
      setSuccess('Sales order created')
      setShowForm(false)
      setForm({ warehouseId: 0, orderDate: new Date().toISOString().slice(0,10) })
    } catch (err: any) {
      setError(err.message || 'Failed to create sales order')
    }
  }

  if (status === 'loading') { return <div className="p-6"><LoadingSpinner size="medium" text="Loading..." /></div> }
  if (!session) { return <div className="p-10 text-center">Please sign in to view sales orders.</div> }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Sales Orders</h1>
            <p className="mt-2 text-base text-muted-foreground">Manage outgoing orders to customers</p>
          </div>
          <button onClick={() => setShowForm(true)} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">+ New Sales Order</button>
        </div>

        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />}
        {error && <ErrorMessage message={error} onRetry={fetchAll} />}

        {showForm && (
          <form onSubmit={submit} className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-2">Customer Name</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.customerName || ''} onChange={e => setForm({ ...form, customerName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Customer Email</label>
              <input type="email" className="w-full rounded-lg border border-border px-3 py-2" value={form.customerEmail || ''} onChange={e => setForm({ ...form, customerEmail: e.target.value })} />
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Warehouse</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Order Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Customer</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {orders.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No sales orders found</td></tr>
                ) : orders.map(o => (
                  <tr key={o.salesOrderId} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">#{o.warehouseId}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{o.status}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(o.orderDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{o.customerName || '—'}</td>
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
