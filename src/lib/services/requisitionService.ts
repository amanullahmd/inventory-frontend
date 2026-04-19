export type RequisitionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PARTIALLY_FULFILLED' | 'FULFILLED' | 'REJECTED'

export interface RequisitionItem {
  requisitionItemId: number
  itemId: number
  itemName: string
  sku: string
  requestedQuantity: number
  approvedQuantity?: number
  unitPrice?: number
  totalPrice?: number
}

export interface Requisition {
  requisitionId: number
  requisitionCode: string
  requisitionDate: string
  department: string
  requestedBy: string
  requestedByDesignation: string
  approvedBy?: string
  approvedAt?: string
  status: RequisitionStatus
  purpose: string
  fiscalYear: string
  budgetHead?: string
  items: RequisitionItem[]
  totalAmount: number
  note?: string
  rejectionReason?: string
  createdAt: string
  updatedAt?: string
}

const MOCK_REQUISITIONS: Requisition[] = [
  {
    requisitionId: 1,
    requisitionCode: 'REQ-2026-001',
    requisitionDate: '2026-01-15',
    department: 'প্রাথমিক শিক্ষা অধিদপ্তর',
    requestedBy: 'মোঃ আব্দুল করিম',
    requestedByDesignation: 'উপপরিচালক',
    approvedBy: 'মোঃ রফিকুল ইসলাম',
    approvedAt: '2026-01-18T10:30:00Z',
    status: 'APPROVED',
    purpose: 'অফিস স্টেশনারি সরবরাহ',
    fiscalYear: '2025-2026',
    budgetHead: 'স্টেশনারি ও অফিস সরঞ্জাম',
    items: [
      { requisitionItemId: 1, itemId: 101, itemName: 'A4 Paper (500 Sheets)', sku: 'PAPER-A4-500', requestedQuantity: 50, approvedQuantity: 50, unitPrice: 450, totalPrice: 22500 },
      { requisitionItemId: 2, itemId: 102, itemName: 'Printer Ink (Black)', sku: 'INK-BLK-001', requestedQuantity: 10, approvedQuantity: 10, unitPrice: 1200, totalPrice: 12000 },
      { requisitionItemId: 3, itemId: 103, itemName: 'Ball Pen (Blue)', sku: 'PEN-BLU-050', requestedQuantity: 100, approvedQuantity: 100, unitPrice: 15, totalPrice: 1500 },
    ],
    totalAmount: 36000,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-18T10:30:00Z',
  },
  {
    requisitionId: 2,
    requisitionCode: 'REQ-2026-002',
    requisitionDate: '2026-02-05',
    department: 'ঢাকা বিভাগীয় কার্যালয়',
    requestedBy: 'ফাতেমা বেগম',
    requestedByDesignation: 'সহকারী পরিচালক',
    status: 'SUBMITTED',
    purpose: 'কম্পিউটার ও আইটি সরঞ্জাম ক্রয়',
    fiscalYear: '2025-2026',
    budgetHead: 'মূলধন ব্যয় - যন্ত্রপাতি',
    items: [
      { requisitionItemId: 4, itemId: 104, itemName: 'Desktop Computer', sku: 'PC-DESK-001', requestedQuantity: 5, unitPrice: 45000, totalPrice: 225000 },
      { requisitionItemId: 5, itemId: 105, itemName: 'Laser Printer', sku: 'PRT-LSR-001', requestedQuantity: 2, unitPrice: 28000, totalPrice: 56000 },
    ],
    totalAmount: 281000,
    createdAt: '2026-02-05T11:00:00Z',
  },
  {
    requisitionId: 3,
    requisitionCode: 'REQ-2026-003',
    requisitionDate: '2026-02-20',
    department: 'চট্টগ্রাম জেলা প্রাথমিক শিক্ষা অফিস',
    requestedBy: 'মোঃ শাহিন আলম',
    requestedByDesignation: 'জেলা প্রাথমিক শিক্ষা অফিসার',
    status: 'DRAFT',
    purpose: 'অফিস আসবাবপত্র সংগ্রহ',
    fiscalYear: '2025-2026',
    budgetHead: 'আসবাবপত্র ক্রয়',
    items: [
      { requisitionItemId: 6, itemId: 106, itemName: 'Office Chair (Executive)', sku: 'CHR-EXC-001', requestedQuantity: 10, unitPrice: 8500, totalPrice: 85000 },
      { requisitionItemId: 7, itemId: 107, itemName: 'Office Desk (Standard)', sku: 'DSK-STD-001', requestedQuantity: 10, unitPrice: 12000, totalPrice: 120000 },
      { requisitionItemId: 8, itemId: 108, itemName: 'File Cabinet (Steel)', sku: 'CAB-STL-001', requestedQuantity: 5, unitPrice: 15000, totalPrice: 75000 },
    ],
    totalAmount: 280000,
    note: 'নতুন অফিস ভবনে স্থানান্তরের জন্য প্রয়োজন',
    createdAt: '2026-02-20T08:30:00Z',
  },
  {
    requisitionId: 4,
    requisitionCode: 'REQ-2026-004',
    requisitionDate: '2026-03-10',
    department: 'রাজশাহী বিভাগীয় কার্যালয়',
    requestedBy: 'নাজমুল হাসান',
    requestedByDesignation: 'বিভাগীয় উপপরিচালক',
    approvedBy: 'মোঃ রফিকুল ইসলাম',
    approvedAt: '2026-03-12T14:00:00Z',
    status: 'PARTIALLY_FULFILLED',
    purpose: 'বিদ্যালয় পরিদর্শন সরঞ্জাম',
    fiscalYear: '2025-2026',
    budgetHead: 'পরিদর্শন ও ভ্রমণ',
    items: [
      { requisitionItemId: 9, itemId: 109, itemName: 'Laptop Computer', sku: 'LAP-DEL-001', requestedQuantity: 3, approvedQuantity: 3, unitPrice: 65000, totalPrice: 195000 },
      { requisitionItemId: 10, itemId: 110, itemName: 'Portable Projector', sku: 'PRJ-PRT-001', requestedQuantity: 2, approvedQuantity: 1, unitPrice: 35000, totalPrice: 35000 },
    ],
    totalAmount: 230000,
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-12T14:00:00Z',
  },
  {
    requisitionId: 5,
    requisitionCode: 'REQ-2026-005',
    requisitionDate: '2026-03-25',
    department: 'খুলনা জেলা প্রাথমিক শিক্ষা অফিস',
    requestedBy: 'রুমানা আক্তার',
    requestedByDesignation: 'সহকারী জেলা প্রাথমিক শিক্ষা অফিসার',
    status: 'REJECTED',
    purpose: 'এয়ার কন্ডিশনার ক্রয়',
    fiscalYear: '2025-2026',
    budgetHead: 'মূলধন ব্যয় - যন্ত্রপাতি',
    items: [
      { requisitionItemId: 11, itemId: 111, itemName: 'Split AC (2 Ton)', sku: 'AC-SPL-2T', requestedQuantity: 4, unitPrice: 55000, totalPrice: 220000 },
    ],
    totalAmount: 220000,
    rejectionReason: 'বাজেট বরাদ্দ অপর্যাপ্ত, পরবর্তী অর্থবছরে পুনরায় আবেদন করুন',
    createdAt: '2026-03-25T09:15:00Z',
    updatedAt: '2026-03-28T16:00:00Z',
  },
  {
    requisitionId: 6,
    requisitionCode: 'REQ-2025-018',
    requisitionDate: '2025-11-10',
    department: 'সিলেট বিভাগীয় কার্যালয়',
    requestedBy: 'তানভীর আহমেদ',
    requestedByDesignation: 'হিসাবরক্ষক',
    approvedBy: 'ড. সালমা আক্তার',
    approvedAt: '2025-11-15T11:00:00Z',
    status: 'FULFILLED',
    purpose: 'বার্ষিক স্টেশনারি সরবরাহ',
    fiscalYear: '2024-2025',
    budgetHead: 'স্টেশনারি ও অফিস সরঞ্জাম',
    items: [
      { requisitionItemId: 12, itemId: 101, itemName: 'A4 Paper (500 Sheets)', sku: 'PAPER-A4-500', requestedQuantity: 100, approvedQuantity: 100, unitPrice: 420, totalPrice: 42000 },
      { requisitionItemId: 13, itemId: 112, itemName: 'Toner Cartridge (HP)', sku: 'TNR-HP-26A', requestedQuantity: 8, approvedQuantity: 8, unitPrice: 3500, totalPrice: 28000 },
      { requisitionItemId: 14, itemId: 113, itemName: 'Stapler (Heavy Duty)', sku: 'STP-HD-001', requestedQuantity: 5, approvedQuantity: 5, unitPrice: 650, totalPrice: 3250 },
    ],
    totalAmount: 73250,
    createdAt: '2025-11-10T08:00:00Z',
    updatedAt: '2025-12-01T09:00:00Z',
  },
  {
    requisitionId: 7,
    requisitionCode: 'REQ-2025-019',
    requisitionDate: '2025-12-05',
    department: 'বরিশাল জেলা প্রাথমিক শিক্ষা অফিস',
    requestedBy: 'মোঃ জাহিদ হাসান',
    requestedByDesignation: 'উপজেলা শিক্ষা অফিসার',
    approvedBy: 'মোঃ রফিকুল ইসলাম',
    approvedAt: '2025-12-10T15:30:00Z',
    status: 'FULFILLED',
    purpose: 'পরীক্ষার উপকরণ সরবরাহ',
    fiscalYear: '2024-2025',
    budgetHead: 'পরীক্ষা পরিচালনা',
    items: [
      { requisitionItemId: 15, itemId: 114, itemName: 'Answer Sheet (100 pcs)', sku: 'ANS-SHT-100', requestedQuantity: 200, approvedQuantity: 200, unitPrice: 250, totalPrice: 50000 },
      { requisitionItemId: 16, itemId: 115, itemName: 'Exam Pad', sku: 'EXM-PAD-001', requestedQuantity: 500, approvedQuantity: 500, unitPrice: 30, totalPrice: 15000 },
    ],
    totalAmount: 65000,
    createdAt: '2025-12-05T10:00:00Z',
    updatedAt: '2025-12-20T12:00:00Z',
  },
  {
    requisitionId: 8,
    requisitionCode: 'REQ-2026-006',
    requisitionDate: '2026-04-01',
    department: 'ময়মনসিংহ বিভাগীয় কার্যালয়',
    requestedBy: 'সাবিনা ইয়াসমিন',
    requestedByDesignation: 'প্রশাসনিক কর্মকর্তা',
    status: 'SUBMITTED',
    purpose: 'নেটওয়ার্কিং ও আইটি অবকাঠামো উন্নয়ন',
    fiscalYear: '2025-2026',
    budgetHead: 'মূলধন ব্যয় - আইটি',
    items: [
      { requisitionItemId: 17, itemId: 116, itemName: 'Network Switch (24-port)', sku: 'NET-SW-24P', requestedQuantity: 2, unitPrice: 18000, totalPrice: 36000 },
      { requisitionItemId: 18, itemId: 117, itemName: 'UPS (1000VA)', sku: 'UPS-1KVA-01', requestedQuantity: 10, unitPrice: 6500, totalPrice: 65000 },
      { requisitionItemId: 19, itemId: 118, itemName: 'LAN Cable (Cat6, 305m)', sku: 'LAN-C6-305', requestedQuantity: 3, unitPrice: 4500, totalPrice: 13500 },
    ],
    totalAmount: 114500,
    note: 'জরুরি ভিত্তিতে প্রয়োজন - বিদ্যমান সরঞ্জাম নষ্ট হয়ে গেছে',
    createdAt: '2026-04-01T07:45:00Z',
  },
  {
    requisitionId: 9,
    requisitionCode: 'REQ-2026-007',
    requisitionDate: '2026-04-10',
    department: 'রংপুর জেলা প্রাথমিক শিক্ষা অফিস',
    requestedBy: 'আনোয়ার হোসেন',
    requestedByDesignation: 'জেলা প্রাথমিক শিক্ষা অফিসার',
    status: 'DRAFT',
    purpose: 'অফিস পরিষ্কার-পরিচ্ছন্নতা সামগ্রী',
    fiscalYear: '2025-2026',
    budgetHead: 'আনুষঙ্গিক ব্যয়',
    items: [
      { requisitionItemId: 20, itemId: 119, itemName: 'Cleaning Supplies Kit', sku: 'CLN-KIT-001', requestedQuantity: 10, unitPrice: 1500, totalPrice: 15000 },
      { requisitionItemId: 21, itemId: 120, itemName: 'Hand Sanitizer (500ml)', sku: 'SAN-500ML', requestedQuantity: 50, unitPrice: 180, totalPrice: 9000 },
    ],
    totalAmount: 24000,
    createdAt: '2026-04-10T14:20:00Z',
  },
  {
    requisitionId: 10,
    requisitionCode: 'REQ-2026-008',
    requisitionDate: '2026-04-15',
    department: 'প্রাথমিক শিক্ষা অধিদপ্তর',
    requestedBy: 'শামীমা নাসরীন',
    requestedByDesignation: 'পরিচালক (প্রশাসন)',
    status: 'SUBMITTED',
    purpose: 'সম্মেলন কক্ষ সরঞ্জাম',
    fiscalYear: '2025-2026',
    budgetHead: 'মূলধন ব্যয় - আসবাবপত্র',
    items: [
      { requisitionItemId: 22, itemId: 121, itemName: 'Conference Table (12-seat)', sku: 'TBL-CNF-12', requestedQuantity: 1, unitPrice: 85000, totalPrice: 85000 },
      { requisitionItemId: 23, itemId: 122, itemName: 'Conference Chair', sku: 'CHR-CNF-001', requestedQuantity: 12, unitPrice: 5500, totalPrice: 66000 },
      { requisitionItemId: 24, itemId: 123, itemName: 'Whiteboard (6x4 ft)', sku: 'WBD-6X4-001', requestedQuantity: 2, unitPrice: 4500, totalPrice: 9000 },
      { requisitionItemId: 25, itemId: 124, itemName: 'LED Projector', sku: 'PRJ-LED-001', requestedQuantity: 1, unitPrice: 55000, totalPrice: 55000 },
    ],
    totalAmount: 215000,
    note: 'নতুন সম্মেলন কক্ষ স্থাপনের জন্য',
    createdAt: '2026-04-15T11:30:00Z',
  },
]

export class RequisitionService {
  static getRequisitions(): Requisition[] {
    return [...MOCK_REQUISITIONS]
  }

  static getRequisition(id: number): Requisition | undefined {
    return MOCK_REQUISITIONS.find(r => r.requisitionId === id)
  }

  static createRequisition(data: Omit<Requisition, 'requisitionId' | 'requisitionCode' | 'createdAt'>): Requisition {
    const nextId = Math.max(...MOCK_REQUISITIONS.map(r => r.requisitionId)) + 1
    const year = new Date().getFullYear()
    const code = `REQ-${year}-${String(nextId).padStart(3, '0')}`
    const newRequisition: Requisition = {
      ...data,
      requisitionId: nextId,
      requisitionCode: code,
      createdAt: new Date().toISOString(),
    }
    MOCK_REQUISITIONS.unshift(newRequisition)
    return newRequisition
  }

  static updateRequisition(id: number, data: Partial<Requisition>): Requisition {
    const index = MOCK_REQUISITIONS.findIndex(r => r.requisitionId === id)
    if (index === -1) throw new Error('Requisition not found')
    const updated: Requisition = {
      ...MOCK_REQUISITIONS[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    MOCK_REQUISITIONS[index] = updated
    return updated
  }

  static deleteRequisition(id: number): void {
    const index = MOCK_REQUISITIONS.findIndex(r => r.requisitionId === id)
    if (index === -1) throw new Error('Requisition not found')
    MOCK_REQUISITIONS.splice(index, 1)
  }

  static getStatusCounts(): Record<RequisitionStatus, number> {
    const counts: Record<RequisitionStatus, number> = {
      DRAFT: 0,
      SUBMITTED: 0,
      APPROVED: 0,
      PARTIALLY_FULFILLED: 0,
      FULFILLED: 0,
      REJECTED: 0,
    }
    for (const r of MOCK_REQUISITIONS) {
      counts[r.status]++
    }
    return counts
  }
}
