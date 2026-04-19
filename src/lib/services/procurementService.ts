export type ProcurementMethod = 'OTM' | 'LTM' | 'RFQ' | 'DIRECT'

export type ProcurementStatus =
  | 'INITIATED'
  | 'COMMITTEE_FORMED'
  | 'TENDER_PUBLISHED'
  | 'BID_RECEIVED'
  | 'EVALUATED'
  | 'APPROVED'
  | 'CONTRACT_AWARDED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'

export interface ProcurementCommitteeMember {
  name: string
  designation: string
  role: 'Chairman' | 'Member' | 'Member Secretary'
}

export interface Procurement {
  procurementId: number
  procurementCode: string
  title: string
  description: string
  method: ProcurementMethod
  status: ProcurementStatus
  estimatedAmount: number
  approvedAmount?: number
  budgetHead: string
  fiscalYear: string
  requisitionCode?: string
  committee?: ProcurementCommitteeMember[]
  tenderNoticeDate?: string
  tenderClosingDate?: string
  supplierName?: string
  contractNumber?: string
  deliveryDate?: string
  note?: string
  createdBy: string
  createdAt: string
  updatedAt?: string
}

export interface CreateProcurementRequest {
  title: string
  description: string
  estimatedAmount: number
  budgetHead: string
  fiscalYear: string
  requisitionCode?: string
  committee?: ProcurementCommitteeMember[]
  note?: string
}

const STORAGE_KEY = 'dpe_local_procurements'

const MOCK_PROCUREMENTS: Procurement[] = [
  {
    procurementId: 1,
    procurementCode: 'PROC-2026-001',
    title: 'কম্পিউটার ও প্রিন্টার ক্রয়',
    description: 'পরিকল্পনা বিভাগের জন্য ডেস্কটপ কম্পিউটার ও লেজার প্রিন্টার ক্রয়',
    method: 'OTM',
    status: 'TENDER_PUBLISHED',
    estimatedAmount: 1200000,
    budgetHead: '4711-অফিস যন্ত্রপাতি',
    fiscalYear: '2025-2026',
    requisitionCode: 'REQ-2026-012',
    committee: [
      { name: 'জনাব মোঃ আব্দুল করিম', designation: 'পরিচালক', role: 'Chairman' },
      { name: 'জনাব ফারহানা আক্তার', designation: 'উপপরিচালক', role: 'Member' },
      { name: 'জনাব সাইফুল ইসলাম', designation: 'সহকারী পরিচালক', role: 'Member Secretary' },
    ],
    tenderNoticeDate: '2026-03-15',
    tenderClosingDate: '2026-04-15',
    createdBy: 'মোঃ আব্দুল করিম',
    createdAt: '2026-03-10T09:00:00.000Z',
    updatedAt: '2026-03-15T10:30:00.000Z',
  },
  {
    procurementId: 2,
    procurementCode: 'PROC-2026-002',
    title: 'অফিস আসবাবপত্র ক্রয়',
    description: 'নতুন কার্যালয়ের জন্য টেবিল, চেয়ার ও আলমারি ক্রয়',
    method: 'RFQ',
    status: 'BID_RECEIVED',
    estimatedAmount: 250000,
    budgetHead: '4711-আসবাবপত্র',
    fiscalYear: '2025-2026',
    requisitionCode: 'REQ-2026-008',
    committee: [
      { name: 'জনাব নাজমুল হক', designation: 'উপপরিচালক', role: 'Chairman' },
      { name: 'জনাব রাশেদা বেগম', designation: 'সহকারী পরিচালক', role: 'Member' },
      { name: 'জনাব তানভীর আহমেদ', designation: 'প্রশাসনিক কর্মকর্তা', role: 'Member Secretary' },
    ],
    tenderNoticeDate: '2026-03-01',
    tenderClosingDate: '2026-03-25',
    supplierName: 'ঢাকা ফার্নিচার হাউস',
    createdBy: 'নাজমুল হক',
    createdAt: '2026-02-25T08:00:00.000Z',
    updatedAt: '2026-03-26T11:00:00.000Z',
  },
  {
    procurementId: 3,
    procurementCode: 'PROC-2026-003',
    title: 'স্টেশনারি সামগ্রী ক্রয়',
    description: 'বার্ষিক স্টেশনারি সামগ্রী — কাগজ, কলম, ফাইল ইত্যাদি',
    method: 'DIRECT',
    status: 'COMPLETED',
    estimatedAmount: 35000,
    approvedAmount: 32500,
    budgetHead: '3211-অফিস সরবরাহ',
    fiscalYear: '2025-2026',
    supplierName: 'জনতা স্টেশনার্স',
    contractNumber: 'CON-2026-009',
    deliveryDate: '2026-02-20',
    createdBy: 'ফারহানা আক্তার',
    createdAt: '2026-02-01T07:30:00.000Z',
    updatedAt: '2026-02-20T14:00:00.000Z',
  },
  {
    procurementId: 4,
    procurementCode: 'PROC-2026-004',
    title: 'নেটওয়ার্ক সরঞ্জাম ক্রয়',
    description: 'অফিস নেটওয়ার্ক আপগ্রেডের জন্য রাউটার, সুইচ ও ক্যাবল ক্রয়',
    method: 'LTM',
    status: 'EVALUATED',
    estimatedAmount: 800000,
    budgetHead: '4711-তথ্যপ্রযুক্তি সরঞ্জাম',
    fiscalYear: '2025-2026',
    requisitionCode: 'REQ-2026-015',
    committee: [
      { name: 'জনাব শফিকুল ইসলাম', designation: 'পরিচালক (আইসিটি)', role: 'Chairman' },
      { name: 'জনাব মাহমুদা খাতুন', designation: 'প্রোগ্রামার', role: 'Member' },
      { name: 'জনাব আরিফুল হক', designation: 'সিস্টেম এনালিস্ট', role: 'Member Secretary' },
    ],
    tenderNoticeDate: '2026-02-20',
    tenderClosingDate: '2026-03-20',
    supplierName: 'টেকনো সলিউশন্স লিমিটেড',
    createdBy: 'শফিকুল ইসলাম',
    createdAt: '2026-02-15T09:00:00.000Z',
    updatedAt: '2026-03-22T16:00:00.000Z',
  },
  {
    procurementId: 5,
    procurementCode: 'PROC-2026-005',
    title: 'ফটোকপি মেশিন ক্রয়',
    description: 'কেন্দ্রীয় রেকর্ড রুমের জন্য হাই-স্পিড ফটোকপি মেশিন',
    method: 'RFQ',
    status: 'APPROVED',
    estimatedAmount: 350000,
    approvedAmount: 340000,
    budgetHead: '4711-অফিস যন্ত্রপাতি',
    fiscalYear: '2025-2026',
    requisitionCode: 'REQ-2026-005',
    committee: [
      { name: 'জনাব রফিকুল ইসলাম', designation: 'যুগ্ম সচিব', role: 'Chairman' },
      { name: 'জনাব নাসরিন সুলতানা', designation: 'উপসচিব', role: 'Member' },
      { name: 'জনাব কামরুজ্জামান', designation: 'সিনিয়র সহকারী সচিব', role: 'Member Secretary' },
    ],
    supplierName: 'ক্যানন বাংলাদেশ',
    contractNumber: 'CON-2026-003',
    createdBy: 'রফিকুল ইসলাম',
    createdAt: '2026-01-20T08:00:00.000Z',
    updatedAt: '2026-03-05T10:00:00.000Z',
  },
  {
    procurementId: 6,
    procurementCode: 'PROC-2026-006',
    title: 'এয়ার কন্ডিশনার ক্রয় ও স্থাপন',
    description: 'চতুর্থ তলার কনফারেন্স রুম ও অফিস কক্ষে এসি স্থাপন',
    method: 'OTM',
    status: 'INITIATED',
    estimatedAmount: 1500000,
    budgetHead: '4711-বৈদ্যুতিক সরঞ্জাম',
    fiscalYear: '2025-2026',
    createdBy: 'মোঃ জাহাঙ্গীর আলম',
    createdAt: '2026-04-01T09:30:00.000Z',
  },
  {
    procurementId: 7,
    procurementCode: 'PROC-2026-007',
    title: 'টোনার কার্টিজ ক্রয়',
    description: 'প্রিন্টার ও ফটোকপি মেশিনের জন্য টোনার কার্টিজ সরবরাহ',
    method: 'DIRECT',
    status: 'CONTRACT_AWARDED',
    estimatedAmount: 45000,
    approvedAmount: 43000,
    budgetHead: '3211-অফিস সরবরাহ',
    fiscalYear: '2025-2026',
    supplierName: 'প্রিন্ট সলিউশন',
    contractNumber: 'CON-2026-011',
    deliveryDate: '2026-04-30',
    createdBy: 'ফারহানা আক্তার',
    createdAt: '2026-03-20T07:00:00.000Z',
    updatedAt: '2026-04-05T12:00:00.000Z',
  },
  {
    procurementId: 8,
    procurementCode: 'PROC-2026-008',
    title: 'সিসিটিভি ক্যামেরা স্থাপন',
    description: 'ভবনের নিরাপত্তা নিশ্চিতকরণে সিসিটিভি ক্যামেরা ও ডিভিআর সিস্টেম ক্রয় ও স্থাপন',
    method: 'LTM',
    status: 'CANCELLED',
    estimatedAmount: 600000,
    budgetHead: '4711-নিরাপত্তা সরঞ্জাম',
    fiscalYear: '2025-2026',
    note: 'বাজেট পুনর্বিন্যাসের কারণে বাতিল',
    createdBy: 'শফিকুল ইসলাম',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-02-10T09:00:00.000Z',
  },
]

export class ProcurementService {
  private static getLocalProcurements(): Procurement[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PROCUREMENTS))
    return MOCK_PROCUREMENTS
  }

  private static saveLocalProcurements(procurements: Procurement[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(procurements))
  }

  static getProcurements(): Procurement[] {
    return this.getLocalProcurements().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  static getProcurement(id: number): Procurement | undefined {
    return this.getLocalProcurements().find((p) => p.procurementId === id)
  }

  static createProcurement(data: CreateProcurementRequest): Procurement {
    const local = this.getLocalProcurements()
    const nextId = local.length > 0 ? Math.max(...local.map((p) => p.procurementId)) + 1 : 1
    const codeNum = String(nextId).padStart(3, '0')
    const method = this.suggestMethod(data.estimatedAmount)

    const newProcurement: Procurement = {
      procurementId: nextId,
      procurementCode: `PROC-${data.fiscalYear.split('-')[0]}-${codeNum}`,
      title: data.title,
      description: data.description,
      method,
      status: 'INITIATED',
      estimatedAmount: data.estimatedAmount,
      budgetHead: data.budgetHead,
      fiscalYear: data.fiscalYear,
      requisitionCode: data.requisitionCode,
      committee: data.committee,
      note: data.note,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
    }

    const updated = [newProcurement, ...local]
    this.saveLocalProcurements(updated)
    return newProcurement
  }

  static updateProcurement(id: number, data: Partial<Procurement>): Procurement {
    const local = this.getLocalProcurements()
    const index = local.findIndex((p) => p.procurementId === id)
    if (index === -1) {
      throw new Error('Procurement not found')
    }

    const updated: Procurement = {
      ...local[index],
      ...data,
      procurementId: local[index].procurementId,
      procurementCode: local[index].procurementCode,
      createdBy: local[index].createdBy,
      createdAt: local[index].createdAt,
      updatedAt: new Date().toISOString(),
    }

    local[index] = updated
    this.saveLocalProcurements(local)
    return updated
  }

  static deleteProcurement(id: number): void {
    const local = this.getLocalProcurements()
    const filtered = local.filter((p) => p.procurementId !== id)
    this.saveLocalProcurements(filtered)
  }

  static getMethodLabel(method: ProcurementMethod): string {
    switch (method) {
      case 'OTM':
        return 'উন্মুক্ত দরপত্র (OTM)'
      case 'LTM':
        return 'সীমিত দরপত্র (LTM)'
      case 'RFQ':
        return 'দরপত্র আহ্বান (RFQ)'
      case 'DIRECT':
        return 'সরাসরি ক্রয়'
      default:
        return method
    }
  }

  static suggestMethod(amount: number): ProcurementMethod {
    if (amount > 5000000) return 'OTM'
    if (amount > 500000) return 'LTM'
    if (amount >= 50000) return 'RFQ'
    return 'DIRECT'
  }
}
