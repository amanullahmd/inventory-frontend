'use client'

import { useState, useMemo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import {
  OfficerService,
  Officer,
  OfficerLevel,
  OfficerDesignation,
  CreateOfficerRequest,
} from '@/lib/services/officerService'
import {
  UserCheck,
  Plus,
  X,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit3,
  Trash2,
} from 'lucide-react'

const LEVEL_TABS: { key: OfficerLevel | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'সকল' },
  { key: 'DPE_HQ', label: 'DPE সদর দপ্তর' },
  { key: 'DPEO', label: 'DPEO' },
  { key: 'UEO', label: 'UEO' },
  { key: 'FIELD', label: 'মাঠ পর্যায়' },
]

const LEVEL_COLORS: Record<OfficerLevel, string> = {
  DPE_HQ: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  DPEO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  UEO: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
  FIELD: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
}

const DESIGNATIONS: { value: OfficerDesignation; labelBn: string }[] = [
  { value: 'Director General', labelBn: 'মহাপরিচালক' },
  { value: 'Director', labelBn: 'পরিচালক' },
  { value: 'Deputy Director', labelBn: 'উপ-পরিচালক' },
  { value: 'DPEO', labelBn: 'জেলা প্রাথমিক শিক্ষা অফিসার' },
  { value: 'Assistant DPEO', labelBn: 'সহকারী জেলা প্রাথমিক শিক্ষা অফিসার' },
  { value: 'UEO', labelBn: 'উপজেলা শিক্ষা অফিসার' },
  { value: 'Assistant UEO', labelBn: 'সহকারী উপজেলা শিক্ষা অফিসার' },
  { value: 'AUEO', labelBn: 'সহকারী উপজেলা শিক্ষা অফিসার (মাঠ)' },
  { value: 'Other', labelBn: 'অন্যান্য' },
]

const LEVELS: { value: OfficerLevel; labelBn: string }[] = [
  { value: 'DPE_HQ', labelBn: 'ডিপিই সদর দপ্তর' },
  { value: 'DPEO', labelBn: 'জেলা প্রাথমিক শিক্ষা অফিস' },
  { value: 'UEO', labelBn: 'উপজেলা শিক্ষা অফিস' },
  { value: 'FIELD', labelBn: 'মাঠ পর্যায়' },
]

const emptyForm = (): CreateOfficerRequest => ({
  name: '',
  nameBn: '',
  designation: 'Other',
  designationBn: '',
  level: 'DPE_HQ',
  district: '',
  districtBn: '',
  upazila: '',
  upazilaBn: '',
  officeAddress: '',
  mobileNumber: '',
  email: '',
  joiningDate: '',
  postingDate: '',
  bcsSession: '',
})

export default function OfficersPage() {
  const { data: session, status } = useSession()
  const [officers, setOfficers] = useState<Officer[]>(OfficerService.getOfficers())
  const [activeTab, setActiveTab] = useState<OfficerLevel | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<CreateOfficerRequest>(emptyForm())

  const filteredOfficers = useMemo(() => {
    let result = officers
    if (activeTab !== 'ALL') {
      result = result.filter((o) => o.level === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.nameBn.includes(q) ||
          o.designation.toLowerCase().includes(q) ||
          o.designationBn.includes(q) ||
          (o.district && o.district.toLowerCase().includes(q)) ||
          (o.districtBn && o.districtBn.includes(q)) ||
          (o.upazila && o.upazila.toLowerCase().includes(q)) ||
          (o.upazilaBn && o.upazilaBn.includes(q)) ||
          o.mobileNumber.includes(q)
      )
    }
    return result
  }, [officers, activeTab, searchQuery])

  const openCreate = useCallback(() => {
    setEditingId(null)
    setForm(emptyForm())
    setShowModal(true)
  }, [])

  const openEdit = useCallback((officer: Officer) => {
    setEditingId(officer.officerId)
    setForm({
      name: officer.name,
      nameBn: officer.nameBn,
      designation: officer.designation,
      designationBn: officer.designationBn,
      level: officer.level,
      district: officer.district || '',
      districtBn: officer.districtBn || '',
      upazila: officer.upazila || '',
      upazilaBn: officer.upazilaBn || '',
      officeAddress: officer.officeAddress,
      mobileNumber: officer.mobileNumber,
      email: officer.email || '',
      joiningDate: officer.joiningDate || '',
      postingDate: officer.postingDate || '',
      bcsSession: officer.bcsSession || '',
    })
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm())
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!form.name || !form.nameBn) return
      if (editingId) {
        OfficerService.updateOfficer(editingId, form)
      } else {
        OfficerService.createOfficer(form)
      }
      setOfficers(OfficerService.getOfficers())
      closeModal()
    },
    [form, editingId, closeModal]
  )

  const handleDelete = useCallback(
    (id: number) => {
      OfficerService.deleteOfficer(id)
      setOfficers(OfficerService.getOfficers())
      closeModal()
    },
    [closeModal]
  )

  const handleDesignationChange = useCallback(
    (value: OfficerDesignation) => {
      const match = DESIGNATIONS.find((d) => d.value === value)
      setForm((prev) => ({
        ...prev,
        designation: value,
        designationBn: match ? match.labelBn : prev.designationBn,
      }))
    },
    []
  )

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Please sign in to view officers.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-down">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-primary" />
              কর্মকর্তা তথ্য / Officers
            </h1>
            <p className="mt-2 text-muted-foreground">
              DPE এবং মাঠ পর্যায়ের কর্মকর্তাদের তথ্যাদি
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="font-medium">নতুন কর্মকর্তা</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 animate-slide-up">
          {LEVEL_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '30ms' }}>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="নাম, জেলা বা পদবী দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Officer cards grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up"
          style={{ animationDelay: '50ms' }}
        >
          {filteredOfficers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              কোনো কর্মকর্তা পাওয়া যায়নি
            </div>
          ) : (
            filteredOfficers.map((officer) => (
              <div
                key={officer.officerId}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          officer.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        title={officer.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      />
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {officer.nameBn}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{officer.name}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button
                      onClick={() => openEdit(officer)}
                      className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="সম্পাদনা"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(officer.officerId)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {officer.designationBn}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      LEVEL_COLORS[officer.level]
                    }`}
                  >
                    {OfficerService.getLevelLabel(officer.level)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-sm">
                  {(officer.districtBn || officer.upazilaBn) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span>
                        {officer.upazilaBn && `${officer.upazilaBn}, `}
                        {officer.districtBn}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={14} className="flex-shrink-0" />
                    <span>{officer.mobileNumber}</span>
                  </div>
                  {officer.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={14} className="flex-shrink-0" />
                      <span className="truncate">{officer.email}</span>
                    </div>
                  )}
                  {officer.postingDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={14} className="flex-shrink-0" />
                      <span>পদায়ন: {officer.postingDate}</span>
                    </div>
                  )}
                  {officer.bcsSession && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UserCheck size={14} className="flex-shrink-0" />
                      <span>BCS: {officer.bcsSession}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-xl">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-semibold text-foreground">
                {editingId ? 'কর্মকর্তা সম্পাদনা' : 'নতুন কর্মকর্তা যোগ করুন'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  Name (English)
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  নাম (বাংলা)
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.nameBn}
                  onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  পদবী (Designation)
                </label>
                <select
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.designation}
                  onChange={(e) =>
                    handleDesignationChange(e.target.value as OfficerDesignation)
                  }
                >
                  {DESIGNATIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.labelBn} ({d.value})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  স্তর (Level)
                </label>
                <select
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.level}
                  onChange={(e) =>
                    setForm({ ...form, level: e.target.value as OfficerLevel })
                  }
                >
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.labelBn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  জেলা (District)
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="e.g. Dhaka"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  জেলা (বাংলা)
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.districtBn}
                  onChange={(e) => setForm({ ...form, districtBn: e.target.value })}
                  placeholder="যেমন: ঢাকা"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  উপজেলা (Upazila)
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.upazila}
                  onChange={(e) => setForm({ ...form, upazila: e.target.value })}
                  placeholder="e.g. Savar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  উপজেলা (বাংলা)
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.upazilaBn}
                  onChange={(e) => setForm({ ...form, upazilaBn: e.target.value })}
                  placeholder="যেমন: সাভার"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  অফিসের ঠিকানা
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.officeAddress}
                  onChange={(e) => setForm({ ...form, officeAddress: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.mobileNumber}
                  onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  ইমেইল
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  যোগদানের তারিখ
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.joiningDate}
                  onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  পদায়নের তারিখ
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.postingDate}
                  onChange={(e) => setForm({ ...form, postingDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  BCS ব্যাচ
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={form.bcsSession}
                  onChange={(e) => setForm({ ...form, bcsSession: e.target.value })}
                  placeholder="e.g. 36th"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t border-border mt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingId)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={16} />
                    মুছুন
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {editingId ? 'সংরক্ষণ করুন' : 'যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
