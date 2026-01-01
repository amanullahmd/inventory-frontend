'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import { TransferService, StockTransfer, CreateTransferRequest } from '@/lib/services/transferService'
import { ItemService } from '@/lib/services/itemService'
import { WarehouseService } from '@/lib/services/warehouseService'

export default function TransfersPage() {
  const { data: session, status } = useSession()
  const [transfers, setTransfers] = useState<StockTransfer[]>([])
  const [items, setItems] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateTransferRequest>({ itemId: 0, fromWarehouseId: 0, toWarehouseId: 0, quantity: 0, notes: '' })

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError(null)
      const [ts, is, ws] = await Promise.all([
        TransferService.getTransfers().catch(() => []),
        ItemService.getItems().catch(() => []),
        WarehouseService.getWarehouses().catch(() => []),
      ])
      setTransfers(ts as any)
      setItems(is as any)
      setWarehouses(ws as any)
    } catch (err: any) {
      setError(err.message || 'Failed to load transfers')
      setTransfers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (status === 'authenticated') fetchAll() }, [status])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.itemId || !form.fromWarehouseId || !form.toWarehouseId || !form.quantity) { setError('All required fields must be filled'); return }
    try {
      setError(null); setSuccess(null)
      const created = await TransferService.createTransfer(form)
      setTransfers([created, ...transfers])
      setSuccess('Transfer created')
      setShowForm(false)
      setForm({ itemId: 0, fromWarehouseId: 0, toWarehouseId: 0, quantity: 0, notes: '' })
    } catch (err: any) {
      setError(err.message || 'Failed to create transfer')
    }
  }

  if (status === 'loading') { return <div className="p-6"><LoadingSpinner size="medium" text="Loading..." /></div> }
  if (!session) { return <div className="p-10 text-center">Please sign in to view transfers.</div> }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Stock Transfers</h1>
            <p className="mt-2 text-base text-muted-foreground">Move stock between warehouses</p>
          </div>
          <button onClick={() => setShowForm(true)} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">+ New Transfer</button>
        </div>

        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />}
        {error && <ErrorMessage message={error} onRetry={fetchAll} />}

        {showForm && (
          <form onSubmit={submit} className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Item</label>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={form.itemId} onChange={e => setForm({ ...form, itemId: parseInt(e.target.value) })}>
                <option value={0}>Select item</option>
                {items.map((i: any) => (<option key={i.id} value={parseInt(i.id)}>{i.name} ({i.sku})</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">From Warehouse</label>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={form.fromWarehouseId} onChange={e => setForm({ ...form, fromWarehouseId: parseInt(e.target.value) })}>
                <option value={0}>Select warehouse</option>
                {warehouses.map((w: any) => (<option key={w.warehouseId} value={w.warehouseId}>{w.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Warehouse</label>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={form.toWarehouseId} onChange={e => setForm({ ...form, toWarehouseId: parseInt(e.target.value) })}>
                <option value={0}>Select warehouse</option>
                {warehouses.map((w: any) => (<option key={w.warehouseId} value={w.warehouseId}>{w.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input type="number" className="w-full rounded-lg border border-border px-3 py-2" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })} />
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Item</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">From</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">To</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Qty</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {transfers.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No transfers found</td></tr>
                ) : transfers.map(t => (
                  <tr key={t.transferId} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">#{t.itemId}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">#{t.fromWarehouseId}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">#{t.toWarehouseId}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{t.quantity}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{t.status}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</td>
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
