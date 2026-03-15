'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import { DemandService, Demand, CreateDemandRequest } from '@/lib/services/demandService'
import { ItemService } from '@/lib/services/itemService'
import { formatDateDMY, formatDateTime } from '@/lib/utils/date'
import { usePermissions } from '@/hooks/usePermissions'
import { DemandStatus } from '@/lib/services/demandService'
import { Check, X, AlertCircle, Clock, Trash2, Download, AlertTriangle, ShieldAlert, PackageCheck } from 'lucide-react'
import { PDFExportService } from '@/lib/services/pdfExportService'

// Example demo user to show in the demand list
const DEMO_USER_DEMAND: Demand = {
  demandId: 9999901,
  demandCode: 'DEM-DEMO-001',
  status: 'PENDING_DIVISION_ADMIN',
  note: 'Monthly office supply requisition',
  requestedByName: 'আব্দুল করিম (Abdul Karim)',
  requestedByRole: 'DIVISION_USER',
  itemId: 0,
  itemName: 'A4 Paper',
  sku: 'PAPER-A4-500',
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  items: [{ demandItemId: 1, itemId: 1, sku: 'PAPER-A4-500', name: 'A4 Paper (500 Sheets)', units: 10 }],
}

// Demo: Already approved/received demand to show budget tracking
const DEMO_APPROVED_DEMAND: Demand = {
  demandId: 9999902,
  demandCode: 'DEM-2026-001',
  status: 'APPROVED',
  note: 'আলমিরা (স্টিল/কাঠ) - বাজেট থেকে নেওয়া হয়েছে',
  requestedByName: 'আব্দুল করিম (Abdul Karim)',
  requestedByRole: 'DIVISION_USER',
  approvedBy: 'Division Admin',
  approvedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  itemId: 0,
  itemName: 'HP Laser Jet Pro M426dw Printer',
  sku: 'HP-M426DW',
  createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  items: [{ demandItemId: 2, itemId: 1, sku: 'HP-M426DW', name: 'HP Laser Jet Pro M426dw Printer', units: 10 }],
}

export default function DemandPage() {
  const { data: session, status } = useSession()
  const { userRole } = usePermissions()
  const [demands, setDemands] = useState<Demand[]>([])
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState<CreateDemandRequest>({ unit: '', status: 'PENDING_DIVISION_ADMIN', note: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [demandCode, setDemandCode] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [rejectionModal, setRejectionModal] = useState<{ id: number; reason: string } | null>(null)
  const [budgetWarning, setBudgetWarning] = useState<string | null>(null)

  const [lines, setLines] = useState<Array<{ itemId: string; units: string }>>([{ itemId: '', units: '1' }])

  // Calculate how many units of each item have been demanded this month
  const getMonthlyDemandedUnits = (itemId: number): number => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    return demands
      .filter(d => {
        const created = new Date(d.createdAt)
        return created.getMonth() === thisMonth && created.getFullYear() === thisYear
      })
      .reduce((sum, d) => {
        const itemLines = (d.items || []).filter(it => it.itemId === itemId)
        return sum + itemLines.reduce((s, it) => s + it.units, 0)
      }, 0)
  }

  // Check if an item has already been approved/received for a specific user
  const getApprovedItemsForUser = (userName?: string): Map<number, { units: number; demandCode: string; approvedAt: string }> => {
    const approvedMap = new Map<number, { units: number; demandCode: string; approvedAt: string }>()

    demands
      .filter(d => {
        if (d.status !== 'APPROVED') return false
        // If userName provided, match the requester
        if (userName && d.requestedByName && d.requestedByName !== userName) return false
        return true
      })
      .forEach(d => {
        (d.items || []).forEach(it => {
          const existing = approvedMap.get(it.itemId)
          approvedMap.set(it.itemId, {
            units: (existing?.units || 0) + it.units,
            demandCode: d.demandCode || `DM-${d.demandId}`,
            approvedAt: d.approvedAt || d.createdAt,
          })
        })
        // Also handle single-item demands
        if ((!d.items || d.items.length === 0) && d.itemId) {
          const existing = approvedMap.get(d.itemId)
          approvedMap.set(d.itemId, {
            units: (existing?.units || 0) + parseInt(d.unit || '1'),
            demandCode: d.demandCode || `DM-${d.demandId}`,
            approvedAt: d.approvedAt || d.createdAt,
          })
        }
      })
    return approvedMap
  }

  // Check if item is already received by any user (for Division Admin view)
  const isItemAlreadyReceived = (itemId: number, requestedByName?: string): { received: boolean; info?: { units: number; demandCode: string; approvedAt: string } } => {
    const approvedItems = getApprovedItemsForUser(requestedByName)
    const info = approvedItems.get(itemId)
    if (info) return { received: true, info }
    return { received: false }
  }

  const checkBudget = (newLines: Array<{ itemId: string; units: string }>) => {
    for (const line of newLines) {
      if (!line.itemId || !line.units) continue
      const item = items.find((it: any) => it.id === line.itemId)
      if (!item) continue

      // Check if item already received/approved
      const received = isItemAlreadyReceived(parseInt(line.itemId))
      if (received.received) {
        const maxStock = item.maximumStock || item.maximumDemand
        if (maxStock && received.info && received.info.units >= maxStock) {
          setBudgetWarning(`"${item.name}" ইতিমধ্যে বাজেট থেকে নেওয়া হয়েছে (${received.info.units} টি পূর্বে অনুমোদিত, সীমা: ${maxStock})। পুনরায় চাহিদা দেওয়া যাবে না।`)
          return false
        }
      }

      const maxStock = item.maximumStock || item.maximumDemand
      if (!maxStock) continue
      const alreadyDemanded = getMonthlyDemandedUnits(parseInt(line.itemId))
      const newTotal = alreadyDemanded + parseInt(line.units || '0')
      if (newTotal > maxStock) {
        setBudgetWarning(`"${item.name}": monthly limit is ${maxStock} units. Already demanded: ${alreadyDemanded}. Requesting ${line.units} would exceed the budget.`)
        return false
      }
    }
    setBudgetWarning(null)
    return true
  }

  const getItemLabel = (itemId: number, name?: string, sku?: string) => {
    if (name && sku) return `${name} (${sku})`
    const item = items.find(it => it.id === String(itemId))
    if (item) return `${item.name} (${item.sku})`
    return name || sku || `Item #${itemId}`
  }

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError(null)
      const [ds, is] = await Promise.all([
        DemandService.getDemands().catch(() => []),
        ItemService.getItems().catch(() => []),
      ])
      // Merge demo user demand if not already present
      const allDemands = ds as Demand[]
      if (!allDemands.find(d => d.demandId === DEMO_USER_DEMAND.demandId)) {
        allDemands.unshift(DEMO_USER_DEMAND)
      }
      if (!allDemands.find(d => d.demandId === DEMO_APPROVED_DEMAND.demandId)) {
        allDemands.unshift(DEMO_APPROVED_DEMAND)
      }
      setDemands(allDemands)
      setItems(is as any)
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
    if (payloadItems.length === 0) { setError('At least one item is required'); return }
    // Check if any selected item has already been fully received from budget
    for (const pi of payloadItems) {
      const received = isItemAlreadyReceived(pi.itemId)
      const item = items.find((it: any) => parseInt(it.id) === pi.itemId)
      const maxStock = item?.maximumStock || item?.maximumDemand
      if (received.received && maxStock && received.info && received.info.units >= maxStock) {
        setError(`"${item?.name || 'Item'}" ইতিমধ্যে বাজেট থেকে নেওয়া হয়েছে। পুনরায় চাহিদা দেওয়া যাবে না।`)
        return
      }
    }
    if (!checkBudget(lines)) return
    try {
      setError(null); setSuccess(null); setBudgetWarning(null)
      const created = await DemandService.createDemand({
        ...form,
        items: payloadItems,
        requestedByName: session?.user?.name || undefined,
        requestedByRole: userRole
      } as CreateDemandRequest)
      setDemands([created, ...demands])
      setSuccess('Demand submitted successfully')
      setForm({ unit: '', status: 'PENDING_DIVISION_ADMIN', note: '' })
      setLines([{ itemId: '', units: '1' }])
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || 'Failed to submit demand')
    }
  }

  const handleAction = async (id: number, action: 'APPROVE' | 'REJECT', reason?: string) => {
    try {
      const demand = demands.find(d => d.demandId === id)
      if (!demand) return

      let nextStatus: DemandStatus = demand.status || 'PENDING_DIVISION_ADMIN'

      if (action === 'APPROVE') {
        if (userRole === 'DIVISION_ADMIN') nextStatus = 'PENDING_CENTRAL_MANAGER'
        else if (userRole === 'CENTRAL' || userRole === 'ADMIN') nextStatus = 'APPROVED'
      } else {
        nextStatus = 'REJECTED'
      }

      const updated = await DemandService.updateDemand(id, {
        status: nextStatus,
        rejectionReason: reason,
        approvedAt: action === 'APPROVE' && nextStatus === 'APPROVED' ? new Date().toISOString() : undefined,
        approvedBy: action === 'APPROVE' ? session?.user?.name || undefined : undefined
      })

      setDemands(demands.map(d => d.demandId === id ? updated : d))
      setSuccess(`Demand ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`)
      setRejectionModal(null)
    } catch (err: any) {
      setError(err.message || 'Failed to update demand status')
    }
  }

  const handleDownloadPDF = async (demand: Demand) => {
    try {
      setLoading(true)
      await PDFExportService.generateDemandPDF(demand, {
        filename: `demand-${demand.demandCode || demand.demandId}.pdf`,
        title: 'Demand Requisition Form',
        timestamp: new Date()
      })
      setSuccess('PDF generated successfully')
    } catch (err: any) {
      setError('Failed to generate PDF')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const canEdit = (demand: Demand) => {
    if (userRole === 'ADMIN' || userRole === 'CENTRAL') return true
    if (demand.status === 'APPROVED' || demand.status === 'REJECTED') return false
    if (userRole === 'DIVISION_ADMIN' && demand.status === 'PENDING_DIVISION_ADMIN') return true
    if (userRole === 'DIVISION_USER' && demand.status === 'PENDING_DIVISION_ADMIN') return true
    return false
  }

  const getStatusBadge = (status?: DemandStatus) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'REJECTED': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
      case 'PENDING_DIVISION_ADMIN': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'PENDING_CENTRAL_MANAGER': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  if (status === 'loading' || loading) { return <div className="p-6"><LoadingSpinner size="medium" text="Loading..." /></div> }
  if (!session) { return <div className="p-10 text-center">Please sign in to view demands.</div> }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-down">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Demand</h1>
            <p className="mt-2 text-muted-foreground">Staff demand requests and tracking</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setForm({ unit: '', status: 'PENDING_DIVISION_ADMIN', note: '' })
              setLines([{ itemId: '', units: '1' }])
              setError(null)
              setSuccess(null)
              setShowForm(true)
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Demand
          </button>
        </div>

        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />}
        {error && <ErrorMessage message={error} onRetry={fetchAll} />}
        {budgetWarning && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span className="text-sm">{budgetWarning}</span>
            <button onClick={() => setBudgetWarning(null)} className="ml-auto"><X size={14} /></button>
          </div>
        )}

        {rejectionModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setRejectionModal(null)} />
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold mb-4">Reason for Rejection</h3>
              <textarea
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground mb-4"
                rows={4}
                placeholder="Please provide a reason..."
                value={rejectionModal.reason}
                onChange={e => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRejectionModal(null)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(rejectionModal.id, 'REJECT', rejectionModal.reason)}
                  className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold"
                  disabled={!rejectionModal.reason.trim()}
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-lg animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">{editingId ? 'Edit Demand' : 'Create Demand'}</h2>
                <button onClick={() => setShowForm(false)} className="rounded-full p-2 hover:bg-muted transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editingId && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-foreground">Demand ID</label>
                    <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground" value={demandCode} readOnly disabled />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-foreground">Items</label>
                  <div className="space-y-3">
                    {lines.map((line, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                          <select value={line.itemId} onChange={e => {
                            const selectedItemId = parseInt(e.target.value)
                            const received = isItemAlreadyReceived(selectedItemId)
                            const selectedItem = items.find((it: any) => it.id === e.target.value)
                            const maxStock = selectedItem?.maximumStock || selectedItem?.maximumDemand
                            if (received.received && maxStock && received.info && received.info.units >= maxStock) {
                              setBudgetWarning(`"${selectedItem.name}" ইতিমধ্যে বাজেট থেকে নেওয়া হয়েছে (${received.info.units} টি পূর্বে অনুমোদিত, সীমা: ${maxStock})। পুনরায় চাহিদা দেওয়া যাবে না।`)
                              return
                            }
                            const updated = lines.map((l, i) => i === idx ? { ...l, itemId: e.target.value } : l)
                            setLines(updated)
                            checkBudget(updated)
                          }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground">
                            <option value="">Choose an item</option>
                            {items.map((it: any) => {
                              const maxStock = it.maximumStock || it.maximumDemand
                              const alreadyDemanded = getMonthlyDemandedUnits(parseInt(it.id))
                              const remaining = maxStock ? maxStock - alreadyDemanded : null
                              const received = isItemAlreadyReceived(parseInt(it.id))
                              const budgetFull = received.received && maxStock && received.info && received.info.units >= maxStock
                              return (
                                <option key={it.id} value={it.id} disabled={(remaining !== null && remaining <= 0) || !!budgetFull}>
                                  {it.name} ({it.sku}){budgetFull ? ` — ⛔ ইতিমধ্যে নেওয়া হয়েছে (${received.info!.units} টি)` : remaining !== null ? ` — ${remaining > 0 ? remaining + ' remaining' : 'BUDGET EXCEEDED'}` : ''}
                                </option>
                              )
                            })}
                          </select>
                          <input type="number" min="1" value={line.units} onChange={e => {
                            const updated = lines.map((l, i) => i === idx ? { ...l, units: e.target.value } : l)
                            setLines(updated)
                            checkBudget(updated)
                          }} placeholder="Units" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground" />
                        </div>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                            className="rounded-lg p-2 text-destructive hover:bg-destructive/10 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                        {idx === 0 && <div className="w-9" />}
                      </div>
                    ))}
                    <button type="button" onClick={() => setLines([...lines, { itemId: '', units: '1' }])} className="text-sm font-medium text-primary hover:underline">+ Add Item</button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-foreground">Note</label>
                  <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground" rows={3} value={form.note || ''} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Reason or additional info" />
                </div>
                {budgetWarning && (
                  <div className="md:col-span-2 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <span className="text-xs">{budgetWarning}</span>
                  </div>
                )}
                <div className="md:col-span-2 flex gap-3 justify-end mt-4">
                  {editingId ? (
                    <>
                      <button type="button" onClick={async () => {
                        try {
                          const payloadItems = lines.filter(l => l.itemId && l.units).map(l => ({ itemId: parseInt(l.itemId), units: parseInt(l.units) }))
                          const updated = await DemandService.updateDemand(editingId!, {
                            note: form.note,
                            items: payloadItems,
                          })
                          setDemands(demands.map(d => d.demandId === updated.demandId ? updated : d))
                          setSuccess('Demand updated')
                          setEditingId(null); setDemandCode(''); setForm({ unit: '', status: 'PENDING_DIVISION_ADMIN', note: '' }); setLines([{ itemId: '', units: '1' }])
                          setShowForm(false)
                        } catch (err: any) {
                          setError(err.message || 'Failed to update demand')
                        }
                      }} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold shadow-sm hover:opacity-90 transition-all">Save Changes</button>
                      <button type="button" onClick={async () => {
                        if (!confirm('Are you sure you want to delete this demand?')) return
                        try {
                          await DemandService.deleteDemand(editingId!)
                          setDemands(demands.filter(d => d.demandId !== editingId))
                          setSuccess('Demand deleted')
                          setEditingId(null); setDemandCode(''); setForm({ unit: '', status: 'PENDING_DIVISION_ADMIN', note: '' })
                          setShowForm(false)
                        } catch (err: any) {
                          setError(err.message || 'Failed to delete demand')
                        }
                      }} className="rounded-lg border border-destructive/30 text-destructive px-4 py-2 hover:bg-destructive/5 transition-colors">Delete</button>
                    </>
                  ) : (
                    <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold shadow-sm hover:opacity-90 transition-all">Submit Demand</button>
                  )}
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-border px-4 py-2 text-foreground hover:bg-muted transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Demand ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Note</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Item</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Unit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Budget Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Added By</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Approved By</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Approve Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {demands.length === 0 ? (
                  <tr><td colSpan={11} className="px-6 py-8 text-center text-muted-foreground">No demands found</td></tr>
                ) : demands.map(d => (
                  <tr key={d.demandId} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      <button
                        className={`font-bold hover:underline transition-colors ${!canEdit(d) ? 'text-foreground/60 cursor-not-allowed' : 'text-foreground'}`}
                        disabled={!canEdit(d)}
                        onClick={async () => {
                          try {
                            const detail = await DemandService.getDemand(d.demandId)
                            setError(null); setSuccess(null)
                            setEditingId(detail.demandId)
                            setDemandCode(detail.demandCode || `DM-${detail.demandId}`)
                            setForm({ unit: '', status: detail.status || 'PENDING_DIVISION_ADMIN', note: detail.note || '' })
                            const mapped = (detail.items || []).map((it: any) => ({ itemId: String(it.itemId), units: String(it.units) }))
                            setLines(mapped.length > 0 ? mapped : [{ itemId: String(detail.itemId || ''), units: '1' }])
                            setShowForm(true)
                          } catch (err: any) {
                            setError(err.message || 'Failed to open demand')
                          }
                        }}
                      >
                        {d.demandCode || `DM-${d.demandId}`}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusBadge(d.status)}`}>
                          {d.status?.replace(/_/g, ' ') || 'PENDING'}
                        </span>
                        {d.rejectionReason && (
                          <span className="text-[10px] text-rose-500 italic flex items-center gap-1">
                            <AlertCircle size={10} /> {d.rejectionReason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{d.note || '-'}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {d.items && d.items.length > 0
                            ? `${getItemLabel(d.items[0].itemId, d.items[0].name, d.items[0].sku)}${d.items.length > 1 ? ` +${d.items.length - 1} more` : ''}`
                            : getItemLabel(d.itemId, d.itemName, d.sku)}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDateDMY(d.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">{d.items && d.items.length > 0 ? d.items[0].units : (d.unit || '-')}</td>
                    <td className="px-6 py-4 text-sm">
                      {(() => {
                        const itemId = d.items && d.items.length > 0 ? d.items[0].itemId : d.itemId
                        const received = isItemAlreadyReceived(itemId, d.requestedByName)
                        const item = items.find((it: any) => parseInt(it.id) === itemId || it.itemId === itemId)
                        const maxStock = item?.maximumStock || item?.maximumDemand
                        if (d.status === 'APPROVED' && received.received) {
                          return (
                            <div className="flex flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <PackageCheck size={12} /> নেওয়া হয়েছে
                              </span>
                              <span className="text-[10px] text-muted-foreground">{received.info!.units}/{maxStock || '∞'} টি ব্যবহৃত</span>
                            </div>
                          )
                        }
                        if (received.received && maxStock && received.info && received.info.units >= maxStock) {
                          return (
                            <div className="flex flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                                <ShieldAlert size={12} /> বাজেট শেষ
                              </span>
                              <span className="text-[10px] text-muted-foreground">পুনরায় চাহিদা দেওয়া যাবে না</span>
                            </div>
                          )
                        }
                        if (received.received) {
                          return (
                            <div className="flex flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                <AlertTriangle size={12} /> আংশিক ব্যবহৃত
                              </span>
                              <span className="text-[10px] text-muted-foreground">{received.info!.units}/{maxStock || '∞'} টি নেওয়া হয়েছে</span>
                            </div>
                          )
                        }
                        return <span className="text-muted-foreground text-xs">—</span>
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {d.requestedByName ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{d.requestedByName}</span>
                          <span className="text-[10px] uppercase font-bold text-primary/70">{d.requestedByRole?.replace(/_/g, ' ') || 'User'}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {d.approvedBy ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{d.approvedBy}</span>
                          <span className="text-[10px] uppercase font-bold text-emerald-600/70 dark:text-emerald-400/70">APPROVER</span>
                        </div>
                      ) : (d.status === 'APPROVED' ? <span className="font-medium">Admin</span> : '-')}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{formatDateDMY(d.createdAt)}</span>
                        <span className="text-[10px] text-muted-foreground">{formatDateTime(d.createdAt).split(' ')[1]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {d.approvedAt ? (
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <Clock size={12} /> {formatDateDMY(d.approvedAt)}
                          </span>
                          <span className="text-[10px] italic">By {d.approvedBy || 'Admin'}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {((userRole === 'DIVISION_ADMIN' && d.status === 'PENDING_DIVISION_ADMIN') ||
                          ((userRole === 'CENTRAL' || userRole === 'ADMIN') && d.status === 'PENDING_CENTRAL_MANAGER')) && (
                            <>
                              <button
                                onClick={() => handleAction(d.demandId, 'APPROVE')}
                                className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 transition-colors"
                                title="Approve"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => setRejectionModal({ id: d.demandId, reason: '' })}
                                className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300 transition-colors"
                                title="Reject"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                        {canEdit(d) && (
                          <button
                            onClick={() => {
                              setEditingId(d.demandId)
                              setDemandCode(d.demandCode || `DM-${d.demandId}`)
                              setForm({ unit: '', status: d.status || 'PENDING_DIVISION_ADMIN', note: d.note || '' })
                              const mapped = (d.items || []).map((it: any) => ({ itemId: String(it.itemId), units: String(it.units) }))
                              setLines(mapped.length > 0 ? mapped : [{ itemId: String(d.itemId || ''), units: '1' }])
                              setShowForm(true)
                            }}
                            className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 transition-colors"
                            title="Edit"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadPDF(d)}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 transition-colors"
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
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
