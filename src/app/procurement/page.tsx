'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Landmark, Plus, X, Edit3, Trash2, ChevronDown, ChevronUp, Users } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { usePermissions } from '@/hooks/usePermissions'
import {
  ProcurementService,
  Procurement,
  ProcurementMethod,
  ProcurementStatus,
  ProcurementCommitteeMember,
  CreateProcurementRequest,
} from '@/lib/services/procurementService'
import { formatDateDMY } from '@/lib/utils/date'

const METHOD_COLORS: Record<ProcurementMethod, string> = {
  OTM: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  LTM: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  RFQ: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  DIRECT: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const METHOD_LABELS: Record<ProcurementMethod, string> = {
  OTM: 'উন্মুক্ত দরপত্র (OTM)',
  LTM: 'সীমিত দরপত্র (LTM)',
  RFQ: 'কোটেশন (RFQ)',
  DIRECT: 'সরাসরি ক্রয়',
}

const STATUS_LABELS: Record<ProcurementStatus, string> = {
  INITIATED: 'শুরু হয়েছে',
  COMMITTEE_FORMED: 'কমিটি গঠিত',
  TENDER_PUBLISHED: 'দরপত্র প্রকাশিত',
  BID_RECEIVED: 'দরপত্র প্রাপ্ত',
  EVALUATED: 'মূল্যায়িত',
  APPROVED: 'অনুমোদিত',
  CONTRACT_AWARDED: 'চুক্তি সম্পাদিত',
  DELIVERED: 'ডেলিভারি হয়েছে',
  COMPLETED: 'সম্পন্ন',
  CANCELLED: 'বাতিল',
}

const STATUS_COLORS: Record<ProcurementStatus, string> = {
  INITIATED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  COMMITTEE_FORMED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  TENDER_PUBLISHED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  BID_RECEIVED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  EVALUATED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  APPROVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  CONTRACT_AWARDED: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  DELIVERED: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

const PIPELINE: ProcurementStatus[] = [
  'INITIATED', 'COMMITTEE_FORMED', 'TENDER_PUBLISHED', 'BID_RECEIVED',
  'EVALUATED', 'APPROVED', 'CONTRACT_AWARDED', 'DELIVERED', 'COMPLETED',
]

const FISCAL_YEARS = ['2025-2026', '2024-2025', '2023-2024']

export default function ProcurementPage() {
  const { data: session, status } = useSession()
  const { userRole } = usePermissions()
  const [procurements, setProcurements] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const [form, setForm] = useState<CreateProcurementRequest>({
    title: '', description: '', estimatedAmount: 0,
    budgetHead: '', fiscalYear: '2025-2026', requisitionCode: '', note: '',
    committee: [],
  })
  const [suggestedMethod, setSuggestedMethod] = useState<ProcurementMethod>('DIRECT')
  const [editStatus, setEditStatus] = useState<ProcurementStatus>('INITIATED')
  const [editSupplier, setEditSupplier] = useState('')
  const [editContract, setEditContract] = useState('')
  const [committeeLine, setCommitteeLine] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      try { setProcurements(ProcurementService.getProcurements()) }
      catch { setError('ডেটা লোড হয়নি') }
      finally { setLoading(false) }
    }
  }, [status])

  const resetForm = () => {
    setForm({ title: '', description: '', estimatedAmount: 0, budgetHead: '', fiscalYear: '2025-2026', requisitionCode: '', note: '', committee: [] })
    setSuggestedMethod('DIRECT')
    setEditStatus('INITIATED')
    setEditSupplier('')
    setEditContract('')
    setCommitteeLine('')
    setEditingId(null)
  }

  const handleAmountChange = (val: string) => {
    const n = parseFloat(val) || 0
    setForm(f => ({ ...f, estimatedAmount: n }))
    setSuggestedMethod(ProcurementService.suggestMethod(n))
  }

  const openCreate = () => { resetForm(); setShowForm(true) }

  const openEdit = (p: Procurement) => {
    setEditingId(p.procurementId)
    setForm({
      title: p.title, description: p.description, estimatedAmount: p.estimatedAmount,
      budgetHead: p.budgetHead, fiscalYear: p.fiscalYear,
      requisitionCode: p.requisitionCode || '', note: p.note || '',
      committee: p.committee || [],
    })
    setSuggestedMethod(p.method)
    setEditStatus(p.status)
    setEditSupplier(p.supplierName || '')
    setEditContract(p.contractNumber || '')
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const committee = committeeLine.trim()
        ? committeeLine.split(',').map((n, i) => ({
            name: n.trim(),
            designation: '',
            role: (i === 0 ? 'Chairman' : i === 1 ? 'Member Secretary' : 'Member') as ProcurementCommitteeMember['role'],
          }))
        : (form.committee || [])

      if (editingId) {
        const updated = ProcurementService.updateProcurement(editingId, {
          ...form, committee, method: suggestedMethod,
          status: editStatus, supplierName: editSupplier, contractNumber: editContract,
        })
        setProcurements(procurements.map(p => p.procurementId === editingId ? updated : p))
        setSuccess('ক্রয় তথ্য আপডেট হয়েছে')
      } else {
        const created = ProcurementService.createProcurement({ ...form, committee })
        setProcurements([created, ...procurements])
        setSuccess('নতুন ক্রয় প্রক্রিয়া যুক্ত হয়েছে')
      }
      setShowForm(false); resetForm(); setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'ব্যর্থ হয়েছে')
    }
  }

  const handleDelete = (id: number) => {
    if (!confirm('এই ক্রয় প্রক্রিয়াটি মুছবেন?')) return
    ProcurementService.deleteProcurement(id)
    setProcurements(procurements.filter(p => p.procurementId !== id))
    setSuccess('মুছে ফেলা হয়েছে')
  }

  const advanceStatus = (p: Procurement) => {
    const idx = PIPELINE.indexOf(p.status)
    if (idx < 0 || idx >= PIPELINE.length - 1) return
    const nextStatus = PIPELINE[idx + 1]
    const updated = ProcurementService.updateProcurement(p.procurementId, { status: nextStatus })
    setProcurements(procurements.map(x => x.procurementId === p.procurementId ? updated : x))
    setSuccess(`পরবর্তী ধাপে উন্নীত: ${STATUS_LABELS[nextStatus]}`)
  }

  const isAdminOrCentral = userRole === 'ADMIN' || userRole === 'CENTRAL'

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
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                  <Landmark size={22} className="text-violet-600 dark:text-violet-400" />
                </div>
                ক্রয় প্রক্রিয়া
              </h1>
              <p className="mt-1 text-sm text-muted-foreground ml-[52px]">সরকারি ক্রয় নীতিমালা অনুযায়ী ক্রয় ব্যবস্থাপনা (PPR 2008)</p>
            </div>
            {isAdminOrCentral && (
              <button onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all">
                <Plus size={16} /> নতুন ক্রয়
              </button>
            )}
          </div>

          {/* Method guide */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(Object.keys(METHOD_LABELS) as ProcurementMethod[]).map(m => (
              <span key={m} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${METHOD_COLORS[m]}`}>
                {METHOD_LABELS[m]}
              </span>
            ))}
          </div>
        </div>

        {success && <div className="mb-4"><SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide /></div>}
        {error && <div className="mb-4"><ErrorMessage message={error} onRetry={() => setError(null)} /></div>}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setShowForm(false); resetForm() }} />
            <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{editingId ? 'ক্রয় তথ্য সম্পাদনা' : 'নতুন ক্রয় প্রক্রিয়া'}</h2>
                <button onClick={() => { setShowForm(false); resetForm() }} className="rounded-full p-2 hover:bg-muted"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">শিরোনাম / Title *</label>
                    <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="যেমন: কম্পিউটার ক্রয়" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">বিবরণ / Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" rows={2}
                      placeholder="বিস্তারিত বিবরণ" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">আনুমানিক মূল্য (৳) *</label>
                    <input type="number" required min="0" value={form.estimatedAmount || ''}
                      onChange={e => handleAmountChange(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                    {form.estimatedAmount > 0 && (
                      <p className="text-xs mt-1">
                        <span className="text-muted-foreground">পরামর্শকৃত পদ্ধতি: </span>
                        <span className={`font-semibold px-1.5 py-0.5 rounded ${METHOD_COLORS[suggestedMethod]}`}>{METHOD_LABELS[suggestedMethod]}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">অর্থবছর *</label>
                    <select required value={form.fiscalYear} onChange={e => setForm(f => ({ ...f, fiscalYear: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                      {FISCAL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">বাজেট খাত *</label>
                    <input required value={form.budgetHead} onChange={e => setForm(f => ({ ...f, budgetHead: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="যেমন: ৪৭১১-অফিস যন্ত্রপাতি" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">চাহিদাপত্র কোড</label>
                    <input value={form.requisitionCode || ''} onChange={e => setForm(f => ({ ...f, requisitionCode: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="REQ-2026-001" />
                  </div>
                  {editingId && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">অবস্থা</label>
                        <select value={editStatus} onChange={e => setEditStatus(e.target.value as ProcurementStatus)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                          {PIPELINE.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                          <option value="CANCELLED">বাতিল</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">সরবরাহকারী</label>
                        <input value={editSupplier} onChange={e => setEditSupplier(e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                          placeholder="সরবরাহকারীর নাম" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">চুক্তি নম্বর</label>
                        <input value={editContract} onChange={e => setEditContract(e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                          placeholder="CONTRACT-2026-001" />
                      </div>
                    </>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      <Users size={14} className="inline mr-1" />কমিটি সদস্য (কমা দিয়ে আলাদা করুন)
                    </label>
                    <input value={committeeLine} onChange={e => setCommitteeLine(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="মোঃ আব্দুল করিম, ফারহানা আক্তার, সাইফুল ইসলাম" />
                    <p className="text-xs text-muted-foreground mt-1">প্রথম জন Chairman, দ্বিতীয় জন Member Secretary, বাকিরা Member</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">নোট</label>
                    <textarea value={form.note || ''} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" rows={2}
                      placeholder="অতিরিক্ত তথ্য" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowForm(false); resetForm() }}
                    className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted">বাতিল</button>
                  <button type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                    {editingId ? 'আপডেট' : 'যুক্ত করুন'}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">শিরোনাম</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">পদ্ধতি</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">আনুমানিক মূল্য</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">অর্থবছর</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">অবস্থা</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {procurements.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">কোনো ক্রয় তথ্য নেই</td></tr>
                ) : procurements.map(p => (
                  <React.Fragment key={p.procurementId}>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">
                        <button onClick={() => setExpandedId(expandedId === p.procurementId ? null : p.procurementId)}
                          className="flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400">
                          {expandedId === p.procurementId ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {p.procurementCode}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground max-w-[200px] truncate" title={p.title}>{p.title}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${METHOD_COLORS[p.method]}`}>
                          {p.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">৳{p.estimatedAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.fiscalYear}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.status]}`}>
                          {STATUS_LABELS[p.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {isAdminOrCentral && PIPELINE.indexOf(p.status) < PIPELINE.length - 1 && p.status !== 'CANCELLED' && (
                            <button onClick={() => advanceStatus(p)}
                              className="px-2 py-1 rounded-lg bg-violet-100 text-violet-700 text-xs font-medium hover:bg-violet-200 dark:bg-violet-900/40 dark:text-violet-300"
                              title="পরবর্তী ধাপ">
                              পরবর্তী →
                            </button>
                          )}
                          {isAdminOrCentral && (
                            <button onClick={() => openEdit(p)}
                              className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
                              title="সম্পাদনা">
                              <Edit3 size={14} />
                            </button>
                          )}
                          {isAdminOrCentral && (
                            <button onClick={() => handleDelete(p.procurementId)}
                              className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-rose-100 hover:text-rose-700 dark:bg-gray-800 dark:text-gray-400"
                              title="মুছুন">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === p.procurementId && (
                      <tr className="bg-muted/20">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                            <div><span className="text-muted-foreground">বাজেট খাত:</span> <span className="font-medium text-foreground ml-1">{p.budgetHead}</span></div>
                            {p.requisitionCode && <div><span className="text-muted-foreground">চাহিদাপত্র:</span> <span className="font-medium text-foreground ml-1">{p.requisitionCode}</span></div>}
                            {p.supplierName && <div><span className="text-muted-foreground">সরবরাহকারী:</span> <span className="font-medium text-foreground ml-1">{p.supplierName}</span></div>}
                            {p.contractNumber && <div><span className="text-muted-foreground">চুক্তি নম্বর:</span> <span className="font-medium text-foreground ml-1">{p.contractNumber}</span></div>}
                            {p.tenderNoticeDate && <div><span className="text-muted-foreground">দরপত্র প্রকাশ:</span> <span className="text-foreground ml-1">{formatDateDMY(p.tenderNoticeDate)}</span></div>}
                            {p.tenderClosingDate && <div><span className="text-muted-foreground">দরপত্র শেষ:</span> <span className="text-foreground ml-1">{formatDateDMY(p.tenderClosingDate)}</span></div>}
                            <div><span className="text-muted-foreground">তৈরিকারী:</span> <span className="text-foreground ml-1">{p.createdBy}</span></div>
                            {p.note && <div className="md:col-span-3"><span className="text-muted-foreground">নোট:</span> <span className="text-foreground ml-1">{p.note}</span></div>}
                          </div>
                          {p.committee && p.committee.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1"><Users size={12} /> ক্রয় কমিটি</p>
                              <div className="flex flex-wrap gap-2">
                                {p.committee.map((m, i) => (
                                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm">
                                    <span className="font-medium text-foreground">{m.name}</span>
                                    {m.designation && <span className="text-muted-foreground text-xs">· {m.designation}</span>}
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{m.role}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
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
