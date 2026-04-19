export type AssetType = 'Movable' | 'Immovable'
export type AssetStatus = 'Active' | 'Under_Repair' | 'Unusable' | 'Transferred' | 'Disposed' | 'Auctioned'
export type AssetTransactionType = 'Purchase' | 'Sale' | 'Repair' | 'Transfer'

export interface Asset {
  assetId: number
  assetCode: string
  name: string
  nameBn?: string
  description: string
  type: AssetType
  category: string
  status: AssetStatus
  purchaseDate: string
  purchasePrice: number
  currentValue?: number
  location: string
  assignedTo?: string
  assignedDepartment?: string
  warrantyExpiry?: string
  lastMaintenanceDate?: string
  serialNumber?: string
  note?: string
  createdAt: string
  updatedAt?: string
}

export interface AssetTransaction {
  transactionId: number
  assetId: number
  assetName: string
  transactionType: AssetTransactionType
  date: string
  amount: number
  fromLocation?: string
  toLocation?: string
  fromDepartment?: string
  toDepartment?: string
  vendor?: string
  description: string
  approvedBy?: string
  documentReference?: string
  createdAt: string
}

const MOCK_ASSETS: Asset[] = [
  {
    assetId: 1,
    assetCode: 'AST-2026-001',
    name: 'Computer',
    nameBn: 'কম্পিউটার',
    description: 'Dell OptiPlex 7090 Desktop Computer with monitor',
    type: 'Movable',
    category: 'Electronics',
    status: 'Active',
    purchaseDate: '2024-03-15',
    purchasePrice: 85000,
    currentValue: 68000,
    location: 'প্রধান কার্যালয়, ঢাকা',
    assignedTo: 'মো. রহিম উদ্দিন',
    assignedDepartment: 'আইসিটি শাখা',
    warrantyExpiry: '2027-03-15',
    lastMaintenanceDate: '2025-12-10',
    serialNumber: 'DL-OPT-7090-0451',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2025-12-10T14:00:00Z',
  },
  {
    assetId: 2,
    assetCode: 'AST-2026-002',
    name: 'Printer',
    nameBn: 'প্রিন্টার',
    description: 'HP LaserJet Pro MFP M428fdw Multifunction Printer',
    type: 'Movable',
    category: 'Electronics',
    status: 'Active',
    purchaseDate: '2024-05-20',
    purchasePrice: 45000,
    currentValue: 38000,
    location: 'প্রধান কার্যালয়, ঢাকা',
    assignedTo: 'ফাতেমা বেগম',
    assignedDepartment: 'প্রশাসন শাখা',
    warrantyExpiry: '2026-05-20',
    lastMaintenanceDate: '2026-01-15',
    serialNumber: 'HP-LJ-M428-1122',
    createdAt: '2024-05-20T09:00:00Z',
    updatedAt: '2026-01-15T11:00:00Z',
  },
  {
    assetId: 3,
    assetCode: 'AST-2026-003',
    name: 'Photocopier',
    nameBn: 'ফটোকপি মেশিন',
    description: 'Canon imageRUNNER ADVANCE DX C3826i Color Copier',
    type: 'Movable',
    category: 'Electronics',
    status: 'Under_Repair',
    purchaseDate: '2023-08-10',
    purchasePrice: 250000,
    currentValue: 180000,
    location: 'আঞ্চলিক কার্যালয়, চট্টগ্রাম',
    assignedDepartment: 'প্রশাসন শাখা',
    warrantyExpiry: '2026-08-10',
    lastMaintenanceDate: '2026-03-20',
    serialNumber: 'CN-IR-DX3826-0087',
    note: 'ড্রাম ইউনিট প্রতিস্থাপন প্রয়োজন',
    createdAt: '2023-08-10T10:00:00Z',
    updatedAt: '2026-03-20T09:00:00Z',
  },
  {
    assetId: 4,
    assetCode: 'AST-2026-004',
    name: 'Office Chair',
    nameBn: 'অফিস চেয়ার',
    description: 'Executive Revolving Chair with armrest — High back',
    type: 'Movable',
    category: 'Furniture',
    status: 'Active',
    purchaseDate: '2024-01-05',
    purchasePrice: 18000,
    currentValue: 14000,
    location: 'প্রধান কার্যালয়, ঢাকা',
    assignedTo: 'জনাব আব্দুল করিম',
    assignedDepartment: 'পরিকল্পনা শাখা',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    assetId: 5,
    assetCode: 'AST-2026-005',
    name: 'Almira/Cabinet',
    nameBn: 'আলমিরা',
    description: 'Steel Almira 6ft x 3ft — 4 shelf with lock',
    type: 'Movable',
    category: 'Furniture',
    status: 'Active',
    purchaseDate: '2023-06-12',
    purchasePrice: 22000,
    currentValue: 18000,
    location: 'আঞ্চলিক কার্যালয়, রাজশাহী',
    assignedDepartment: 'হিসাব শাখা',
    createdAt: '2023-06-12T10:00:00Z',
  },
  {
    assetId: 6,
    assetCode: 'AST-2026-006',
    name: 'Air Conditioner',
    nameBn: 'এয়ার কন্ডিশনার',
    description: 'Gree 2 Ton Split AC — Inverter model',
    type: 'Movable',
    category: 'Electronics',
    status: 'Unusable',
    purchaseDate: '2021-04-18',
    purchasePrice: 95000,
    currentValue: 25000,
    location: 'প্রধান কার্যালয়, ঢাকা',
    assignedDepartment: 'সম্মেলন কক্ষ',
    warrantyExpiry: '2024-04-18',
    lastMaintenanceDate: '2025-11-05',
    serialNumber: 'GR-SPL-2T-3344',
    note: 'কম্প্রেসর নষ্ট — নিলামে বিক্রয়ের জন্য প্রস্তাবিত',
    createdAt: '2021-04-18T10:00:00Z',
    updatedAt: '2025-11-05T10:00:00Z',
  },
  {
    assetId: 7,
    assetCode: 'AST-2026-007',
    name: 'Vehicle',
    nameBn: 'গাড়ী',
    description: 'Toyota Hiace Microbus — 15 Seater',
    type: 'Movable',
    category: 'Vehicle',
    status: 'Active',
    purchaseDate: '2022-11-01',
    purchasePrice: 4500000,
    currentValue: 3200000,
    location: 'প্রধান কার্যালয়, ঢাকা',
    assignedTo: 'ড্রাইভার: মো. জাহিদ',
    assignedDepartment: 'পরিবহন শাখা',
    lastMaintenanceDate: '2026-02-28',
    serialNumber: 'DHA-11-2034',
    createdAt: '2022-11-01T10:00:00Z',
    updatedAt: '2026-02-28T10:00:00Z',
  },
  {
    assetId: 8,
    assetCode: 'AST-2026-008',
    name: 'Office Building',
    nameBn: 'অফিস ভবন',
    description: 'প্রাথমিক শিক্ষা অধিদপ্তর প্রধান কার্যালয় ভবন — ৬ তলা',
    type: 'Immovable',
    category: 'Building',
    status: 'Active',
    purchaseDate: '2010-01-01',
    purchasePrice: 50000000,
    currentValue: 120000000,
    location: 'মিরপুর-২, ঢাকা-১২১৬',
    assignedDepartment: 'প্রশাসন শাখা',
    note: 'সরকারি বরাদ্দকৃত ভবন',
    createdAt: '2010-01-01T10:00:00Z',
    updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    assetId: 9,
    assetCode: 'AST-2026-009',
    name: 'Warehouse',
    nameBn: 'গুদাম ঘর',
    description: 'কেন্দ্রীয় মালামাল গুদাম — মিরপুর শাখা',
    type: 'Immovable',
    category: 'Building',
    status: 'Active',
    purchaseDate: '2015-07-15',
    purchasePrice: 8000000,
    currentValue: 12000000,
    location: 'মিরপুর-১০, ঢাকা',
    assignedDepartment: 'ভান্ডার শাখা',
    createdAt: '2015-07-15T10:00:00Z',
  },
  {
    assetId: 10,
    assetCode: 'AST-2026-010',
    name: 'Land',
    nameBn: 'জমি',
    description: 'আঞ্চলিক কার্যালয়ের জন্য বরাদ্দকৃত জমি — ১.৫ একর',
    type: 'Immovable',
    category: 'Land',
    status: 'Active',
    purchaseDate: '2008-03-20',
    purchasePrice: 15000000,
    currentValue: 45000000,
    location: 'রাজশাহী সদর',
    assignedDepartment: 'প্রশাসন শাখা',
    note: 'সরকারি খাস জমি — মন্ত্রণালয় কর্তৃক বরাদ্দ',
    createdAt: '2008-03-20T10:00:00Z',
  },
  {
    assetId: 11,
    assetCode: 'AST-2026-011',
    name: 'Computer',
    nameBn: 'কম্পিউটার',
    description: 'HP ProDesk 400 G7 Desktop — Transferred to Sylhet',
    type: 'Movable',
    category: 'Electronics',
    status: 'Transferred',
    purchaseDate: '2022-06-10',
    purchasePrice: 72000,
    currentValue: 40000,
    location: 'আঞ্চলিক কার্যালয়, সিলেট',
    assignedDepartment: 'আইসিটি শাখা',
    serialNumber: 'HP-PD-400G7-7788',
    createdAt: '2022-06-10T10:00:00Z',
    updatedAt: '2025-09-15T10:00:00Z',
  },
  {
    assetId: 12,
    assetCode: 'AST-2026-012',
    name: 'Office Chair',
    nameBn: 'অফিস চেয়ার',
    description: 'Visitor Chair — Disposed after damage',
    type: 'Movable',
    category: 'Furniture',
    status: 'Disposed',
    purchaseDate: '2019-02-14',
    purchasePrice: 8000,
    currentValue: 0,
    location: 'প্রধান কার্যালয়, ঢাকা',
    note: 'ক্ষতিগ্রস্ত — নিষ্পত্তি সম্পন্ন',
    createdAt: '2019-02-14T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
]

const MOCK_TRANSACTIONS: AssetTransaction[] = [
  {
    transactionId: 1,
    assetId: 1,
    assetName: 'কম্পিউটার (Dell OptiPlex 7090)',
    transactionType: 'Purchase',
    date: '2024-03-15',
    amount: 85000,
    vendor: 'Computer Source BD',
    description: 'নতুন ডেস্কটপ কম্পিউটার ক্রয় — আইসিটি শাখার জন্য',
    approvedBy: 'পরিচালক (প্রশাসন)',
    documentReference: 'PO-2024-0312',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    transactionId: 2,
    assetId: 7,
    assetName: 'গাড়ী (Toyota Hiace)',
    transactionType: 'Purchase',
    date: '2022-11-01',
    amount: 4500000,
    vendor: 'Navana Limited',
    description: 'অফিসিয়াল মাইক্রোবাস ক্রয় — পরিবহন শাখা',
    approvedBy: 'মহাপরিচালক',
    documentReference: 'PO-2022-0891',
    createdAt: '2022-11-01T10:00:00Z',
  },
  {
    transactionId: 3,
    assetId: 3,
    assetName: 'ফটোকপি মেশিন (Canon imageRUNNER)',
    transactionType: 'Repair',
    date: '2026-03-20',
    amount: 35000,
    vendor: 'Canon Authorized Service',
    description: 'ড্রাম ইউনিট ও ফিউজার প্রতিস্থাপন',
    approvedBy: 'উপ-পরিচালক (প্রশাসন)',
    documentReference: 'MR-2026-0045',
    createdAt: '2026-03-20T09:00:00Z',
  },
  {
    transactionId: 4,
    assetId: 11,
    assetName: 'কম্পিউটার (HP ProDesk 400)',
    transactionType: 'Transfer',
    date: '2025-09-15',
    amount: 0,
    fromLocation: 'প্রধান কার্যালয়, ঢাকা',
    toLocation: 'আঞ্চলিক কার্যালয়, সিলেট',
    fromDepartment: 'আইসিটি শাখা',
    toDepartment: 'আইসিটি শাখা',
    description: 'সিলেট আঞ্চলিক কার্যালয়ে কম্পিউটার বদলি',
    approvedBy: 'পরিচালক (আইসিটি)',
    documentReference: 'TR-2025-0178',
    createdAt: '2025-09-15T10:00:00Z',
  },
  {
    transactionId: 5,
    assetId: 6,
    assetName: 'এয়ার কন্ডিশনার (Gree 2 Ton)',
    transactionType: 'Repair',
    date: '2025-11-05',
    amount: 15000,
    vendor: 'Cool Tech Services',
    description: 'কম্প্রেসর পরীক্ষা ও গ্যাস রিচার্জ — তবে কম্প্রেসর সম্পূর্ণ নষ্ট',
    approvedBy: 'উপ-পরিচালক (প্রশাসন)',
    documentReference: 'MR-2025-0322',
    createdAt: '2025-11-05T10:00:00Z',
  },
  {
    transactionId: 6,
    assetId: 12,
    assetName: 'অফিস চেয়ার (Visitor Chair)',
    transactionType: 'Sale',
    date: '2026-01-20',
    amount: 500,
    description: 'ক্ষতিগ্রস্ত চেয়ার নিষ্পত্তি — নিলাম বিক্রয়',
    approvedBy: 'নিলাম কমিটি',
    documentReference: 'DSP-2026-0011',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    transactionId: 7,
    assetId: 2,
    assetName: 'প্রিন্টার (HP LaserJet Pro)',
    transactionType: 'Repair',
    date: '2026-01-15',
    amount: 8500,
    vendor: 'HP Service Center, Dhaka',
    description: 'টোনার কার্টিজ ও ফিউজার ইউনিট পরিবর্তন',
    approvedBy: 'উপ-পরিচালক (প্রশাসন)',
    documentReference: 'MR-2026-0012',
    createdAt: '2026-01-15T11:00:00Z',
  },
  {
    transactionId: 8,
    assetId: 5,
    assetName: 'আলমিরা (Steel Almira)',
    transactionType: 'Transfer',
    date: '2025-04-10',
    amount: 0,
    fromLocation: 'প্রধান কার্যালয়, ঢাকা',
    toLocation: 'আঞ্চলিক কার্যালয়, রাজশাহী',
    fromDepartment: 'প্রশাসন শাখা',
    toDepartment: 'হিসাব শাখা',
    description: 'রাজশাহী আঞ্চলিক কার্যালয়ে আলমিরা বদলি',
    approvedBy: 'পরিচালক (প্রশাসন)',
    documentReference: 'TR-2025-0089',
    createdAt: '2025-04-10T10:00:00Z',
  },
  {
    transactionId: 9,
    assetId: 4,
    assetName: 'অফিস চেয়ার (Executive Chair)',
    transactionType: 'Purchase',
    date: '2024-01-05',
    amount: 18000,
    vendor: 'Otobi Limited',
    description: 'নির্বাহী চেয়ার ক্রয় — পরিকল্পনা শাখা',
    approvedBy: 'পরিচালক (প্রশাসন)',
    documentReference: 'PO-2024-0018',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    transactionId: 10,
    assetId: 7,
    assetName: 'গাড়ী (Toyota Hiace)',
    transactionType: 'Repair',
    date: '2026-02-28',
    amount: 45000,
    vendor: 'Navana Workshop',
    description: 'ব্রেক প্যাড ও সাসপেনশন মেরামত',
    approvedBy: 'উপ-পরিচালক (পরিবহন)',
    documentReference: 'MR-2026-0038',
    createdAt: '2026-02-28T10:00:00Z',
  },
]

export class AssetService {
  static getAssets(): Asset[] {
    return [...MOCK_ASSETS]
  }

  static getAsset(id: number): Asset | undefined {
    return MOCK_ASSETS.find(a => a.assetId === id)
  }

  static createAsset(data: Omit<Asset, 'assetId' | 'assetCode' | 'createdAt'>): Asset {
    const nextId = Math.max(...MOCK_ASSETS.map(a => a.assetId), 0) + 1
    const year = new Date().getFullYear()
    const code = `AST-${year}-${String(nextId).padStart(3, '0')}`
    const newAsset: Asset = {
      ...data,
      assetId: nextId,
      assetCode: code,
      createdAt: new Date().toISOString(),
    }
    MOCK_ASSETS.push(newAsset)
    return newAsset
  }

  static updateAsset(id: number, data: Partial<Asset>): Asset {
    const idx = MOCK_ASSETS.findIndex(a => a.assetId === id)
    if (idx === -1) throw new Error('Asset not found')
    MOCK_ASSETS[idx] = { ...MOCK_ASSETS[idx], ...data, updatedAt: new Date().toISOString() }
    return MOCK_ASSETS[idx]
  }

  static deleteAsset(id: number): void {
    const idx = MOCK_ASSETS.findIndex(a => a.assetId === id)
    if (idx === -1) throw new Error('Asset not found')
    MOCK_ASSETS.splice(idx, 1)
  }

  static getTransactions(): AssetTransaction[] {
    return [...MOCK_TRANSACTIONS]
  }

  static addTransaction(data: Omit<AssetTransaction, 'transactionId' | 'createdAt'>): AssetTransaction {
    const nextId = Math.max(...MOCK_TRANSACTIONS.map(t => t.transactionId), 0) + 1
    const newTx: AssetTransaction = {
      ...data,
      transactionId: nextId,
      createdAt: new Date().toISOString(),
    }
    MOCK_TRANSACTIONS.push(newTx)
    return newTx
  }

  static getAssetsByType(type: AssetType): Asset[] {
    return MOCK_ASSETS.filter(a => a.type === type)
  }

  static getStatusCounts(): Record<AssetStatus, number> {
    const counts: Record<AssetStatus, number> = {
      Active: 0,
      Under_Repair: 0,
      Unusable: 0,
      Transferred: 0,
      Disposed: 0,
      Auctioned: 0,
    }
    MOCK_ASSETS.forEach(a => {
      counts[a.status]++
    })
    return counts
  }
}
