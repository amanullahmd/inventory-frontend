'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import React from 'react'
import {
  FileText, Plus, X, Check, Edit3, Trash2, Calendar, ChevronDown, ChevronUp,
  ClipboardCheck, AlertCircle
} from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { usePermissions } from '@/hooks/usePermissions'
import {
  RequisitionService,
  Requisition,
  RequisitionStatus,
  RequisitionItem,
} from '@/lib/services/requisitionService'
import { formatDateDMY } from '@/lib/utils/date'

const STATUS_LABELS: Record<RequisitionStatus, string> = {
  DRAFT: 'খসড়া',
  SUBMITTED: 'জমা দেওয়া হয়েছে',
  APPROVED: 'অনুমোদিত',
  PARTIALLY_FULFILLED: 'আংশিক পূরণ',
  FULFILLED: 'সম্পূর্ণ পূরণ',
  REJECTED: 'প্রত্যাখ্যাত',
}

const STATUS_COLORS: Record<RequisitionStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  SUBMITTED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  APPROVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  PARTIALLY_FULFILLED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  FULFILLED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

const FISCAL_YEARS = ['2025-2026', '2024-2025', '2023-2024']

interface ItemLine {
  itemName: string
  sku: string
  requestedQuantity: string
  unitPrice: string
}

const emptyLine = (): ItemLine => ({ itemName: '', sku: '', requestedQuantity: '1', unitPrice: '' })

export default function RequisitionsPage() {
  const { data: session, status } = useSession()
  const { userRole } = usePermissions()
  const [requisitions, setRequisitions] = useState<Requisition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [rejectionModal, setRejectionModal] = useState<{ id: number; reason: string } | null>(null)

  const [form, setForm] = useState({
    department: '',
    requestedBy: '',
    requestedByDesignation: '',
    purpose: '',
    fiscalYear: '2025-2026',
    budgetHead: '',
    note: '',
    status: 'DRAFT' as RequisitionStatus,
  })
  const [lines, setLines] = useState<ItemLine[]>([emptyLine()])

  useEffect(() => {
    if (status === 'authenticated') {
      try {
        setRequisitions(RequisitionService.getRequisitions())
      } catch {
        setError('চাহিদাপত্র লোড করতে ব্যর্থ হয়েছে')
      } finally {
        setLoading(false)
      }
    }
  }, [status])

  const resetForm = () => {
    setForm({ department: '', requestedBy: '', requestedByDesignation: '', purpose: '', fiscalYear: '2025-2026', budgetHead: '', note: '', status: 'DRAFT' })
    setLines([emptyLine()])
    setEditingId(null)
  }

  const openCreate = () => { resetForm(); setShowForm(true) }

  const openEdit = (r: Requisition) => {
    setEditingId(r.requisitionId)
    setForm({
      department: r.department,
      requestedBy: r.requestedBy,
      requestedByDesignation: r.requestedByDesignation,
      purpose: r.purpose,
      fiscalYear: r.fiscalYear,
      budgetHead: r.budgetHead || '',
      note: r.note || '',
      status: r.status,
    })
    setLines(r.items.map(it => ({
      itemName: it.itemName,
      sku: it.sku,
      requestedQuantity: String(it.requestedQuantity),
      unitPrice: it.unitPrice ? String(it.unitPrice) : '',
    })))
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validLines = lines.filter(l => l.itemName.trim())
    if (!validLines.length) { setError('কমপক্ষে একটি মালামাল যুক্ত করুন'); return }
    const items: Omit<RequisitionItem, 'requisitionItemId'>[] = validLines.map((l, i) => ({
      itemId: i + 1,
      itemName: l.itemName,
      sku: l.sku,
      requestedQuantity: parseInt(l.requestedQuantity) || 1,
      unitPrice: l.unitPrice ? parseFloat(l.unitPrice) : undefined,
      totalPrice: l.unitPrice ? (parseFloat(l.unitPrice) * (parseInt(l.requestedQuantity) || 1)) : undefined,
    }))
    const totalAmount = items.reduce((s, it) => s + (it.totalPrice || 0), 0)
    try {
      if (editingId) {
        const updated = RequisitionService.updateRequisition(editingId, { ...form, items: items as RequisitionItem[], totalAmount })
        setRequisitions(requisitions.map(r => r.requisitionId === editingId ? updated : r))
        setSuccess('চাহিদাপত্র আপডেট হয়েছে')
      } else {
        const created = RequisitionService.createRequisition({ ...form, items: items as RequisitionItem[], totalAmount, requisitionDate: new Date().toISOString() })
        setRequisitions([created, ...requisitions])
        setSuccess('চাহিদাপত্র সফলভাবে জমা দেওয়া হয়েছে')
      }
      setShowForm(false); resetForm(); setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'ব্যর্থ হয়েছে')
    }
  }

  const handleDelete = (id: number) => {
    if (!confirm('এই চাহিদাপত্রটি মুছে ফেলবেন?')) return
    RequisitionService.deleteRequisition(id)
    setRequisitions(requisitions.filter(r => r.requisitionId !== id))
    setSuccess('মুছে ফেলা হয়েছে')
  }

  const handleApprove = (id: number) => {
    const updated = RequisitionService.updateRequisition(id, { status: 'APPROVED', approvedBy: session?.user?.name || 'Admin', approvedAt: new Date().toISOString() })
    setRequisitions(requisitions.map(r => r.requisitionId === id ? updated : r))
    setSuccess('অনুমোদন দেওয়া হয়েছে')
  }

  const handleReject = (id: number, reason: string) => {
    const updated = RequisitionService.updateRequisition(id, { status: 'REJECTED', rejectionReason: reason })
    setRequisitions(requisitions.map(r => r.requisitionId === id ? updated : r))
    setSuccess('প্রত্যাখ্যান করা হয়েছে')
    setRejectionModal(null)
  }

  const isAdminOrCentral = userRole === 'ADMIN' || userRole === 'CENTRAL'
  const counts = RequisitionService.getStatusCounts()

  if (status === 'loading' || loading) return <div className="p-8"><LoadingSpinner size="medium" text="লোড হচ্ছে..." /></div>
  if (!session) return <div className="p-10 text-center text-muted-foreground">সাইন ইন করুন</div>

  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-6 animate-slide-down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <FileText size={22} className="text-blue-600 dark:text-blue-400" />
                </div>
                চাহিদাপত্র
              </h1>
              <p className="mt-1 text-sm text-muted-foreground ml-[52px]">মালামালের চাহিদাপত্র ব্যবস্থাপনা</p>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
            >
              <Plus size={16} /> নতুন চাহিদাপত্র
            </button>
          </div>

          {/* Summary chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(Object.entries(counts) as [RequisitionStatus, number][]).map(([st, cnt]) => (
              <span key={st} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[st]}`}>
                {STATUS_LABELS[st]} <span className="font-bold">{cnt}</span>
              </span>
            ))}
          </div>
        </div>

        {success && <div className="mb-4"><SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide /></div>}
        {error && <div className="mb-4"><ErrorMessage message={error} onRetry={() => setError(null)} /></div>}

        {/* Rejection Modal */}
        {rejectionModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setRejectionModal(null)} />
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-foreground">প্রত্যাখ্যানের কারণ</h3>
              <textarea
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm mb-4"
                rows={4}
                placeholder="কারণ লিখুন..."
                value={rejectionModal.reason}
                onChange={e => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setRejectionModal(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">বাতিল</button>
                <button
                  onClick={() => handleReject(rejectionModal.id, rejectionModal.reason)}
                  disabled={!rejectionModal.reason.trim()}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold disabled:opacity-50"
                >নিশ্চিত করুন</button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{editingId ? 'চাহিদাপত্র সম্পাদনা' : 'নতুন চাহিদাপত্র'}</h2>
                <button onClick={() => { setShowForm(false); resetForm() }} className="rounded-full p-2 hover:bg-muted">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">বিভাগ / Department *</label>
                    <input required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="যেমন: ঢাকা বিভাগীয় কার্যালয়" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">অনুরোধকারীর নাম *</label>
                    <input required value={form.requestedBy} onChange={e => setForm({ ...form, requestedBy: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="নাম লিখুন" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">পদবী / Designation</label>
                    <input value={form.requestedByDesignation} onChange={e => setForm({ ...form, requestedByDesignation: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="পদবী লিখুন" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">অর্থবছর / Fiscal Year *</label>
                    <select required value={form.fiscalYear} onChange={e => setForm({ ...form, fiscalYear: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                      {FISCAL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">উদ্দেশ্য / Purpose *</label>
                    <input required value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="চাহিদার উদ্দেশ্য" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">বাজেট খাত / Budget Head</label>
                    <input value={form.budgetHead} onChange={e => setForm({ ...form, budgetHead: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="যেমন: ৩১১-০০" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">অবস্থা / Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as RequisitionStatus })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                      {(Object.keys(STATUS_LABELS) as RequisitionStatus[]).map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">নোট</label>
                    <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" rows={2}
                      placeholder="অতিরিক্ত তথ্য" />
                  </div>
                </div>

                {/* Items */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">মালামালের তালিকা *</label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                      <span className="col-span-4">মালামালের নাম</span>
                      <span className="col-span-3">SKU / কোড</span>
                      <span className="col-span-2">পরিমাণ</span>
                      <span className="col-span-2">একক মূল্য (৳)</span>
                      <span className="col-span-1"></span>
                    </div>
                    {lines.map((line, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center">
                        <input value={line.itemName} onChange={e => { const n = [...lines]; n[i].itemName = e.target.value; setLines(n) }}
                          className="col-span-4 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                          placeholder="মালামালের নাম" />
                        <input value={line.sku} onChange={e => { const n = [...lines]; n[i].sku = e.target.value; setLines(n) }}
                          className="col-span-3 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                          placeholder="SKU" />
                        <input type="number" min="1" value={line.requestedQuantity} onChange={e => { const n = [...lines]; n[i].requestedQuantity = e.target.value; setLines(n) }}
                          className="col-span-2 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground" />
                        <input type="number" min="0" value={line.unitPrice} onChange={e => { const n = [...lines]; n[i].unitPrice = e.target.value; setLines(n) }}
                          className="col-span-2 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                          placeholder="০.০০" />
                        <button type="button" onClick={() => setLines(lines.filter((_, j) => j !== i))}
                          className="col-span-1 flex justify-center text-rose-500 hover:text-rose-700 disabled:opacity-30"
                          disabled={lines.length === 1}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setLines([...lines, emptyLine()])}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      + মালামাল যুক্ত করুন
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowForm(false); resetForm() }}
                    className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted">বাতিল</button>
                  <button type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                    {editingId ? 'আপডেট করুন' : 'জমা দিন'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">কোড</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">তারিখ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">বিভাগ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">উদ্দেশ্য</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">মালামাল</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">মোট মূল্য</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">অবস্থা</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requisitions.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">কোনো চাহিদাপত্র নেই</td></tr>
                ) : requisitions.map(r => (
                  <React.Fragment key={r.requisitionId}>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">
                        <button onClick={() => setExpandedId(expandedId === r.requisitionId ? null : r.requisitionId)}
                          className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400">
                          {expandedId === r.requisitionId ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {r.requisitionCode}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{formatDateDMY(r.requisitionDate)}</td>
                      <td className="px-4 py-3 text-sm text-foreground max-w-[180px] truncate" title={r.department}>{r.department}</td>
                      <td className="px-4 py-3 text-sm text-foreground max-w-[160px] truncate" title={r.purpose}>{r.purpose}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{r.items.length} টি</td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">
                        {r.totalAmount > 0 ? `৳${r.totalAmount.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[r.status]}`}>
                          {STATUS_LABELS[r.status]}
                        </span>
                        {r.rejectionReason && (
                          <p className="text-[10px] text-rose-500 mt-0.5 flex items-center gap-1">
                            <AlertCircle size={9} /> {r.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {isAdminOrCentral && r.status === 'SUBMITTED' && (
                            <>
                              <button onClick={() => handleApprove(r.requisitionId)}
                                className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
                                title="অনুমোদন">
                                <Check size={14} />
                              </button>
                              <button onClick={() => setRejectionModal({ id: r.requisitionId, reason: '' })}
                                className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300"
                                title="প্রত্যাখ্যান">
                                <X size={14} />
                              </button>
                            </>
                          )}
                          {(r.status === 'DRAFT' || r.status === 'SUBMITTED') && (
                            <button onClick={() => openEdit(r)}
                              className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
                              title="সম্পাদনা">
                              <Edit3 size={14} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(r.requisitionId)}
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-rose-100 hover:text-rose-700 dark:bg-gray-800 dark:text-gray-400"
                            title="মুছুন">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === r.requisitionId && (
                      <tr className="bg-muted/20">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                            <div><span className="text-muted-foreground">অনুরোধকারী:</span> <span className="font-medium text-foreground ml-1">{r.requestedBy} ({r.requestedByDesignation})</span></div>
                            <div><span className="text-muted-foreground">অর্থবছর:</span> <span className="font-medium text-foreground ml-1">{r.fiscalYear}</span></div>
                            {r.budgetHead && <div><span className="text-muted-foreground">বাজেট খাত:</span> <span className="font-medium text-foreground ml-1">{r.budgetHead}</span></div>}
                            {r.approvedBy && <div><span className="text-muted-foreground">অনুমোদনকারী:</span> <span className="font-medium text-emerald-600 dark:text-emerald-400 ml-1">{r.approvedBy}</span></div>}
                            {r.note && <div className="md:col-span-3"><span className="text-muted-foreground">নোট:</span> <span className="text-foreground ml-1">{r.note}</span></div>}
                          </div>
                          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">#</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">মালামালের নাম</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">SKU</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">চাহিদা</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">একক মূল্য</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">মোট</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {r.items.map((it, i) => (
                                <tr key={it.requisitionItemId} className="bg-card">
                                  <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                  <td className="px-3 py-2 font-medium text-foreground">{it.itemName}</td>
                                  <td className="px-3 py-2 text-muted-foreground">{it.sku}</td>
                                  <td className="px-3 py-2 text-foreground">{it.requestedQuantity}</td>
                                  <td className="px-3 py-2 text-foreground">{it.unitPrice ? `৳${it.unitPrice.toLocaleString()}` : '—'}</td>
                                  <td className="px-3 py-2 font-semibold text-foreground">{it.totalPrice ? `৳${it.totalPrice.toLocaleString()}` : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
