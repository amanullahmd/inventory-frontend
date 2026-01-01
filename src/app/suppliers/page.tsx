'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import { SupplierService, Supplier, CreateSupplierRequest } from '@/lib/services/supplierService'

export default function SuppliersPage() {
  const { data: session, status } = useSession()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateSupplierRequest>({ name: '', email: '', phone: '', address: '', contactPerson: '' })

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await SupplierService.getSuppliers()
      setSuppliers(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load suppliers')
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') fetchSuppliers()
  }, [status])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    try {
      setError(null); setSuccess(null)
      const created = await SupplierService.createSupplier(form)
      setSuppliers([created, ...suppliers])
      setSuccess('Supplier created')
      setShowForm(false)
      setForm({ name: '', email: '', phone: '', address: '', contactPerson: '' })
    } catch (err: any) {
      setError(err.message || 'Failed to create supplier')
    }
  }

  if (status === 'loading') {
    return <div className="p-6"><LoadingSpinner size="medium" text="Loading..." /></div>
  }
  if (!session) {
    return <div className="p-10 text-center">Please sign in to view suppliers.</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Suppliers</h1>
            <p className="mt-2 text-base text-muted-foreground">Manage supplier master data</p>
          </div>
          <button onClick={() => setShowForm(true)} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">+ New Supplier</button>
        </div>

        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />}
        {error && <ErrorMessage message={error} onRetry={fetchSuppliers} />}

        {showForm && (
          <form onSubmit={submit} className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Person</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full rounded-lg border border-border px-3 py-2" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Active</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {suppliers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No suppliers found</td></tr>
                ) : suppliers.map(s => (
                  <tr key={s.supplierId} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">{s.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.contactPerson || '—'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.email || '—'}</td>
                    <td className="px-6 py-4 text-sm">{s.isActive ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</td>
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
