'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Building, Plus, X, Edit3, Trash2, ArrowLeftRight,
  Wrench, ShoppingCart, Filter, Package
} from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { usePermissions } from '@/hooks/usePermissions'
import {
  AssetService, Asset, AssetTransaction,
  AssetType, AssetStatus, AssetTransactionType,
} from '@/lib/services/assetService'
import { formatDateDMY } from '@/lib/utils/date'

const TYPE_LABELS: Record<AssetType, string> = {
  Movable: 'অস্থাবর',
  Immovable: 'স্থাবর',
}

const TYPE_COLORS: Record<AssetType, string> = {
  Movable: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Immovable: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const STATUS_LABELS: Record<AssetStatus, string> = {
  Active: 'সক্রিয়',
  Under_Repair: 'মেরামতাধীন',
  Unusable: 'অকেজো',
  Transferred: 'বদলি',
  Disposed: 'নিষ্পত্তি',
  Auctioned: 'নিলামকৃত',
}

const STATUS_COLORS: Record<AssetStatus, string> = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Under_Repair: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Unusable: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Transferred: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Disposed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  Auctioned: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
}

const TX_LABELS: Record<AssetTransactionType, string> = {
  Purchase: 'ক্রয়',
  Sale: 'বিক্রয়',
  Repair: 'মেরামত',
  Transfer: 'বদলি',
}

const TX_COLORS: Record<AssetTransactionType, string> = {
  Purchase: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Sale: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Repair: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Transfer: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
}

const TX_ICONS: Record<AssetTransactionType, React.ReactNode> = {
  Purchase: <ShoppingCart size={14} />,
  Sale: <ArrowLeftRight size={14} />,
  Repair: <Wrench size={14} />,
  Transfer: <ArrowLeftRight size={14} />,
}

const CATEGORIES = ['আসবাবপত্র', 'ইলেকট্রনিক্স', 'যানবাহন', 'ভবন', 'জমি', 'যন্ত্রপাতি', 'অন্যান্য']

export default function AssetsPage() {
  const { data: session, status } = useSession()
  const { userRole } = usePermissions()
  const [assets, setAssets] = useState<Asset[]>([])
  const [transactions, setTransactions] = useState<AssetTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'assets' | 'transactions'>('assets')
  const [typeFilter, setTypeFilter] = useState<'All' | AssetType>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | AssetStatus>('All')

  const [showAssetForm, setShowAssetForm] = useState(false)
  const [showTxForm, setShowTxForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [assetForm, setAssetForm] = useState<Omit<Asset, 'assetId' | 'assetCode' | 'createdAt'>>({
    name: '', nameBn: '', description: '', type: 'Movable', category: 'আসবাবপত্র',
    status: 'Active', purchaseDate: '', purchasePrice: 0, currentValue: undefined,
    location: '', assignedTo: '', assignedDepartment: '',
    warrantyExpiry: '', lastMaintenanceDate: '', serialNumber: '', note: '',
  })

  const [txForm, setTxForm] = useState({
    assetId: 0, transactionType: 'Repair' as AssetTransactionType,
    date: new Date().toISOString().split('T')[0],
    amount: '', fromLocation: '', toLocation: '',
    fromDepartment: '', toDepartment: '',
    vendor: '', description: '', approvedBy: '', documentReference: '',
  })

  useEffect(() => {
    if (status === 'authenticated') {
      try {
        setAssets(AssetService.getAssets())
        setTransactions(AssetService.getTransactions())
      } catch { setError('ডেটা লোড হয়নি') }
      finally { setLoading(false) }
    }
  }, [status])

  const filteredAssets = assets.filter(a => {
    if (typeFilter !== 'All' && a.type !== typeFilter) return false
    if (statusFilter !== 'All' && a.status !== statusFilter) return false
    return true
  })

  const resetAssetForm = () => {
    setAssetForm({
      name: '', nameBn: '', description: '', type: 'Movable', category: 'আসবাবপত্র',
      status: 'Active', purchaseDate: '', purchasePrice: 0, currentValue: undefined,
      location: '', assignedTo: '', assignedDepartment: '',
      warrantyExpiry: '', lastMaintenanceDate: '', serialNumber: '', note: '',
    })
    setEditingId(null)
  }

  const openEdit = (a: Asset) => {
    setEditingId(a.assetId)
    setAssetForm({
      name: a.name, nameBn: a.nameBn || '', description: a.description,
      type: a.type, category: a.category, status: a.status,
      purchaseDate: a.purchaseDate.split('T')[0], purchasePrice: a.purchasePrice,
      currentValue: a.currentValue, location: a.location,
      assignedTo: a.assignedTo || '', assignedDepartment: a.assignedDepartment || '',
      warrantyExpiry: a.warrantyExpiry ? a.warrantyExpiry.split('T')[0] : '',
      lastMaintenanceDate: a.lastMaintenanceDate ? a.lastMaintenanceDate.split('T')[0] : '',
      serialNumber: a.serialNumber || '', note: a.note || '',
    })
    setShowAssetForm(true)
  }

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const updated = AssetService.updateAsset(editingId, assetForm)
        setAssets(assets.map(a => a.assetId === editingId ? updated : a))
        setSuccess('সম্পদ আপডেট হয়েছে')
      } else {
        const created = AssetService.createAsset(assetForm)
        setAssets([created, ...assets])
        setSuccess('নতুন সম্পদ যুক্ত হয়েছে')
      }
      setShowAssetForm(false); resetAssetForm(); setError(null)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'ব্যর্থ') }
  }

  const handleDeleteAsset = (id: number) => {
    if (!confirm('এই সম্পদটি মুছবেন?')) return
    AssetService.deleteAsset(id)
    setAssets(assets.filter(a => a.assetId !== id))
    setSuccess('মুছে ফেলা হয়েছে')
  }

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const asset = assets.find(a => a.assetId === txForm.assetId)
    if (!asset) { setError('সম্পদ নির্বাচন করুন'); return }
    try {
      const created = AssetService.addTransaction({
        assetId: txForm.assetId,
        assetName: asset.name,
        transactionType: txForm.transactionType,
        date: new Date(txForm.date).toISOString(),
        amount: parseFloat(txForm.amount) || 0,
        fromLocation: txForm.fromLocation || undefined,
        toLocation: txForm.toLocation || undefined,
        fromDepartment: txForm.fromDepartment || undefined,
        toDepartment: txForm.toDepartment || undefined,
        vendor: txForm.vendor || undefined,
        description: txForm.description,
        approvedBy: txForm.approvedBy || undefined,
        documentReference: txForm.documentReference || undefined,
      })
      setTransactions([created, ...transactions])

      // Update asset status for repair/transfer
      if (txForm.transactionType === 'Repair') {
        const updated = AssetService.updateAsset(txForm.assetId, { status: 'Under_Repair', lastMaintenanceDate: txForm.date })
        setAssets(assets.map(a => a.assetId === txForm.assetId ? updated : a))
      } else if (txForm.transactionType === 'Transfer') {
        const updated = AssetService.updateAsset(txForm.assetId, { status: 'Transferred', location: txForm.toLocation || asset.location })
        setAssets(assets.map(a => a.assetId === txForm.assetId ? updated : a))
      }

      setSuccess('লেনদেন যুক্ত হয়েছে')
      setShowTxForm(false)
      setTxForm({ assetId: 0, transactionType: 'Repair', date: new Date().toISOString().split('T')[0], amount: '', fromLocation: '', toLocation: '', fromDepartment: '', toDepartment: '', vendor: '', description: '', approvedBy: '', documentReference: '' })
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'ব্যর্থ') }
  }

  const isAdminOrCentral = userRole === 'ADMIN' || userRole === 'CENTRAL'
  const statusCounts = AssetService.getStatusCounts()

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
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <Building size={22} className="text-orange-600 dark:text-orange-400" />
                </div>
                সম্পদ ব্যবস্থাপনা
              </h1>
              <p className="mt-1 text-sm text-muted-foreground ml-[52px]">স্থাবর ও অস্থাবর সম্পদ — ক্রয়, বিক্রয়, মেরামত ও বদলি</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowTxForm(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-all">
                <ArrowLeftRight size={16} /> লেনদেন যুক্ত
              </button>
              {isAdminOrCentral && (
                <button onClick={() => { resetAssetForm(); setShowAssetForm(true) }}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all">
                  <Plus size={16} /> নতুন সম্পদ
                </button>
              )}
            </div>
          </div>

          {/* Status summary chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(Object.entries(statusCounts) as [AssetStatus, number][]).filter(([, c]) => c > 0).map(([s, c]) => (
              <span key={s} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${statusFilter === s ? 'ring-2 ring-offset-1 ring-current' : ''} ${STATUS_COLORS[s]}`}
                onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}>
                {STATUS_LABELS[s]} <span className="font-bold">{c}</span>
              </span>
            ))}
          </div>
        </div>

        {success && <div className="mb-4"><SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide /></div>}
        {error && <div className="mb-4"><ErrorMessage message={error} onRetry={() => setError(null)} /></div>}

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-6">
          <button onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === 'assets' ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            <Package size={16} /> সম্পদ তালিকা
            <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">{assets.length}</span>
          </button>
          <button onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === 'transactions' ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            <ArrowLeftRight size={16} /> লেনদেন
            <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">{transactions.length}</span>
          </button>
        </div>

        {/* Asset Form Modal */}
        {showAssetForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setShowAssetForm(false); resetAssetForm() }} />
            <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-foreground">{editingId ? 'সম্পদ সম্পাদনা' : 'নতুন সম্পদ যুক্ত'}</h2>
                <button onClick={() => { setShowAssetForm(false); resetAssetForm() }} className="rounded-full p-2 hover:bg-muted"><X size={18} /></button>
              </div>
              <form onSubmit={handleAssetSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">নাম (বাংলা) *</label>
                  <input required value={assetForm.nameBn || ''} onChange={e => setAssetForm(f => ({ ...f, nameBn: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" placeholder="যেমন: কম্পিউটার" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Name (English) *</label>
                  <input required value={assetForm.name} onChange={e => setAssetForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" placeholder="e.g. Desktop Computer" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">বিবরণ</label>
                  <textarea value={assetForm.description} onChange={e => setAssetForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">ধরন *</label>
                  <select required value={assetForm.type} onChange={e => setAssetForm(f => ({ ...f, type: e.target.value as AssetType }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                    <option value="Movable">অস্থাবর (Movable)</option>
                    <option value="Immovable">স্থাবর (Immovable)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">শ্রেণী / Category *</label>
                  <select required value={assetForm.category} onChange={e => setAssetForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">অবস্থা</label>
                  <select value={assetForm.status} onChange={e => setAssetForm(f => ({ ...f, status: e.target.value as AssetStatus }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                    {(Object.keys(STATUS_LABELS) as AssetStatus[]).map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">ক্রয়ের তারিখ *</label>
                  <input required type="date" value={assetForm.purchaseDate} onChange={e => setAssetForm(f => ({ ...f, purchaseDate: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">ক্রয় মূল্য (৳) *</label>
                  <input required type="number" min="0" value={assetForm.purchasePrice || ''}
                    onChange={e => setAssetForm(f => ({ ...f, purchasePrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">বর্তমান মূল্য (৳)</label>
                  <input type="number" min="0" value={assetForm.currentValue || ''}
                    onChange={e => setAssetForm(f => ({ ...f, currentValue: parseFloat(e.target.value) || undefined }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">অবস্থান *</label>
                  <input required value={assetForm.location} onChange={e => setAssetForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    placeholder="যেমন: মূল ভবন, ৩য় তলা" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">দায়িত্বপ্রাপ্ত বিভাগ</label>
                  <input value={assetForm.assignedDepartment || ''} onChange={e => setAssetForm(f => ({ ...f, assignedDepartment: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    placeholder="বিভাগের নাম" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">সিরিয়াল নম্বর</label>
                  <input value={assetForm.serialNumber || ''} onChange={e => setAssetForm(f => ({ ...f, serialNumber: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">ওয়ারেন্টি মেয়াদ</label>
                  <input type="date" value={assetForm.warrantyExpiry || ''} onChange={e => setAssetForm(f => ({ ...f, warrantyExpiry: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">নোট</label>
                  <textarea value={assetForm.note || ''} onChange={e => setAssetForm(f => ({ ...f, note: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" rows={2} />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowAssetForm(false); resetAssetForm() }}
                    className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted">বাতিল</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                    {editingId ? 'আপডেট' : 'যুক্ত করুন'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transaction Form Modal */}
        {showTxForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowTxForm(false)} />
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-foreground">লেনদেন যুক্ত করুন</h2>
                <button onClick={() => setShowTxForm(false)} className="rounded-full p-2 hover:bg-muted"><X size={18} /></button>
              </div>
              <form onSubmit={handleTxSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">সম্পদ নির্বাচন *</label>
                  <select required value={txForm.assetId} onChange={e => setTxForm(f => ({ ...f, assetId: parseInt(e.target.value) }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                    <option value={0}>-- সম্পদ নির্বাচন করুন --</option>
                    {assets.map(a => <option key={a.assetId} value={a.assetId}>{a.nameBn || a.name} ({a.assetCode})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">লেনদেনের ধরন *</label>
                  <select value={txForm.transactionType} onChange={e => setTxForm(f => ({ ...f, transactionType: e.target.value as AssetTransactionType }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                    {(Object.keys(TX_LABELS) as AssetTransactionType[]).map(t => (
                      <option key={t} value={t}>{TX_LABELS[t]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">তারিখ *</label>
                  <input required type="date" value={txForm.date} onChange={e => setTxForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">পরিমাণ (৳)</label>
                  <input type="number" min="0" value={txForm.amount} onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" placeholder="০.০০" />
                </div>
                {(txForm.transactionType === 'Transfer') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">থেকে (বিভাগ)</label>
                      <input value={txForm.fromDepartment} onChange={e => setTxForm(f => ({ ...f, fromDepartment: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">যেখানে (বিভাগ)</label>
                      <input value={txForm.toDepartment} onChange={e => setTxForm(f => ({ ...f, toDepartment: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">নতুন অবস্থান</label>
                      <input value={txForm.toLocation} onChange={e => setTxForm(f => ({ ...f, toLocation: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                    </div>
                  </>
                )}
                {(txForm.transactionType === 'Repair' || txForm.transactionType === 'Purchase' || txForm.transactionType === 'Sale') && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">সরবরাহকারী / ঠিকাদার</label>
                    <input value={txForm.vendor} onChange={e => setTxForm(f => ({ ...f, vendor: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">অনুমোদনকারী</label>
                  <input value={txForm.approvedBy} onChange={e => setTxForm(f => ({ ...f, approvedBy: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">দলিল নম্বর</label>
                  <input value={txForm.documentReference} onChange={e => setTxForm(f => ({ ...f, documentReference: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">বিবরণ *</label>
                  <textarea required value={txForm.description} onChange={e => setTxForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" rows={2}
                    placeholder="লেনদেনের বিস্তারিত" />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowTxForm(false)}
                    className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted">বাতিল</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                    লেনদেন যুক্ত করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up">
            {/* Filters */}
            <div className="px-4 py-3 border-b border-border flex flex-wrap gap-3 items-center">
              <Filter size={16} className="text-muted-foreground" />
              <div className="flex gap-2">
                {(['All', 'Movable', 'Immovable'] as const).map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${typeFilter === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                    {t === 'All' ? 'সকল' : TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(STATUS_LABELS) as AssetStatus[]).map(s => (
                  <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === s ? STATUS_COLORS[s] + ' ring-2 ring-current ring-offset-1' : STATUS_COLORS[s]}`}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">কোড</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">নাম</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">ধরন</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">শ্রেণী</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">অবস্থা</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">অবস্থান</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">ক্রয় মূল্য</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAssets.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">কোনো সম্পদ পাওয়া যায়নি</td></tr>
                  ) : filteredAssets.map(a => (
                    <tr key={a.assetId} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{a.assetCode}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-foreground">{a.nameBn || a.name}</span>
                          {a.nameBn && <span className="text-xs text-muted-foreground">{a.name}</span>}
                          {a.serialNumber && <span className="text-[10px] text-muted-foreground">S/N: {a.serialNumber}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[a.type]}`}>
                          {TYPE_LABELS[a.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{a.category}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[a.status]}`}>
                          {STATUS_LABELS[a.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-[150px] truncate" title={a.location}>{a.location}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">৳{a.purchasePrice.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(a)}
                            className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300" title="সম্পাদনা">
                            <Edit3 size={14} />
                          </button>
                          {isAdminOrCentral && (
                            <button onClick={() => handleDeleteAsset(a.assetId)}
                              className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-rose-100 hover:text-rose-700 dark:bg-gray-800 dark:text-gray-400" title="মুছুন">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">তারিখ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">সম্পদ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">ধরন</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">পরিমাণ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">বিবরণ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">সরবরাহকারী</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">অনুমোদনকারী</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">কোনো লেনদেন নেই</td></tr>
                  ) : transactions.map(t => (
                    <tr key={t.transactionId} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{formatDateDMY(t.date)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{t.assetName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${TX_COLORS[t.transactionType]}`}>
                          {TX_ICONS[t.transactionType]} {TX_LABELS[t.transactionType]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">{t.amount > 0 ? `৳${t.amount.toLocaleString()}` : '—'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate" title={t.description}>{t.description}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{t.vendor || '—'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{t.approvedBy || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
