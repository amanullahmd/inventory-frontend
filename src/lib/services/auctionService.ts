export type AuctionStatus = 'SCHEDULED' | 'NOTICE_PUBLISHED' | 'BIDDING_OPEN' | 'BIDDING_CLOSED' | 'AWARDED' | 'COMPLETED' | 'CANCELLED'
export type AuctionItemCondition = 'Unusable' | 'Damaged' | 'Obsolete' | 'Surplus'

export interface AuctionItem {
  auctionItemId: number
  itemName: string
  description: string
  condition: AuctionItemCondition
  quantity: number
  estimatedValue: number
  reservePrice: number
  soldPrice?: number
  buyerName?: string
  buyerNid?: string
}

export interface Auction {
  auctionId: number
  auctionCode: string
  title: string
  auctionDate: string
  location: string
  status: AuctionStatus
  noticeDate?: string
  committeeChairman: string
  committeeMembers: string[]
  items: AuctionItem[]
  totalEstimatedValue: number
  totalSoldValue?: number
  note?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateAuctionRequest {
  title: string
  auctionDate: string
  location: string
  committeeChairman: string
  committeeMembers: string[]
  items: Omit<AuctionItem, 'auctionItemId' | 'soldPrice' | 'buyerName' | 'buyerNid'>[]
  note?: string
}

const mockAuctions: Auction[] = [
  {
    auctionId: 1,
    auctionCode: 'AUC-2026-001',
    title: 'পুরাতন কম্পিউটার ও প্রিন্টার নিলাম',
    auctionDate: '2025-11-15',
    location: 'ডিপিই প্রধান কার্যালয়, ঢাকা',
    status: 'COMPLETED',
    noticeDate: '2025-10-20',
    committeeChairman: 'মোঃ আব্দুল করিম',
    committeeMembers: ['জনাব রফিকুল ইসলাম', 'জনাব শাহিনা বেগম', 'জনাব মোস্তফা কামাল'],
    items: [
      {
        auctionItemId: 1,
        itemName: 'ডেস্কটপ কম্পিউটার (Dell OptiPlex 780)',
        description: 'পুরাতন ডেস্কটপ কম্পিউটার, ১০ বছর ব্যবহৃত, অচল',
        condition: 'Unusable',
        quantity: 15,
        estimatedValue: 75000,
        reservePrice: 50000,
        soldPrice: 62000,
        buyerName: 'মেসার্স রহমান ট্রেডার্স',
        buyerNid: '1990123456789'
      },
      {
        auctionItemId: 2,
        itemName: 'লেজার প্রিন্টার (HP LaserJet 1020)',
        description: 'অকেজো প্রিন্টার, মেরামতযোগ্য নয়',
        condition: 'Damaged',
        quantity: 8,
        estimatedValue: 24000,
        reservePrice: 15000,
        soldPrice: 18500,
        buyerName: 'জনাব সেলিম হোসেন',
        buyerNid: '1985678901234'
      },
      {
        auctionItemId: 3,
        itemName: 'ইউপিএস (Power Guard 650VA)',
        description: 'ব্যাটারি নষ্ট, অব্যবহারযোগ্য',
        condition: 'Unusable',
        quantity: 20,
        estimatedValue: 30000,
        reservePrice: 20000,
        soldPrice: 25000,
        buyerName: 'মেসার্স রহমান ট্রেডার্স',
        buyerNid: '1990123456789'
      }
    ],
    totalEstimatedValue: 129000,
    totalSoldValue: 105500,
    note: 'নিলাম সফলভাবে সম্পন্ন হয়েছে।',
    createdAt: '2025-10-01',
    updatedAt: '2025-11-16'
  },
  {
    auctionId: 2,
    auctionCode: 'AUC-2026-002',
    title: 'অকেজো আসবাবপত্র নিলাম',
    auctionDate: '2026-05-10',
    location: 'জেলা প্রাথমিক শিক্ষা অফিস, চট্টগ্রাম',
    status: 'BIDDING_OPEN',
    noticeDate: '2026-04-01',
    committeeChairman: 'জনাব নাসরিন আক্তার',
    committeeMembers: ['জনাব হাসান মাহমুদ', 'জনাব ফারুক আহমেদ'],
    items: [
      {
        auctionItemId: 4,
        itemName: 'কাঠের টেবিল (৪x২.৫ ফুট)',
        description: 'পুরাতন অফিস টেবিল, ভাঙা পা',
        condition: 'Damaged',
        quantity: 25,
        estimatedValue: 50000,
        reservePrice: 30000
      },
      {
        auctionItemId: 5,
        itemName: 'স্টিলের চেয়ার',
        description: 'মরিচাযুক্ত, কুশন নষ্ট',
        condition: 'Unusable',
        quantity: 40,
        estimatedValue: 60000,
        reservePrice: 35000
      },
      {
        auctionItemId: 6,
        itemName: 'ফাইল ক্যাবিনেট (৪ ড্রয়ার)',
        description: 'পুরাতন ক্যাবিনেট, তালা নষ্ট',
        condition: 'Damaged',
        quantity: 10,
        estimatedValue: 30000,
        reservePrice: 18000
      },
      {
        auctionItemId: 7,
        itemName: 'কাঠের আলমারি',
        description: 'ঘুণে ধরা আলমারি',
        condition: 'Unusable',
        quantity: 5,
        estimatedValue: 15000,
        reservePrice: 8000
      }
    ],
    totalEstimatedValue: 155000,
    note: 'বিডিং চলমান, শেষ তারিখ ৫ মে ২০২৬।',
    createdAt: '2026-03-15',
    updatedAt: '2026-04-01'
  },
  {
    auctionId: 3,
    auctionCode: 'AUC-2026-003',
    title: 'স্ক্র্যাপ যন্ত্রপাতি নিলাম',
    auctionDate: '2026-06-20',
    location: 'উপজেলা শিক্ষা অফিস, গাজীপুর সদর',
    status: 'SCHEDULED',
    committeeChairman: 'জনাব মোঃ জাহাঙ্গীর আলম',
    committeeMembers: ['জনাব সুফিয়া খাতুন', 'জনাব আনোয়ার হোসেন', 'জনাব কামরুন নাহার'],
    items: [
      {
        auctionItemId: 8,
        itemName: 'ফটোকপি মেশিন (Ricoh MP 2014)',
        description: 'অকেজো, যন্ত্রাংশ অপ্রাপ্য',
        condition: 'Obsolete',
        quantity: 3,
        estimatedValue: 45000,
        reservePrice: 25000
      },
      {
        auctionItemId: 9,
        itemName: 'ফ্যাক্স মেশিন (Panasonic KX-FP701)',
        description: 'প্রযুক্তিগতভাবে অপ্রচলিত',
        condition: 'Obsolete',
        quantity: 5,
        estimatedValue: 10000,
        reservePrice: 5000
      }
    ],
    totalEstimatedValue: 55000,
    note: 'নোটিশ প্রকাশের অপেক্ষায়।',
    createdAt: '2026-04-10'
  },
  {
    auctionId: 4,
    auctionCode: 'AUC-2026-004',
    title: 'উদ্বৃত্ত শিক্ষা উপকরণ নিলাম',
    auctionDate: '2026-04-25',
    location: 'ডিপিই আঞ্চলিক কার্যালয়, রাজশাহী',
    status: 'NOTICE_PUBLISHED',
    noticeDate: '2026-04-05',
    committeeChairman: 'জনাব ফরিদা ইয়াসমিন',
    committeeMembers: ['জনাব আব্দুস সালাম', 'জনাব মনিরুজ্জামান'],
    items: [
      {
        auctionItemId: 10,
        itemName: 'পুরাতন পাঠ্যপুস্তক (বিভিন্ন শ্রেণি)',
        description: 'পূর্ববর্তী সংস্করণের উদ্বৃত্ত বই',
        condition: 'Surplus',
        quantity: 5000,
        estimatedValue: 100000,
        reservePrice: 60000
      },
      {
        auctionItemId: 11,
        itemName: 'শিক্ষক নির্দেশিকা (পুরাতন সংস্করণ)',
        description: 'অপ্রচলিত কারিকুলামের নির্দেশিকা',
        condition: 'Obsolete',
        quantity: 2000,
        estimatedValue: 40000,
        reservePrice: 20000
      },
      {
        auctionItemId: 12,
        itemName: 'চার্ট ও পোস্টার',
        description: 'পুরাতন শিক্ষা উপকরণ, ব্যবহার অনুপযোগী',
        condition: 'Damaged',
        quantity: 500,
        estimatedValue: 10000,
        reservePrice: 5000
      }
    ],
    totalEstimatedValue: 150000,
    note: 'দৈনিক পত্রিকায় বিজ্ঞপ্তি প্রকাশিত।',
    createdAt: '2026-03-28',
    updatedAt: '2026-04-05'
  },
  {
    auctionId: 5,
    auctionCode: 'AUC-2025-005',
    title: 'পরিত্যক্ত যানবাহন নিলাম',
    auctionDate: '2025-08-30',
    location: 'ডিপিই কেন্দ্রীয় গুদাম, মিরপুর, ঢাকা',
    status: 'CANCELLED',
    noticeDate: '2025-08-01',
    committeeChairman: 'জনাব মোঃ শফিকুল ইসলাম',
    committeeMembers: ['জনাব রেজাউল করিম', 'জনাব তাহমিনা সুলতানা'],
    items: [
      {
        auctionItemId: 13,
        itemName: 'মোটরসাইকেল (Honda CG 125)',
        description: 'অকেজো, ইঞ্জিন বিকল',
        condition: 'Unusable',
        quantity: 2,
        estimatedValue: 40000,
        reservePrice: 25000
      },
      {
        auctionItemId: 14,
        itemName: 'পিকআপ ভ্যান (Mitsubishi L300)',
        description: 'ব্যবহার অনুপযোগী, রেজিস্ট্রেশন মেয়াদোত্তীর্ণ',
        condition: 'Unusable',
        quantity: 1,
        estimatedValue: 150000,
        reservePrice: 80000
      }
    ],
    totalEstimatedValue: 190000,
    note: 'আইনি জটিলতার কারণে বাতিল করা হয়েছে।',
    createdAt: '2025-07-15',
    updatedAt: '2025-08-25'
  }
]

let auctions = [...mockAuctions]
let nextId = 6
let nextItemId = 15

export class AuctionService {
  static getAuctions(): Auction[] {
    return auctions
  }

  static getAuction(id: number): Auction | undefined {
    return auctions.find(a => a.auctionId === id)
  }

  static createAuction(data: CreateAuctionRequest): Auction {
    const totalEstimatedValue = data.items.reduce((sum, item) => sum + item.estimatedValue * item.quantity, 0)
    const auctionItems: AuctionItem[] = data.items.map(item => ({
      ...item,
      auctionItemId: nextItemId++
    }))
    const newAuction: Auction = {
      auctionId: nextId++,
      auctionCode: `AUC-2026-${String(nextId - 1).padStart(3, '0')}`,
      title: data.title,
      auctionDate: data.auctionDate,
      location: data.location,
      status: 'SCHEDULED',
      committeeChairman: data.committeeChairman,
      committeeMembers: data.committeeMembers,
      items: auctionItems,
      totalEstimatedValue,
      note: data.note,
      createdAt: new Date().toISOString().split('T')[0]
    }
    auctions = [newAuction, ...auctions]
    return newAuction
  }

  static updateAuction(id: number, data: Partial<Auction>): Auction {
    const index = auctions.findIndex(a => a.auctionId === id)
    if (index === -1) throw new Error('Auction not found')
    auctions[index] = {
      ...auctions[index],
      ...data,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    return auctions[index]
  }

  static deleteAuction(id: number): void {
    const index = auctions.findIndex(a => a.auctionId === id)
    if (index === -1) throw new Error('Auction not found')
    auctions = auctions.filter(a => a.auctionId !== id)
  }
}
