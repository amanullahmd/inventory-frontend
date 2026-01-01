'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import { WarehouseService, Warehouse, CreateWarehouseRequest } from '@/lib/services/warehouseService'

export default function WarehousesPage() {
  const { data: session, status } = useSession()
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateWarehouseRequest>({ name: '', address: '', capacityUnits: undefined })

  const fetchWarehouses = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await WarehouseService.getWarehouses()
      setWarehouses(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load warehouses')
      setWarehouses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') fetchWarehouses()
  }, [status])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    try {
      setError(null); setSuccess(null)
      const created = await WarehouseService.createWarehouse(form)
      setWarehouses([created, ...warehouses])
      setSuccess('Warehouse created')
      setShowForm(false)
      setForm({ name: '', address: '', capacityUnits: undefined })
    } catch (err: any) {
      setError(err.message || 'Failed to create warehouse')
    }
  }

  if (status === 'loading') {
    return <div className="p-6"><LoadingSpinner size="medium" text="Loading..." /></div>
  }
  if (!session) {
    return <div className="p-10 text-center">Please sign in to view warehouses.</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Warehouses</h1>
            <p className="mt-2 text-base text-muted-foreground">Manage warehouse master data</p>
          </div>
          <button onClick={() => setShowForm(true)} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">+ New Warehouse</button>
        </div>

        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />}
        {error && <ErrorMessage message={error} onRetry={fetchWarehouses} />}

        {showForm && (
          <form onSubmit={submit} className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Capacity Units</label>
              <input type="number" className="w-full rounded-lg border border-border px-3 py-2" value={form.capacityUnits ?? ''} onChange={e => setForm({ ...form, capacityUnits: e.target.value ? parseInt(e.target.value) : undefined })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Address</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Capacity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Active</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {warehouses.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No warehouses found</td></tr>
                ) : warehouses.map(w => (
                  <tr key={w.warehouseId} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">{w.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{w.capacityUnits ?? '—'}</td>
                    <td className="px-6 py-4 text-sm">{w.isActive ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(w.createdAt).toLocaleDateString()}</td>
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
