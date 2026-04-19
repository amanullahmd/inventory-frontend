'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Gavel, Plus, X, ChevronDown, ChevronUp, MapPin, Calendar, Users, Trash2, Edit3 } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { usePermissions } from '@/hooks/usePermissions'
import {
  AuctionService, Auction, AuctionStatus, AuctionItemCondition, CreateAuctionRequest,
} from '@/lib/services/auctionService'
import { formatDateDMY } from '@/lib/utils/date'

const STATUS_LABELS: Record<AuctionStatus, string> = {
  SCHEDULED: 'নির্ধারিত',
  NOTICE_PUBLISHED: 'নোটিশ প্রকাশিত',
  BIDDING_OPEN: 'দরপত্র খোলা',
  BIDDING_CLOSED: 'দরপত্র বন্ধ',
  AWARDED: 'পুরস্কৃত',
  COMPLETED: 'সম্পন্ন',
  CANCELLED: 'বাতিল',
}

const STATUS_COLORS: Record<AuctionStatus, string> = {
  SCHEDULED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  NOTICE_PUBLISHED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  BIDDING_OPEN: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  BIDDING_CLOSED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  AWARDED: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  CANCELLED: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

const CONDITION_LABELS: Record<AuctionItemCondition, string> = {
  Unusable: 'অকেজো',
  Damaged: 'ক্ষতিগ্রস্ত',
  Obsolete: 'পুরনো/অচল',
  Surplus: 'অতিরিক্ত',
}

const CONDITION_COLORS: Record<AuctionItemCondition, string> = {
  Unusable: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Damaged: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Obsolete: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Surplus: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

const PIPELINE: AuctionStatus[] = [
  'SCHEDULED', 'NOTICE_PUBLISHED', 'BIDDING_OPEN', 'BIDDING_CLOSED', 'AWARDED', 'COMPLETED',
]

interface ItemLine {
  itemName: string
  description: string
  condition: AuctionItemCondition
  quantity: string
  estimatedValue: string
  reservePrice: string
}

const emptyItemLine = (): ItemLine => ({
  itemName: '', description: '', condition: 'Unusable',
  quantity: '1', estimatedValue: '', reservePrice: '',
})

export default function AuctionPage() {
  const { data: session, status } = useSession()
  const { userRole } = usePermissions()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const [form, setForm] = useState({
    title: '',
    auctionDate: '',
    location: '',
    committeeChairman: '',
    committeeMembers: '',
    note: '',
  })
  const [itemLines, setItemLines] = useState<ItemLine[]>([emptyItemLine()])
  const [editStatus, setEditStatus] = useState<AuctionStatus>('SCHEDULED')

  useEffect(() => {
    if (status === 'authenticated') {
      try { setAuctions(AuctionService.getAuctions()) }
      catch { setError('নিলাম তথ্য লোড হয়নি') }
      finally { setLoading(false) }
    }
  }, [status])

  const resetForm = () => {
    setForm({ title: '', auctionDate: '', location: '', committeeChairman: '', committeeMembers: '', note: '' })
    setItemLines([emptyItemLine()])
    setEditStatus('SCHEDULED')
    setEditingId(null)
  }

  const openCreate = () => { resetForm(); setShowForm(true) }

  const openEdit = (a: Auction) => {
    setEditingId(a.auctionId)
    setForm({
      title: a.title,
      auctionDate: a.auctionDate.split('T')[0],
      location: a.location,
      committeeChairman: a.committeeChairman,
      committeeMembers: a.committeeMembers.join(', '),
      note: a.note || '',
    })
    setItemLines(a.items.map(it => ({
      itemName: it.itemName,
      description: it.description,
      condition: it.condition,
      quantity: String(it.quantity),
      estimatedValue: String(it.estimatedValue),
      reservePrice: String(it.reservePrice),
    })))
    setEditStatus(a.status)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validItems = itemLines.filter(l => l.itemName.trim())
    if (!validItems.length) { setError('কমপক্ষে একটি মালামাল যুক্ত করুন'); return }

    const members = form.committeeMembers.split(',').map(m => m.trim()).filter(Boolean)
    const items: CreateAuctionRequest['items'] = validItems.map(l => ({
      itemName: l.itemName,
      description: l.description,
      condition: l.condition,
      quantity: parseInt(l.quantity) || 1,
      estimatedValue: parseFloat(l.estimatedValue) || 0,
      reservePrice: parseFloat(l.reservePrice) || 0,
    }))

    try {
      if (editingId) {
        const updated = AuctionService.updateAuction(editingId, {
          title: form.title,
          auctionDate: form.auctionDate,
          location: form.location,
          committeeChairman: form.committeeChairman,
          committeeMembers: members,
          items: auctions.find(a => a.auctionId === editingId)?.items || [],
          status: editStatus,
          note: form.note,
          totalEstimatedValue: items.reduce((s, i) => s + i.estimatedValue, 0),
        })
        setAuctions(auctions.map(a => a.auctionId === editingId ? updated : a))
        setSuccess('নিলাম তথ্য আপডেট হয়েছে')
      } else {
        const created = AuctionService.createAuction({
          title: form.title,
          auctionDate: form.auctionDate,
          location: form.location,
          committeeChairman: form.committeeChairman,
          committeeMembers: members,
          items,
          note: form.note,
        })
        setAuctions([created, ...auctions])
        setSuccess('নতুন নিলাম তৈরি হয়েছে')
      }
      setShowForm(false); resetForm(); setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'ব্যর্থ হয়েছে')
    }
  }

  const handleDelete = (id: number) => {
    if (!confirm('এই নিলামটি মুছবেন?')) return
    AuctionService.deleteAuction(id)
    setAuctions(auctions.filter(a => a.auctionId !== id))
    setSuccess('মুছে ফেলা হয়েছে')
  }

  const advanceStatus = (a: Auction) => {
    const idx = PIPELINE.indexOf(a.status)
    if (idx < 0 || idx >= PIPELINE.length - 1) return
    const next = PIPELINE[idx + 1]
    const updated = AuctionService.updateAuction(a.auctionId, { status: next })
    setAuctions(auctions.map(x => x.auctionId === a.auctionId ? updated : x))
    setSuccess(`পরবর্তী ধাপ: ${STATUS_LABELS[next]}`)
  }

  const isAdminOrCentral = userRole === 'ADMIN' || userRole === 'CENTRAL'

  if (status === 'loading' || loading) return <div className="p-8"><LoadingSpinner size="medium" text="লোড হচ্ছে..." /></div>
  if (!session) return <div className="p-10 text-center text-muted-foreground">সাইন ইন করুন</div>

  const totalEstimated = auctions.reduce((s, a) => s + a.totalEstimatedValue, 0)
  const totalSold = auctions.reduce((s, a) => s + (a.totalSoldValue || 0), 0)

  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-6 animate-slide-down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <Gavel size={22} className="text-amber-600 dark:text-amber-400" />
                </div>
                নিলাম
              </h1>
              <p className="mt-1 text-sm text-muted-foreground ml-[52px]">নিলাম সংক্রান্ত কার্যক্রম ব্যবস্থাপনা</p>
            </div>
            {isAdminOrCentral && (
              <button onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all">
                <Plus size={16} /> নতুন নিলাম
              </button>
            )}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              মোট নিলাম: <strong className="text-foreground ml-1">{auctions.length}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              আনুমানিক মূল্য: <strong className="ml-1">৳{totalEstimated.toLocaleString()}</strong>
            </span>
            {totalSold > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                বিক্রয় মূল্য: <strong className="ml-1">৳{totalSold.toLocaleString()}</strong>
              </span>
            )}
          </div>
        </div>

        {success && <div className="mb-4"><SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide /></div>}
        {error && <div className="mb-4"><ErrorMessage message={error} onRetry={() => setError(null)} /></div>}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setShowForm(false); resetForm() }} />
            <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-foreground">{editingId ? 'নিলাম সম্পাদনা' : 'নতুন নিলাম তৈরি'}</h2>
                <button onClick={() => { setShowForm(false); resetForm() }} className="rounded-full p-2 hover:bg-muted"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">শিরোনাম *</label>
                    <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="যেমন: পুরাতন কম্পিউটার নিলাম" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">নিলামের তারিখ *</label>
                    <input required type="date" value={form.auctionDate} onChange={e => setForm(f => ({ ...f, auctionDate: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">স্থান *</label>
                    <input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="যেমন: ডিপিই প্রধান কার্যালয়" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">কমিটি চেয়ারম্যান *</label>
                    <input required value={form.committeeChairman} onChange={e => setForm(f => ({ ...f, committeeChairman: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="চেয়ারম্যানের নাম" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">কমিটি সদস্য (কমা দিয়ে)</label>
                    <input value={form.committeeMembers} onChange={e => setForm(f => ({ ...f, committeeMembers: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="সদস্য ১, সদস্য ২, সদস্য ৩" />
                  </div>
                  {editingId && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">অবস্থা</label>
                      <select value={editStatus} onChange={e => setEditStatus(e.target.value as AuctionStatus)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                        {PIPELINE.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        <option value="CANCELLED">বাতিল</option>
                      </select>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">নোট</label>
                    <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" rows={2} />
                  </div>
                </div>

                {/* Auction Items */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">নিলামের মালামাল *</label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                      <span className="col-span-3">নাম</span>
                      <span className="col-span-2">অবস্থা</span>
                      <span className="col-span-1">পরিমাণ</span>
                      <span className="col-span-2">আনুমানিক (৳)</span>
                      <span className="col-span-2">সর্বনিম্ন মূল্য (৳)</span>
                      <span className="col-span-2">বিবরণ</span>
                    </div>
                    {itemLines.map((line, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center">
                        <input value={line.itemName} onChange={e => { const n = [...itemLines]; n[i].itemName = e.target.value; setItemLines(n) }}
                          className="col-span-3 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                          placeholder="মালামালের নাম" />
                        <select value={line.condition} onChange={e => { const n = [...itemLines]; n[i].condition = e.target.value as AuctionItemCondition; setItemLines(n) }}
                          className="col-span-2 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground">
                          {(Object.keys(CONDITION_LABELS) as AuctionItemCondition[]).map(c => (
                            <option key={c} value={c}>{CONDITION_LABELS[c]}</option>
                          ))}
                        </select>
                        <input type="number" min="1" value={line.quantity} onChange={e => { const n = [...itemLines]; n[i].quantity = e.target.value; setItemLines(n) }}
                          className="col-span-1 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground" />
                        <input type="number" min="0" value={line.estimatedValue} onChange={e => { const n = [...itemLines]; n[i].estimatedValue = e.target.value; setItemLines(n) }}
                          className="col-span-2 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground" placeholder="০" />
                        <input type="number" min="0" value={line.reservePrice} onChange={e => { const n = [...itemLines]; n[i].reservePrice = e.target.value; setItemLines(n) }}
                          className="col-span-2 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground" placeholder="০" />
                        <input value={line.description} onChange={e => { const n = [...itemLines]; n[i].description = e.target.value; setItemLines(n) }}
                          className="col-span-1 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground" placeholder="বিবরণ" />
                        <button type="button" onClick={() => setItemLines(itemLines.filter((_, j) => j !== i))}
                          disabled={itemLines.length === 1}
                          className="flex justify-center text-rose-500 hover:text-rose-700 disabled:opacity-30">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setItemLines([...itemLines, emptyItemLine()])}
                      className="text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium">
                      + মালামাল যুক্ত করুন
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowForm(false); resetForm() }}
                    className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted">বাতিল</button>
                  <button type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                    {editingId ? 'আপডেট' : 'তৈরি করুন'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Auction Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-slide-up">
          {auctions.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted-foreground">
              কোনো নিলাম নেই। নতুন নিলাম তৈরি করুন।
            </div>
          )}
          {auctions.map(a => (
            <div key={a.auctionId} className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-muted-foreground mb-0.5">{a.auctionCode}</p>
                    <h3 className="font-semibold text-sm text-foreground leading-snug">{a.title}</h3>
                  </div>
                  <span className={`flex-shrink-0 inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[a.status]}`}>
                    {STATUS_LABELS[a.status]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {formatDateDMY(a.auctionDate)}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {a.location}</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {a.committeeChairman}</span>
                </div>
              </div>

              {/* Card Stats */}
              <div className="px-4 py-3 grid grid-cols-3 gap-2 text-center border-b border-border">
                <div>
                  <p className="text-lg font-bold text-foreground">{a.items.length}</p>
                  <p className="text-[10px] text-muted-foreground">মালামাল</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">৳{(a.totalEstimatedValue / 1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-muted-foreground">আনুমানিক</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {a.totalSoldValue ? `৳${(a.totalSoldValue / 1000).toFixed(1)}k` : '—'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">বিক্রয়</p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="px-4 py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {isAdminOrCentral && PIPELINE.indexOf(a.status) < PIPELINE.length - 1 && a.status !== 'CANCELLED' && (
                    <button onClick={() => advanceStatus(a)}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-medium hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300">
                      পরবর্তী →
                    </button>
                  )}
                  {isAdminOrCentral && (
                    <button onClick={() => openEdit(a)}
                      className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300" title="সম্পাদনা">
                      <Edit3 size={13} />
                    </button>
                  )}
                  {isAdminOrCentral && (
                    <button onClick={() => handleDelete(a.auctionId)}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-rose-100 hover:text-rose-700 dark:bg-gray-800 dark:text-gray-400" title="মুছুন">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <button onClick={() => setExpandedId(expandedId === a.auctionId ? null : a.auctionId)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {expandedId === a.auctionId ? <><ChevronUp size={14} /> বন্ধ করুন</> : <><ChevronDown size={14} /> বিস্তারিত</>}
                </button>
              </div>

              {/* Expanded Items Table */}
              {expandedId === a.auctionId && (
                <div className="border-t border-border px-4 py-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">মালামালের তালিকা</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-1.5 text-left font-medium text-muted-foreground">নাম</th>
                          <th className="py-1.5 text-left font-medium text-muted-foreground">অবস্থা</th>
                          <th className="py-1.5 text-right font-medium text-muted-foreground">পরিমাণ</th>
                          <th className="py-1.5 text-right font-medium text-muted-foreground">আনুমানিক</th>
                          <th className="py-1.5 text-right font-medium text-muted-foreground">সর্বনিম্ন</th>
                          <th className="py-1.5 text-right font-medium text-muted-foreground">বিক্রয়</th>
                          <th className="py-1.5 text-left font-medium text-muted-foreground pl-2">ক্রেতা</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {a.items.map(it => (
                          <tr key={it.auctionItemId}>
                            <td className="py-1.5 font-medium text-foreground">{it.itemName}</td>
                            <td className="py-1.5">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${CONDITION_COLORS[it.condition]}`}>
                                {CONDITION_LABELS[it.condition]}
                              </span>
                            </td>
                            <td className="py-1.5 text-right text-muted-foreground">{it.quantity}</td>
                            <td className="py-1.5 text-right text-amber-600 dark:text-amber-400">৳{it.estimatedValue.toLocaleString()}</td>
                            <td className="py-1.5 text-right text-muted-foreground">৳{it.reservePrice.toLocaleString()}</td>
                            <td className="py-1.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                              {it.soldPrice ? `৳${it.soldPrice.toLocaleString()}` : '—'}
                            </td>
                            <td className="py-1.5 text-muted-foreground pl-2">{it.buyerName || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {a.note && <p className="text-xs text-muted-foreground mt-2 italic">{a.note}</p>}
                  {a.committeeMembers.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">কমিটি সদস্য:</span> {a.committeeMembers.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
