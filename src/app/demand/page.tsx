'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import { DemandService, Demand, CreateDemandRequest, UpdateDemandRequest } from '@/lib/services/demandService'
import { ItemService } from '@/lib/services/itemService'
import { EmployeeService } from '@/lib/services/employeeService'

export default function DemandPage() {
  const { data: session, status } = useSession()
  const [demands, setDemands] = useState<Demand[]>([])
  const [items, setItems] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState<CreateDemandRequest>({ employeeId: undefined, unit: '', status: 'DRAFT', note: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [demandCode, setDemandCode] = useState<string>('')
  const STATUSES = ['DRAFT','APPROVED','RECEIVED','REJECTED']
  const [lines, setLines] = useState<Array<{ itemId: string; units: string }>>([{ itemId: '', units: '1' }])
  
  const fetchAll = async () => {
    try {
      setLoading(true)
      setError(null)
      const [ds, is, es] = await Promise.all([
        DemandService.getDemands().catch(() => []),
        ItemService.getItems().catch(() => []),
        EmployeeService.getEmployees().catch(() => []),
      ])
      setDemands(ds as any)
      setItems(is as any)
      setEmployees(es as any)
    } catch (err: any) {
      setError(err.message || 'Failed to load demands')
      setDemands([])
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => { if (status === 'authenticated') fetchAll() }, [status])
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payloadItems = lines.filter(l => l.itemId && l.units).map(l => ({ itemId: parseInt(l.itemId), units: parseInt(l.units) }))
    if (!form.employeeId || payloadItems.length === 0) { setError('Employee and at least one item are required'); return }
    try {
      setError(null); setSuccess(null)
      const created = await DemandService.createDemand({ ...form, items: payloadItems })
      setDemands([created, ...demands])
      setSuccess('Demand submitted')
      setForm({ employeeId: undefined, unit: '', status: 'DRAFT', note: '' })
      setLines([{ itemId: '', units: '1' }])
    } catch (err: any) {
      setError(err.message || 'Failed to submit demand')
    }
  }
  
  if (status === 'loading') { return <div className="p-6"><LoadingSpinner size="medium" text="Loading..." /></div> }
  if (!session) { return <div className="p-10 text-center">Please sign in to view demands.</div> }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-down">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Demand</h1>
            <p className="mt-2 text-muted-foreground">Staff demand form and recent requests</p>
          </div>
        </div>
        
        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />}
        {error && <ErrorMessage message={error} onRetry={fetchAll} />}
        
        <form onSubmit={submit} className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
          {editingId && (
            <div>
              <label className="block text-sm font-medium mb-2">Demand ID</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={demandCode} onChange={e => setDemandCode(e.target.value)} />
            </div>
          )}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Employee</label>
            <select className="w-full rounded-lg border border-border px-3 py-2" value={form.employeeId || ''} onChange={e => setForm({ ...form, employeeId: e.target.value ? parseInt(e.target.value) : undefined })}>
              <option value="">Select employee</option>
              {employees.map((emp: any) => (<option key={emp.employeeId} value={emp.employeeId}>{emp.employeeCode} - {emp.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select className="w-full rounded-lg border border-border px-3 py-2" value={form.status || 'DRAFT'} onChange={e => setForm({ ...form, status: e.target.value as any })}>
              {STATUSES.map(s => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Items</label>
            <div className="space-y-3">
              {lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select value={line.itemId} onChange={e => setLines(lines.map((l,i)=> i===idx?{...l,itemId:e.target.value}:l))} className="w-full rounded-lg border border-border px-3 py-2">
                    <option value="">Choose an item</option>
                    {items.map(it => (<option key={it.id} value={it.id}>{it.name} ({it.sku})</option>))}
                  </select>
                  <input type="number" min="1" value={line.units} onChange={e => setLines(lines.map((l,i)=> i===idx?{...l,units:e.target.value}:l))} placeholder="Unit" className="w-full rounded-lg border border-border px-3 py-2" />
                  <button type="button" onClick={() => setLines(lines.filter((_,i)=>i!==idx))} className="rounded-lg border border-border px-3 py-2">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => setLines([...lines, { itemId: '', units: '1' }])} className="rounded-lg border border-border px-3 py-2">+ Add Item</button>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Note</label>
            <input className="w-full rounded-lg border border-border px-3 py-2" value={form.note || ''} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Reason or additional info" />
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end">
            {editingId ? (
              <>
                <button type="button" onClick={async () => {
                  try {
                    const payloadItems = lines.filter(l => l.itemId && l.units).map(l => ({ itemId: parseInt(l.itemId), units: parseInt(l.units) }))
                    const updated = await DemandService.updateDemand(editingId!, {
                      demandCode,
                      employeeId: form.employeeId,
                      status: form.status,
                      note: form.note,
                      items: payloadItems,
                    } as UpdateDemandRequest)
                    setDemands(demands.map(d => d.demandId === updated.demandId ? updated : d))
                    setSuccess('Demand updated')
                    setEditingId(null); setDemandCode(''); setForm({ employeeId: undefined, itemId: 0, unit: '', status: 'DRAFT', note: '' }); setLines([{ itemId: '', units: '1' }])
                  } catch (err: any) {
                    setError(err.message || 'Failed to update demand')
                  }
                }} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Save</button>
                <button type="button" onClick={async () => {
                  try {
                    await DemandService.deleteDemand(editingId!)
                    setDemands(demands.filter(d => d.demandId !== editingId))
                    setSuccess('Demand deleted')
                    setEditingId(null); setDemandCode(''); setForm({ employeeId: undefined, unit: '', status: 'DRAFT', note: '' })
                  } catch (err: any) {
                    setError(err.message || 'Failed to delete demand')
                  }
                }} className="rounded-lg border border-border px-4 py-2">Delete</button>
                <button type="button" onClick={() => { setEditingId(null); setDemandCode(''); setForm({ employeeId: undefined, unit: '', status: 'DRAFT', note: '' }) }} className="rounded-lg border border-border px-4 py-2">Cancel</button>
              </>
            ) : (
              <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Submit Demand</button>
            )}
          </div>
        </form>
        
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Demand ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Employee</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Note</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Item</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Unit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Added By</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Updated</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {demands.length === 0 ? (
                  <tr><td colSpan={11} className="px-6 py-8 text-center text-muted-foreground">No demands found</td></tr>
                ) : demands.map(d => (
                  <tr key={d.demandId} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      <button className="text-primary hover:underline" onClick={async () => {
                        try {
                          const detail = await DemandService.getDemand(d.demandId)
                          setError(null); setSuccess(null)
                          setEditingId(detail.demandId)
                          setDemandCode(detail.demandCode || `DM-${detail.demandId}`)
                          setForm({ employeeId: detail.employeeId, unit: '', status: detail.status || 'DRAFT', note: detail.note || '' })
                          const mapped = (detail.items || []).map((it:any)=> ({ itemId: String(it.itemId), units: String(it.units) }))
                          setLines(mapped.length > 0 ? mapped : [{ itemId: String(detail.itemId || ''), units: '1' }])
                        } catch (err: any) {
                          setError(err.message || 'Failed to open demand')
                        }
                      }}>
                        {d.demandCode || `DM-${d.demandId}`}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{d.employeeCode ? `${d.employeeCode} - ${d.demanderName}` : d.demanderName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{d.status || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{d.note || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {d.items && d.items.length > 0 ? `${d.items[0].name} (${d.items[0].sku})${d.items.length > 1 ? ` +${d.items.length-1} more` : ''}` : `${d.itemName} (${d.sku})`}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{d.items && d.items.length > 0 ? d.items[0].units : '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{d.requestedByName || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(d.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{d.updatedAt ? new Date(d.updatedAt).toLocaleString() : '-'}</td>
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
