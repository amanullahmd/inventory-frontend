// Mock data for all features - DPE actual inventory data
export const MOCK_CATEGORIES = [
  { id: 1, code: 'CAT001', name: 'প্রিন্টার এবং টোনার', description: 'প্রিন্টার এবং সম্পর্কিত সরঞ্জাম', color: '#3B82F6', createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, code: 'CAT002', name: 'কম্পিউটার হার্ডওয়্যার', description: 'কম্পিউটার এবং ল্যাপটপ উপাদান', color: '#10B981', createdAt: '2024-01-02T00:00:00Z' },
  { id: 3, code: 'CAT003', name: 'পেরিফেরাল ডিভাইস', description: 'মাউস, কীবোর্ড, এবং অন্যান্য ডিভাইস', color: '#F59E0B', createdAt: '2024-01-03T00:00:00Z' },
  { id: 4, code: 'CAT004', name: 'নেটওয়ার্ক এবং ক্যাবল', description: 'নেটওয়ার্ক সরঞ্জাম এবং ক্যাবল', color: '#8B5CF6', createdAt: '2024-01-04T00:00:00Z' },
  { id: 5, code: 'CAT005', name: 'স্টোরেজ ডিভাইস', description: 'হার্ড ড্রাইভ এবং ফ্ল্যাশ ড্রাইভ', color: '#EC4899', createdAt: '2024-01-05T00:00:00Z' },
  { id: 6, code: 'CAT006', name: 'ডিসপ্লে এবং মনিটর', description: 'মনিটর এবং প্রজেক্টর', color: '#06B6D4', createdAt: '2024-01-06T00:00:00Z' },
  { id: 7, code: 'CAT007', name: 'অফিস সরঞ্জাম', description: 'অফিস এবং স্টেশনারি আইটেম', color: '#14B8A6', createdAt: '2024-01-07T00:00:00Z' },
  { id: 8, code: 'CAT008', name: 'আসবাবপত্র', description: 'অফিস এবং শ্রেণীকক্ষ আসবাবপত্র', color: '#F97316', createdAt: '2024-01-08T00:00:00Z' },
]

export const MOCK_ITEMS = [
  // প্রিন্টার এবং টোনার
  { itemId: 1, name: 'HP Laser Jet Pro M426dw Printer', sku: 'HP-M426DW', description: 'HP লেজার প্রিন্টার', unitPrice: 28000, currentStock: 5, categoryId: 1, categoryName: 'প্রিন্টার এবং টোনার', minimumStock: 1, maximumStock: 10, reorderLevel: 3, createdAt: '2024-01-01T00:00:00Z' },
  { itemId: 2, name: 'HP Color Laser Jet Pro M453dw Printer', sku: 'HP-M453DW', description: 'HP রঙিন লেজার প্রিন্টার', unitPrice: 45000, currentStock: 3, categoryId: 1, categoryName: 'প্রিন্টার এবং টোনার', minimumStock: 1, maximumStock: 8, reorderLevel: 2, createdAt: '2024-01-02T00:00:00Z' },
  { itemId: 3, name: 'HP Laser Jet M1132 Printer Toner', sku: 'HP-M1132-TONER', description: 'HP টোনার কার্টিজ', unitPrice: 3500, currentStock: 20, categoryId: 1, categoryName: 'প্রিন্টার এবং টোনার', minimumStock: 5, maximumStock: 50, reorderLevel: 15, createdAt: '2024-01-03T00:00:00Z' },
  { itemId: 4, name: 'Brother HL-L8360CDW Printer', sku: 'BROTHER-L8360', description: 'ব্রাদার লেজার প্রিন্টার', unitPrice: 35000, currentStock: 2, categoryId: 1, categoryName: 'প্রিন্টার এবং টোনার', minimumStock: 1, maximumStock: 5, reorderLevel: 2, createdAt: '2024-01-04T00:00:00Z' },
  { itemId: 5, name: 'Canon LBP2900 Toner', sku: 'CANON-LBP2900', description: 'ক্যানন টোনার', unitPrice: 2800, currentStock: 15, categoryId: 1, categoryName: 'প্রিন্টার এবং টোনার', minimumStock: 5, maximumStock: 40, reorderLevel: 12, createdAt: '2024-01-05T00:00:00Z' },
  { itemId: 6, name: 'Samsung MultiXpress M4370LX Printer', sku: 'SAMSUNG-M4370', description: 'স্যামসাং মাল্টিফাংশন প্রিন্টার', unitPrice: 120000, currentStock: 1, categoryId: 1, categoryName: 'প্রিন্টার এবং টোনার', minimumStock: 1, maximumStock: 3, reorderLevel: 1, createdAt: '2024-01-06T00:00:00Z' },
  { itemId: 7, name: 'HP Laser Jet Pro M1005 Printer Toner', sku: 'HP-M1005-TONER', description: 'HP টোনার', unitPrice: 3200, currentStock: 18, categoryId: 1, categoryName: 'প্রিন্টার এবং টোনার', minimumStock: 5, maximumStock: 45, reorderLevel: 14, createdAt: '2024-01-07T00:00:00Z' },
  { itemId: 8, name: 'HP Laser Jet Pro M1217nfw Printer', sku: 'HP-M1217NF', description: 'HP নেটওয়ার্ক প্রিন্টার', unitPrice: 18000, currentStock: 4, categoryId: 1, categoryName: 'প্রিন্টার এবং টোনার', minimumStock: 1, maximumStock: 8, reorderLevel: 3, createdAt: '2024-01-08T00:00:00Z' },
  { itemId: 9, name: 'HP Laser Jet Pro M1319f Printer Toner', sku: 'HP-M1319F-TONER', description: 'HP টোনার কার্টিজ', unitPrice: 3800, currentStock: 12, categoryId: 1, categoryName: 'প্রিন্টার এবং টোনার', minimumStock: 4, maximumStock: 35, reorderLevel: 10, createdAt: '2024-01-09T00:00:00Z' },
  { itemId: 10, name: 'HP Laser Jet MFP M130fw Printer Toner', sku: 'HP-M130FW-TONER', description: 'HP মাল্টিফাংশন টোনার', unitPrice: 4200, currentStock: 10, categoryId: 1, categoryName: 'প্রিন্টার এবং টোনার', minimumStock: 3, maximumStock: 30, reorderLevel: 9, createdAt: '2024-01-10T00:00:00Z' },

  // কম্পিউটার হার্ডওয়্যার
  { itemId: 11, name: 'Desktop Computer (i5 Processor)', sku: 'DESKTOP-I5', description: 'ডেস্কটপ কম্পিউটার i5 প্রসেসর সহ', unitPrice: 45000, currentStock: 8, categoryId: 2, categoryName: 'কম্পিউটার হার্ডওয়্যার', minimumStock: 2, maximumStock: 15, reorderLevel: 5, createdAt: '2024-01-11T00:00:00Z' },
  { itemId: 12, name: 'Laptop (Intel i7, 8GB RAM)', sku: 'LAPTOP-I7-8GB', description: 'ল্যাপটপ i7 প্রসেসর, 8GB RAM', unitPrice: 65000, currentStock: 6, categoryId: 2, categoryName: 'কম্পিউটার হার্ডওয়্যার', minimumStock: 1, maximumStock: 10, reorderLevel: 3, createdAt: '2024-01-12T00:00:00Z' },
  { itemId: 13, name: 'Laptop (Intel i5, 4GB RAM)', sku: 'LAPTOP-I5-4GB', description: 'ল্যাপটপ i5 প্রসেসর, 4GB RAM', unitPrice: 42000, currentStock: 5, categoryId: 2, categoryName: 'কম্পিউটার হার্ডওয়্যার', minimumStock: 1, maximumStock: 8, reorderLevel: 2, createdAt: '2024-01-13T00:00:00Z' },
  { itemId: 14, name: 'Toshiba Photocopy Machine 2305A', sku: 'TOSHIBA-2305A', description: 'টোশিবা ফটোকপি মেশিন', unitPrice: 180000, currentStock: 1, categoryId: 2, categoryName: 'কম্পিউটার হার্ডওয়্যার', minimumStock: 1, maximumStock: 2, reorderLevel: 1, createdAt: '2024-01-14T00:00:00Z' },
  { itemId: 15, name: 'Multimedia Keyboard (A4 Tech)', sku: 'A4TECH-KB', description: 'মাল্টিমিডিয়া কীবোর্ড', unitPrice: 2500, currentStock: 25, categoryId: 2, categoryName: 'কম্পিউটার হার্ডওয়্যার', minimumStock: 10, maximumStock: 60, reorderLevel: 20, createdAt: '2024-01-15T00:00:00Z' },
  { itemId: 16, name: 'Mouse Optical (A4 Tech)', sku: 'A4TECH-MOUSE', description: 'অপটিক্যাল মাউস', unitPrice: 1200, currentStock: 40, categoryId: 2, categoryName: 'কম্পিউটার হার্ডওয়্যার', minimumStock: 15, maximumStock: 80, reorderLevel: 30, createdAt: '2024-01-16T00:00:00Z' },
  { itemId: 17, name: 'Solid State Drive (SSD) 512 GB for PC', sku: 'SSD-512GB-PC', description: 'SSD 512GB ডেস্কটপের জন্য', unitPrice: 8000, currentStock: 12, categoryId: 2, categoryName: 'কম্পিউটার হার্ডওয়্যার', minimumStock: 5, maximumStock: 30, reorderLevel: 10, createdAt: '2024-01-17T00:00:00Z' },
  { itemId: 18, name: 'Hard Disk Drive (HDD) 1TB for PC', sku: 'HDD-1TB-PC', description: 'হার্ড ড্রাইভ 1TB', unitPrice: 4500, currentStock: 18, categoryId: 2, categoryName: 'কম্পিউটার হার্ডওয়্যার', minimumStock: 8, maximumStock: 40, reorderLevel: 15, createdAt: '2024-01-18T00:00:00Z' },
  { itemId: 19, name: 'Monitor Board (115 inch Generation)', sku: 'MONITOR-BOARD', description: 'মনিটর বোর্ড', unitPrice: 25000, currentStock: 3, categoryId: 2, categoryName: 'কম্পিউটার হার্ডওয়্যার', minimumStock: 1, maximumStock: 6, reorderLevel: 2, createdAt: '2024-01-19T00:00:00Z' },
  { itemId: 20, name: 'Printer (Duplex)', sku: 'PRINTER-DUPLEX', description: 'ডুপ্লেক্স প্রিন্টার', unitPrice: 32000, currentStock: 2, categoryId: 2, categoryName: 'কম্পিউটার হার্ডওয়্যার', minimumStock: 1, maximumStock: 4, reorderLevel: 1, createdAt: '2024-01-20T00:00:00Z' },

  // পেরিফেরাল ডিভাইস
  { itemId: 21, name: 'Scanner (Flatbed)', sku: 'SCANNER-FLATBED', description: 'ফ্ল্যাটবেড স্ক্যানার', unitPrice: 8500, currentStock: 6, categoryId: 3, categoryName: 'পেরিফেরাল ডিভাইস', minimumStock: 2, maximumStock: 12, reorderLevel: 4, createdAt: '2024-01-21T00:00:00Z' },
  { itemId: 22, name: 'USB HUB (4 Port USB 3.0 Hub)', sku: 'USB-HUB-4PORT', description: 'USB হাব 4 পোর্ট', unitPrice: 1800, currentStock: 30, categoryId: 3, categoryName: 'পেরিফেরাল ডিভাইস', minimumStock: 10, maximumStock: 70, reorderLevel: 25, createdAt: '2024-01-22T00:00:00Z' },
  { itemId: 23, name: 'Wireless Combo Keyboard & Mouse', sku: 'WIRELESS-KB-MOUSE', description: 'ওয়্যারলেস কীবোর্ড এবং মাউস', unitPrice: 3500, currentStock: 15, categoryId: 3, categoryName: 'পেরিফেরাল ডিভাইস', minimumStock: 5, maximumStock: 35, reorderLevel: 12, createdAt: '2024-01-23T00:00:00Z' },
  { itemId: 24, name: 'CMOS Battery for PC', sku: 'CMOS-BATTERY', description: 'CMOS ব্যাটারি', unitPrice: 450, currentStock: 50, categoryId: 3, categoryName: 'পেরিফেরাল ডিভাইস', minimumStock: 20, maximumStock: 100, reorderLevel: 40, createdAt: '2024-01-24T00:00:00Z' },
  { itemId: 25, name: 'UPS (1.5 KVA)', sku: 'UPS-1.5KVA', description: 'ইউপিএস 1.5 KVA', unitPrice: 12000, currentStock: 4, categoryId: 3, categoryName: 'পেরিফেরাল ডিভাইস', minimumStock: 1, maximumStock: 8, reorderLevel: 3, createdAt: '2024-01-25T00:00:00Z' },
  { itemId: 26, name: 'UPS (2.5 KVA)', sku: 'UPS-2.5KVA', description: 'ইউপিএস 2.5 KVA', unitPrice: 18000, currentStock: 2, categoryId: 3, categoryName: 'পেরিফেরাল ডিভাইস', minimumStock: 1, maximumStock: 5, reorderLevel: 2, createdAt: '2024-01-26T00:00:00Z' },
  { itemId: 27, name: 'HD Webcam with Microphone for PC', sku: 'WEBCAM-HD', description: 'এইচডি ওয়েবক্যাম মাইক্রোফোন সহ', unitPrice: 4500, currentStock: 8, categoryId: 3, categoryName: 'পেরিফেরাল ডিভাইস', minimumStock: 2, maximumStock: 18, reorderLevel: 6, createdAt: '2024-01-27T00:00:00Z' },

  // নেটওয়ার্ক এবং ক্যাবল
  { itemId: 28, name: 'Network Cable (Cat 6) 100m', sku: 'CAT6-100M', description: 'নেটওয়ার্ক ক্যাবল Cat 6', unitPrice: 3500, currentStock: 20, categoryId: 4, categoryName: 'নেটওয়ার্ক এবং ক্যাবল', minimumStock: 5, maximumStock: 50, reorderLevel: 15, createdAt: '2024-01-28T00:00:00Z' },
  { itemId: 29, name: 'RJ-45 CAT6 Connector', sku: 'RJ45-CAT6', description: 'RJ-45 কানেক্টর', unitPrice: 25, currentStock: 500, categoryId: 4, categoryName: 'নেটওয়ার্ক এবং ক্যাবল', minimumStock: 100, maximumStock: 1000, reorderLevel: 300, createdAt: '2024-01-29T00:00:00Z' },
  { itemId: 30, name: 'VGA to HDMI Converter', sku: 'VGA-HDMI-CONV', description: 'VGA থেকে HDMI কনভার্টার', unitPrice: 3500, currentStock: 10, categoryId: 4, categoryName: 'নেটওয়ার্ক এবং ক্যাবল', minimumStock: 3, maximumStock: 25, reorderLevel: 8, createdAt: '2024-01-30T00:00:00Z' },
  { itemId: 31, name: 'Micro Processor (INTEL Core i7-13th Generation)', sku: 'INTEL-I7-13TH', description: 'ইন্টেল কোর i7 13th জেনারেশন', unitPrice: 35000, currentStock: 3, categoryId: 4, categoryName: 'নেটওয়ার্ক এবং ক্যাবল', minimumStock: 1, maximumStock: 6, reorderLevel: 2, createdAt: '2024-01-31T00:00:00Z' },

  // স্টোরেজ ডিভাইস
  { itemId: 32, name: 'OTG Flash Drive 128GB', sku: 'OTG-128GB', description: 'OTG ফ্ল্যাশ ড্রাইভ 128GB', unitPrice: 2500, currentStock: 25, categoryId: 5, categoryName: 'স্টোরেজ ডিভাইস', minimumStock: 8, maximumStock: 60, reorderLevel: 20, createdAt: '2024-02-01T00:00:00Z' },
  { itemId: 33, name: 'Power Stripe Heavy', sku: 'POWER-STRIPE', description: 'পাওয়ার স্ট্রিপ', unitPrice: 2800, currentStock: 35, categoryId: 5, categoryName: 'স্টোরেজ ডিভাইস', minimumStock: 10, maximumStock: 80, reorderLevel: 30, createdAt: '2024-02-02T00:00:00Z' },
  { itemId: 34, name: 'Desktop Power Supply (600 Watt)', sku: 'PSU-600W', description: 'ডেস্কটপ পাওয়ার সাপ্লাই 600W', unitPrice: 6000, currentStock: 8, categoryId: 5, categoryName: 'স্টোরেজ ডিভাইস', minimumStock: 2, maximumStock: 18, reorderLevel: 6, createdAt: '2024-02-03T00:00:00Z' },
  { itemId: 35, name: 'RAM (DDR4 8G-H) for PC', sku: 'RAM-DDR4-8GB', description: 'RAM DDR4 8GB', unitPrice: 8000, currentStock: 15, categoryId: 5, categoryName: 'স্টোরেজ ডিভাইস', minimumStock: 5, maximumStock: 40, reorderLevel: 12, createdAt: '2024-02-04T00:00:00Z' },
  { itemId: 36, name: 'RAM (DDR4 8G-H) for Laptop', sku: 'RAM-DDR4-8GB-LAP', description: 'ল্যাপটপের জন্য RAM DDR4 8GB', unitPrice: 8500, currentStock: 12, categoryId: 5, categoryName: 'স্টোরেজ ডিভাইস', minimumStock: 4, maximumStock: 35, reorderLevel: 10, createdAt: '2024-02-05T00:00:00Z' },
  { itemId: 37, name: 'DVD Rom/Writer/Combo Drive for PC', sku: 'DVD-DRIVE-PC', description: 'DVD ড্রাইভ', unitPrice: 1500, currentStock: 6, categoryId: 5, categoryName: 'স্টোরেজ ডিভাইস', minimumStock: 2, maximumStock: 15, reorderLevel: 5, createdAt: '2024-02-06T00:00:00Z' },

  // ডিসপ্লে এবং মনিটর
  { itemId: 38, name: 'Desktop Monitor (Samsung 19")', sku: 'MONITOR-SAMSUNG-19', description: 'ডেস্কটপ মনিটর 19 ইঞ্চি', unitPrice: 12000, currentStock: 7, categoryId: 6, categoryName: 'ডিসপ্লে এবং মনিটর', minimumStock: 2, maximumStock: 15, reorderLevel: 5, createdAt: '2024-02-07T00:00:00Z' },
  { itemId: 39, name: 'HDMI Cable (3 Meter)', sku: 'HDMI-3M', description: 'HDMI ক্যাবল 3 মিটার', unitPrice: 1500, currentStock: 40, categoryId: 6, categoryName: 'ডিসপ্লে এবং মনিটর', minimumStock: 10, maximumStock: 100, reorderLevel: 30, createdAt: '2024-02-08T00:00:00Z' },
  { itemId: 40, name: 'HDMI Cable (10 Meter)', sku: 'HDMI-10M', description: 'HDMI ক্যাবল 10 মিটার', unitPrice: 2500, currentStock: 15, categoryId: 6, categoryName: 'ডিসপ্লে এবং মনিটর', minimumStock: 5, maximumStock: 40, reorderLevel: 12, createdAt: '2024-02-09T00:00:00Z' },
  { itemId: 41, name: 'HDMI Cable (20 Meter)', sku: 'HDMI-20M', description: 'HDMI ক্যাবল 20 মিটার', unitPrice: 3500, currentStock: 8, categoryId: 6, categoryName: 'ডিসপ্লে এবং মনিটর', minimumStock: 2, maximumStock: 20, reorderLevel: 6, createdAt: '2024-02-10T00:00:00Z' },
  { itemId: 42, name: 'Patch Card (2 Meter)', sku: 'PATCH-CARD-2M', description: 'প্যাচ কার্ড 2 মিটার', unitPrice: 800, currentStock: 100, categoryId: 6, categoryName: 'ডিসপ্লে এবং মনিটর', minimumStock: 30, maximumStock: 200, reorderLevel: 70, createdAt: '2024-02-11T00:00:00Z' },

  // অফিস সরঞ্জাম
  { itemId: 43, name: 'A4 Paper (500 sheets)', sku: 'PAPER-A4-500', description: 'এ4 কাগজ 500 শীট', unitPrice: 250, currentStock: 200, categoryId: 7, categoryName: 'অফিস সরঞ্জাম', minimumStock: 50, maximumStock: 500, reorderLevel: 150, createdAt: '2024-02-12T00:00:00Z' },
  { itemId: 44, name: 'Pen Set (12 pieces)', sku: 'PEN-SET-12', description: 'কলম সেট 12 পিস', unitPrice: 300, currentStock: 150, categoryId: 7, categoryName: 'অফিস সরঞ্জাম', minimumStock: 40, maximumStock: 300, reorderLevel: 100, createdAt: '2024-02-13T00:00:00Z' },
  { itemId: 45, name: 'Notebook A5 (Lined)', sku: 'NOTEBOOK-A5', description: 'নোটবুক এ5 লাইনযুক্ত', unitPrice: 100, currentStock: 300, categoryId: 7, categoryName: 'অফিস সরঞ্জাম', minimumStock: 100, maximumStock: 600, reorderLevel: 200, createdAt: '2024-02-14T00:00:00Z' },
  { itemId: 46, name: 'Marker Pen (Set)', sku: 'MARKER-PEN-SET', description: 'মার্কার পেন সেট', unitPrice: 450, currentStock: 80, categoryId: 7, categoryName: 'অফিস সরঞ্জাম', minimumStock: 20, maximumStock: 150, reorderLevel: 50, createdAt: '2024-02-15T00:00:00Z' },

  // আসবাবপত্র
  { itemId: 47, name: 'Student Chair (Ergonomic)', sku: 'CHAIR-STUDENT', description: 'শিক্ষার্থী চেয়ার এরগনমিক', unitPrice: 8000, currentStock: 12, categoryId: 8, categoryName: 'আসবাবপত্র', minimumStock: 3, maximumStock: 25, reorderLevel: 8, createdAt: '2024-02-16T00:00:00Z' },
  { itemId: 48, name: 'Office Desk (Standard)', sku: 'DESK-OFFICE', description: 'অফিস ডেস্ক স্ট্যান্ডার্ড', unitPrice: 15000, currentStock: 6, categoryId: 8, categoryName: 'আসবাবপত্র', minimumStock: 1, maximumStock: 12, reorderLevel: 4, createdAt: '2024-02-17T00:00:00Z' },
  { itemId: 49, name: 'Bookshelf (5 Shelf)', sku: 'BOOKSHELF-5', description: 'বুকশেলফ 5 শেলফ', unitPrice: 12000, currentStock: 4, categoryId: 8, categoryName: 'আসবাবপত্র', minimumStock: 1, maximumStock: 8, reorderLevel: 3, createdAt: '2024-02-18T00:00:00Z' },
  { itemId: 50, name: 'Filing Cabinet (4 Drawer)', sku: 'CABINET-4DRAWER', description: 'ফাইলিং ক্যাবিনেট 4 ড্রয়ার', unitPrice: 18000, currentStock: 3, categoryId: 8, categoryName: 'আসবাবপত্র', minimumStock: 1, maximumStock: 6, reorderLevel: 2, createdAt: '2024-02-19T00:00:00Z' },
]

// Hierarchical Branch Structure
export const MOCK_DIVISIONS = [
  { divisionId: 1, divisionCode: 'DIV-001', name: 'ঢাকা বিভাগ', address: 'প্রাথমিক শিক্ষা অধিদপ্তর, ঢাকা', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
]

export const MOCK_DISTRICTS = [
  { districtId: 1, districtCode: 'DIST-001', name: 'ঢাকা জেলা', divisionId: 1, address: 'ঢাকা জেলা শিক্ষা অফিস', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { districtId: 2, districtCode: 'DIST-002', name: 'নারায়ণগঞ্জ জেলা', divisionId: 1, address: 'নারায়ণগঞ্জ জেলা শিক্ষা অফিস', isActive: true, createdAt: '2024-01-02T00:00:00Z' },
]

export const MOCK_UPAZILAS = [
  { upazilaId: 1, upazilaCode: 'UPZ-001', name: 'ধানমন্ডি উপজেলা', districtId: 1, address: 'ধানমন্ডি উপজেলা শিক্ষা অফিস', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { upazilaId: 2, upazilaCode: 'UPZ-002', name: 'মোহাম্মদপুর উপজেলা', districtId: 1, address: 'মোহাম্মদপুর উপজেলা শিক্ষা অফিস', isActive: true, createdAt: '2024-01-02T00:00:00Z' },
  { upazilaId: 3, upazilaCode: 'UPZ-003', name: 'সোনারগাঁ উপজেলা', districtId: 2, address: 'সোনারগাঁ উপজেলা শিক্ষা অফিস', isActive: true, createdAt: '2024-01-03T00:00:00Z' },
]

export const MOCK_SCHOOLS = [
  { schoolId: 1, schoolCode: 'SCH-001', name: 'ধানমন্ডি প্রাথমিক বিদ্যালয়', upazilaId: 1, address: 'ধানমন্ডি, ঢাকা', principalName: 'মোহাম্মদ করিম', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { schoolId: 2, schoolCode: 'SCH-002', name: 'মোহাম্মদপুর প্রাথমিক বিদ্যালয়', upazilaId: 2, address: 'মোহাম্মদপুর, ঢাকা', principalName: 'ফাতিমা বেগম', isActive: true, createdAt: '2024-01-02T00:00:00Z' },
  { schoolId: 3, schoolCode: 'SCH-003', name: 'সোনারগাঁ প্রাথমিক বিদ্যালয়', upazilaId: 3, address: 'সোনারগাঁ, নারায়ণগঞ্জ', principalName: 'আবদুল হামিদ', isActive: true, createdAt: '2024-01-03T00:00:00Z' },
]

export const MOCK_WAREHOUSES = [
  // Division Level Warehouse (Main Warehouse)
  { warehouseId: 1, name: 'প্রধান গুদাম - ঢাকা বিভাগ', warehouseCode: 'WH-001', address: 'প্রাথমিক শিক্ষা অধিদপ্তর, ঢাকা', level: 'DIVISION', levelId: 1, capacityUnits: 50000, isActive: true, canSupply: true, createdAt: '2024-01-01T00:00:00Z' },
  
  // District Level Warehouse
  { warehouseId: 2, name: 'ঢাকা জেলা গুদাম', warehouseCode: 'WH-002', address: 'ঢাকা জেলা শিক্ষা অফিস', level: 'DISTRICT', levelId: 1, capacityUnits: 20000, isActive: true, canSupply: true, createdAt: '2024-01-02T00:00:00Z' },
  { warehouseId: 3, name: 'নারায়ণগঞ্জ জেলা গুদাম', warehouseCode: 'WH-003', address: 'নারায়ণগঞ্জ জেলা শিক্ষা অফিস', level: 'DISTRICT', levelId: 2, capacityUnits: 15000, isActive: true, canSupply: true, createdAt: '2024-01-03T00:00:00Z' },
  
  // Upazila Level Warehouse
  { warehouseId: 4, name: 'ধানমন্ডি উপজেলা গুদাম', warehouseCode: 'WH-004', address: 'ধানমন্ডি উপজেলা শিক্ষা অফিস', level: 'UPAZILA', levelId: 1, capacityUnits: 8000, isActive: true, canSupply: false, createdAt: '2024-01-04T00:00:00Z' },
  { warehouseId: 5, name: 'মোহাম্মদপুর উপজেলা গুদাম', warehouseCode: 'WH-005', address: 'মোহাম্মদপুর উপজেলা শিক্ষা অফিস', level: 'UPAZILA', levelId: 2, capacityUnits: 7000, isActive: true, canSupply: false, createdAt: '2024-01-05T00:00:00Z' },
  { warehouseId: 6, name: 'সোনারগাঁ উপজেলা গুদাম', warehouseCode: 'WH-006', address: 'সোনারগাঁ উপজেলা শিক্ষা অফিস', level: 'UPAZILA', levelId: 3, capacityUnits: 6000, isActive: true, canSupply: false, createdAt: '2024-01-06T00:00:00Z' },
  
  // School Level Storage
  { warehouseId: 7, name: 'ধানমন্ডি প্রাথমিক বিদ্যালয় স্টোর', warehouseCode: 'WH-007', address: 'ধানমন্ডি, ঢাকা', level: 'SCHOOL', levelId: 1, capacityUnits: 2000, isActive: true, canSupply: false, createdAt: '2024-01-07T00:00:00Z' },
  { warehouseId: 8, name: 'মোহাম্মদপুর প্রাথমিক বিদ্যালয় স্টোর', warehouseCode: 'WH-008', address: 'মোহাম্মদপুর, ঢাকা', level: 'SCHOOL', levelId: 2, capacityUnits: 2000, isActive: true, canSupply: false, createdAt: '2024-01-08T00:00:00Z' },
  { warehouseId: 9, name: 'সোনারগাঁ প্রাথমিক বিদ্যালয় স্টোর', warehouseCode: 'WH-009', address: 'সোনারগাঁ, নারায়ণগঞ্জ', level: 'SCHOOL', levelId: 3, capacityUnits: 2000, isActive: true, canSupply: false, createdAt: '2024-01-09T00:00:00Z' },
]

export const MOCK_SUPPLIERS = [
  { supplierId: 1, name: 'বাংলাদেশ প্রযুক্তি সরবরাহ কোম্পানি', email: 'contact@bdtech.com.bd', phone: '+880-2-9876543', address: 'ঢাকা, বাংলাদেশ', contactPerson: 'মোহাম্মদ করিম', registrationNumber: 'REG-001', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { supplierId: 2, name: 'অফিস সরঞ্জাম বাংলাদেশ লিমিটেড', email: 'sales@officebd.com.bd', phone: '+880-2-8765432', address: 'ঢাকা, বাংলাদেশ', contactPerson: 'ফাতিমা বেগম', registrationNumber: 'REG-002', isActive: true, createdAt: '2024-01-02T00:00:00Z' },
  { supplierId: 3, name: 'আসবাবপত্র শিল্প বাংলাদেশ', email: 'info@furniturebd.com.bd', phone: '+880-2-7654321', address: 'ঢাকা, বাংলাদেশ', contactPerson: 'আবদুল হামিদ', registrationNumber: 'REG-003', isActive: true, createdAt: '2024-01-03T00:00:00Z' },
  { supplierId: 4, name: 'বৈশ্বিক ইলেকট্রনিক্স বাংলাদেশ', email: 'export@globalelecbd.com.bd', phone: '+880-2-6543210', address: 'চট্টগ্রাম, বাংলাদেশ', contactPerson: 'রহিম আহমেদ', registrationNumber: 'REG-004', isActive: true, createdAt: '2024-01-04T00:00:00Z' },
]

export const MOCK_GRADES = [
  // সিনিয়র পজিশন (Senior Positions)
  { id: 1, gradeNumber: 'G1', description: 'মহাপরিচালক (Director General)' },
  { id: 2, gradeNumber: 'G2', description: 'অতিরিক্ত মহাপরিচালক (Additional Director General)' },
  { id: 3, gradeNumber: 'G3', description: 'যুগ্ম মহাপরিচালক (Joint Director General)' },
  { id: 4, gradeNumber: 'G4', description: 'পরিচালক (Director)' },
  { id: 5, gradeNumber: 'G5', description: 'অতিরিক্ত পরিচালক (Additional Director)' },
  { id: 6, gradeNumber: 'G6', description: 'যুগ্ম পরিচালক (Joint Director)' },
  { id: 7, gradeNumber: 'G7', description: 'উপ-পরিচালক (Deputy Director)' },
  { id: 8, gradeNumber: 'G8', description: 'সহকারী পরিচালক (Assistant Director)' },
  { id: 9, gradeNumber: 'G9', description: 'প্রথম শ্রেণী কর্মচারী (First Class Officer)' },
  { id: 10, gradeNumber: 'G10', description: 'দ্বিতীয় শ্রেণী কর্মচারী (Second Class Officer)' },
  { id: 11, gradeNumber: 'G11', description: 'তৃতীয় শ্রেণী কর্মচারী (Third Class Officer)' },
  { id: 12, gradeNumber: 'G12', description: 'চতুর্থ শ্রেণী কর্মচারী (Fourth Class Officer)' },
  { id: 13, gradeNumber: 'G13', description: 'গুদাম ব্যবস্থাপক (Warehouse Manager)' },
  { id: 14, gradeNumber: 'G14', description: 'স্টক কর্মচারী (Stock Officer)' },
  { id: 15, gradeNumber: 'G15', description: 'সহায়ক কর্মচারী (Assistant Officer)' },
  { id: 16, gradeNumber: 'G16', description: 'ইন্টার্ন (Intern)' },
]

export const MOCK_EMPLOYEES = [
  { employeeId: 1, employeeCode: 'EMP-001', name: 'মোহাম্মদ করিম', grade: 'G13', position: 'গুদাম ব্যবস্থাপক', branchId: 1, mobileNumber: '+880-1700000001', email: 'karim@dpe.gov.bd', address: 'ঢাকা', servicePeriod: '৫ বছর', nidNumber: 'NID-001', dateOfBirth: '1985-05-15', gender: 'পুরুষ', nationality: 'বাংলাদেশী', createdAt: '2024-01-01T00:00:00Z' },
  { employeeId: 2, employeeCode: 'EMP-002', name: 'ফাতিমা বেগম', grade: 'G14', position: 'স্টক কর্মচারী', branchId: 1, mobileNumber: '+880-1700000002', email: 'fatima@dpe.gov.bd', address: 'ঢাকা', servicePeriod: '२ বছর', nidNumber: 'NID-002', dateOfBirth: '1992-08-22', gender: 'মহিলা', nationality: 'বাংলাদেশী', createdAt: '2024-01-02T00:00:00Z' },
  { employeeId: 3, employeeCode: 'EMP-003', name: 'আবদুল হামিদ', grade: 'G14', position: 'স্টক কর্মচারী', branchId: 2, mobileNumber: '+880-1700000003', email: 'hamid@dpe.gov.bd', address: 'চট্টগ্রাম', servicePeriod: '१ বছর', nidNumber: 'NID-003', dateOfBirth: '1995-03-10', gender: 'পুরুষ', nationality: 'বাংলাদেশী', createdAt: '2024-01-03T00:00:00Z' },
  { employeeId: 4, employeeCode: 'EMP-004', name: 'রহিমা আক্তার', grade: 'G8', position: 'সহকারী পরিচালক', branchId: 3, mobileNumber: '+880-1700000004', email: 'rahima@dpe.gov.bd', address: 'খুলনা', servicePeriod: '७ বছর', nidNumber: 'NID-004', dateOfBirth: '1982-11-28', gender: 'মহিলা', nationality: 'বাংলাদেশী', createdAt: '2024-01-04T00:00:00Z' },
  { employeeId: 5, employeeCode: 'EMP-005', name: 'জামিল আহমেদ', grade: 'G16', position: 'ইন্টার্ন', branchId: 1, mobileNumber: '+880-1700000005', email: 'jamil@dpe.gov.bd', address: 'ঢাকা', servicePeriod: '३ মাস', nidNumber: 'NID-005', dateOfBirth: '2000-06-05', gender: 'পুরুষ', nationality: 'বাংলাদেশী', createdAt: '2024-01-05T00:00:00Z' },
  { employeeId: 6, employeeCode: 'EMP-006', name: 'সালমা আক্তার', grade: 'G9', position: 'প্রথম শ্রেণী কর্মচারী', branchId: 1, mobileNumber: '+880-1700000006', email: 'salma@dpe.gov.bd', address: 'ঢাকা', servicePeriod: '৮ বছর', nidNumber: 'NID-006', dateOfBirth: '1980-07-20', gender: 'মহিলা', nationality: 'বাংলাদেশী', createdAt: '2024-01-06T00:00:00Z' },
  { employeeId: 7, employeeCode: 'EMP-007', name: 'রফিকুল ইসলাম', grade: 'G10', position: 'দ্বিতীয় শ্রেণী কর্মচারী', branchId: 2, mobileNumber: '+880-1700000007', email: 'rafiq@dpe.gov.bd', address: 'চট্টগ্রাম', servicePeriod: '৬ বছর', nidNumber: 'NID-007', dateOfBirth: '1983-09-12', gender: 'পুরুষ', nationality: 'বাংলাদেশী', createdAt: '2024-01-07T00:00:00Z' },
  { employeeId: 8, employeeCode: 'EMP-008', name: 'নাজমা বেগম', grade: 'G11', position: 'তৃতীয় শ্রেণী কর্মচারী', branchId: 3, mobileNumber: '+880-1700000008', email: 'nazma@dpe.gov.bd', address: 'খুলনা', servicePeriod: '४ বছর', nidNumber: 'NID-008', dateOfBirth: '1988-11-05', gender: 'মহিলা', nationality: 'বাংলাদেশী', createdAt: '2024-01-08T00:00:00Z' },
]

export const MOCK_USERS = [
  // Main Branch - Super Admin
  { id: 0, userId: 0, email: 'main@dpe.gov.bd', password: 'main123', firstName: 'মূল', lastName: 'প্রশাসক', fullName: 'মূল শাখা প্রশাসক', role: 'ROLE_SUPER_ADMIN', position: 'প্রধান প্রশাসক', level: 'MAIN', levelId: 0, enabled: true, createdAt: '2024-01-01T00:00:00Z', lastLogin: '2024-02-04T11:00:00Z', phone: '+880-2-9876543', address: 'প্রাথমিক শিক্ষা অধিদপ্তর, ঢাকা', branchName: 'প্রাথমিক শিক্ষা অধিদপ্তর (Main)', gradeId: 1, warehouseId: 1 },
  
  // Division Level - Main Admin
  { id: 1, userId: 1, email: 'admin@dpe.gov.bd', password: 'admin123', firstName: 'প্রশাসক', lastName: 'ব্যবহারকারী', fullName: 'প্রশাসক ব্যবহারকারী', role: 'ROLE_ADMIN', position: 'মহাপরিচালক', level: 'DIVISION', levelId: 1, enabled: true, createdAt: '2024-01-01T00:00:00Z', lastLogin: '2024-02-04T10:30:00Z', phone: '+880-2-9876543', address: 'প্রাথমিক শিক্ষা অধিদপ্তর, ঢাকা', branchName: 'ঢাকা বিভাগ', gradeId: 1, warehouseId: 1 },
  
  // District Level - District Manager
  { id: 2, userId: 2, email: 'district.dhaka@dpe.gov.bd', password: 'district123', firstName: 'জেলা', lastName: 'ব্যবস্থাপক', fullName: 'ঢাকা জেলা ব্যবস্থাপক', role: 'ROLE_DISTRICT_MANAGER', position: 'জেলা পরিচালক', level: 'DISTRICT', levelId: 1, enabled: true, createdAt: '2024-01-02T00:00:00Z', lastLogin: '2024-02-04T09:15:00Z', phone: '+880-1700000001', address: 'ঢাকা জেলা শিক্ষা অফিস', branchName: 'ঢাকা জেলা', gradeId: 4, warehouseId: 2 },
  { id: 3, userId: 3, email: 'district.narayanganj@dpe.gov.bd', password: 'district123', firstName: 'নারায়ণগঞ্জ', lastName: 'ব্যবস্থাপক', fullName: 'নারায়ণগঞ্জ জেলা ব্যবস্থাপক', role: 'ROLE_DISTRICT_MANAGER', position: 'জেলা পরিচালক', level: 'DISTRICT', levelId: 2, enabled: true, createdAt: '2024-01-03T00:00:00Z', lastLogin: '2024-02-04T08:45:00Z', phone: '+880-1700000002', address: 'নারায়ণগঞ্জ জেলা শিক্ষা অফিস', branchName: 'নারায়ণগঞ্জ জেলা', gradeId: 4, warehouseId: 3 },
  
  // Upazila Level - Upazila Manager
  { id: 4, userId: 4, email: 'upazila.dhanmondi@dpe.gov.bd', password: 'upazila123', firstName: 'ধানমন্ডি', lastName: 'ব্যবস্থাপক', fullName: 'ধানমন্ডি উপজেলা ব্যবস্থাপক', role: 'ROLE_UPAZILA_MANAGER', position: 'উপজেলা পরিচালক', level: 'UPAZILA', levelId: 1, enabled: true, createdAt: '2024-01-04T00:00:00Z', lastLogin: '2024-02-04T07:30:00Z', phone: '+880-1700000003', address: 'ধানমন্ডি উপজেলা শিক্ষা অফিস', branchName: 'ধানমন্ডি উপজেলা', gradeId: 7, warehouseId: 4 },
  { id: 5, userId: 5, email: 'upazila.mohammadpur@dpe.gov.bd', password: 'upazila123', firstName: 'মোহাম্মদপুর', lastName: 'ব্যবস্থাপক', fullName: 'মোহাম্মদপুর উপজেলা ব্যবস্থাপক', role: 'ROLE_UPAZILA_MANAGER', position: 'উপজেলা পরিচালক', level: 'UPAZILA', levelId: 2, enabled: true, createdAt: '2024-01-05T00:00:00Z', lastLogin: '2024-02-04T06:45:00Z', phone: '+880-1700000004', address: 'মোহাম্মদপুর উপজেলা শিক্ষা অফিস', branchName: 'মোহাম্মদপুর উপজেলা', gradeId: 7, warehouseId: 5 },
  { id: 6, userId: 6, email: 'upazila.sonargaon@dpe.gov.bd', password: 'upazila123', firstName: 'সোনারগাঁ', lastName: 'ব্যবস্থাপক', fullName: 'সোনারগাঁ উপজেলা ব্যবস্থাপক', role: 'ROLE_UPAZILA_MANAGER', position: 'উপজেলা পরিচালক', level: 'UPAZILA', levelId: 3, enabled: true, createdAt: '2024-01-06T00:00:00Z', lastLogin: '2024-02-04T06:00:00Z', phone: '+880-1700000005', address: 'সোনারগাঁ উপজেলা শিক্ষা অফিস', branchName: 'সোনারগাঁ উপজেলা', gradeId: 7, warehouseId: 6 },
  
  // School Level - School Principal
  { id: 7, userId: 7, email: 'school.dhanmondi@dpe.gov.bd', password: 'school123', firstName: 'ধানমন্ডি', lastName: 'প্রধানশিক্ষক', fullName: 'ধানমন্ডি প্রাথমিক বিদ্যালয় প্রধানশিক্ষক', role: 'ROLE_SCHOOL_PRINCIPAL', position: 'প্রধানশিক্ষক', level: 'SCHOOL', levelId: 1, enabled: true, createdAt: '2024-01-07T00:00:00Z', lastLogin: '2024-02-04T05:30:00Z', phone: '+880-1700000006', address: 'ধানমন্ডি, ঢাকা', branchName: 'ধানমন্ডি প্রাথমিক বিদ্যালয়', gradeId: 8, warehouseId: 7 },
  { id: 8, userId: 8, email: 'school.mohammadpur@dpe.gov.bd', password: 'school123', firstName: 'মোহাম্মদপুর', lastName: 'প্রধানশিক্ষক', fullName: 'মোহাম্মদপুর প্রাথমিক বিদ্যালয় প্রধানশিক্ষক', role: 'ROLE_SCHOOL_PRINCIPAL', position: 'প্রধানশিক্ষক', level: 'SCHOOL', levelId: 2, enabled: true, createdAt: '2024-01-08T00:00:00Z', lastLogin: '2024-02-04T05:00:00Z', phone: '+880-1700000007', address: 'মোহাম্মদপুর, ঢাকা', branchName: 'মোহাম্মদপুর প্রাথমিক বিদ্যালয়', gradeId: 8, warehouseId: 8 },
  { id: 9, userId: 9, email: 'school.sonargaon@dpe.gov.bd', password: 'school123', firstName: 'সোনারগাঁ', lastName: 'প্রধানশিক্ষক', fullName: 'সোনারগাঁ প্রাথমিক বিদ্যালয় প্রধানশিক্ষক', role: 'ROLE_SCHOOL_PRINCIPAL', position: 'প্রধানশিক্ষক', level: 'SCHOOL', levelId: 3, enabled: true, createdAt: '2024-01-09T00:00:00Z', lastLogin: '2024-02-04T04:30:00Z', phone: '+880-1700000008', address: 'সোনারগাঁ, নারায়ণগঞ্জ', branchName: 'সোনারগাঁ প্রাথমিক বিদ্যালয়', gradeId: 8, warehouseId: 9 },
]

export const MOCK_STATISTICS = {
  totalItems: 50,
  totalValue: 2500000,
  lowStockCount: 5,
  outOfStockCount: 0,
}


export const MOCK_STOCK_IN_TRANSACTIONS = [
  { referenceNumber: 'SI-2024-001', count: 5, createdBy: 'admin@dpe.gov.bd', createdAt: '2024-02-01T08:00:00Z', updatedAt: '2024-02-01T08:00:00Z', supplierName: 'বাংলাদেশ প্রযুক্তি সরবরাহ কোম্পানি', sourceMode: 'SUPPLIER' as const },
  { referenceNumber: 'SI-2024-002', count: 3, createdBy: 'admin@dpe.gov.bd', createdAt: '2024-02-02T09:30:00Z', updatedAt: '2024-02-02T09:30:00Z', supplierName: 'অফিস সরঞ্জাম বাংলাদেশ লিমিটেড', sourceMode: 'SUPPLIER' as const },
  { referenceNumber: 'SI-2024-003', count: 4, createdBy: 'user@dpe.gov.bd', createdAt: '2024-02-03T10:15:00Z', updatedAt: '2024-02-03T10:15:00Z', supplierName: 'আসবাবপত্র শিল্প বাংলাদেশ', sourceMode: 'SUPPLIER' as const },
]

export const MOCK_STOCK_IN_DETAILS = [
  { itemId: 1, sku: 'HP-M426DW', name: 'HP Laser Jet Pro M426dw Printer', quantity: 5, createdAt: '2024-02-01T08:00:00Z', supplierId: 1, warehouseId: 1 },
  { itemId: 2, sku: 'HP-M453DW', name: 'HP Color Laser Jet Pro M453dw Printer', quantity: 3, createdAt: '2024-02-01T08:00:00Z', supplierId: 1, warehouseId: 1 },
  { itemId: 3, sku: 'HP-M1132-TONER', name: 'HP Laser Jet M1132 Printer Toner', quantity: 20, createdAt: '2024-02-02T09:30:00Z', supplierId: 2, warehouseId: 1 },
  { itemId: 4, sku: 'BROTHER-L8360', name: 'Brother HL-L8360CDW Printer', quantity: 2, createdAt: '2024-02-02T09:30:00Z', supplierId: 2, warehouseId: 1 },
  { itemId: 47, sku: 'CHAIR-STUDENT', name: 'Student Chair (Ergonomic)', quantity: 12, createdAt: '2024-02-03T10:15:00Z', supplierId: 3, warehouseId: 2 },
  { itemId: 48, sku: 'DESK-OFFICE', name: 'Office Desk (Standard)', quantity: 6, createdAt: '2024-02-03T10:15:00Z', supplierId: 3, warehouseId: 2 },
]

export const MOCK_STOCK_OUT_TRANSACTIONS = [
  { id: 1, referenceNumber: 'SO-2024-001', stockOutType: 'USED', itemId: 39, itemName: 'HDMI Cable (3 Meter)', itemSku: 'HDMI-3M', quantity: 10, stockOutDate: '2024-02-01T14:00:00Z', note: 'অফিস সেটআপের জন্য ব্যবহৃত', sourceWarehouseId: 1, branchId: null, employeeId: null, sourceWarehouseName: 'প্রধান গুদাম - ঢাকা', branchName: null, employeeName: null },
  { id: 2, referenceNumber: 'SO-2024-002', stockOutType: 'EMPLOYEE', itemId: 25, itemName: 'UPS (1.5 KVA)', itemSku: 'UPS-1.5KVA', quantity: 1, stockOutDate: '2024-02-02T11:00:00Z', note: 'কর্মচারীকে জারি করা হয়েছে', sourceWarehouseId: 1, branchId: null, employeeId: 1, sourceWarehouseName: 'প্রধান গুদাম - ঢাকা', branchName: null, employeeName: 'মোহাম্মদ করিম' },
  { id: 3, referenceNumber: 'SO-2024-003', stockOutType: 'BRANCH_TRANSFER', itemId: 43, itemName: 'A4 Paper (500 sheets)', itemSku: 'PAPER-A4-500', quantity: 50, stockOutDate: '2024-02-03T09:30:00Z', note: 'শাখায় স্থানান্তর', sourceWarehouseId: 1, branchId: 2, employeeId: null, sourceWarehouseName: 'প্রধান গুদাম - ঢাকা', branchName: 'আঞ্চলিক অফিস - চট্টগ্রাম', employeeName: null },
  { id: 4, referenceNumber: 'SO-2024-004', stockOutType: 'DAMAGE', itemId: 22, itemName: 'USB HUB (4 Port USB 3.0 Hub)', itemSku: 'USB-HUB-4PORT', quantity: 2, stockOutDate: '2024-02-04T13:45:00Z', note: 'পরিচালনার সময় ক্ষতিগ্রস্ত', sourceWarehouseId: 2, branchId: null, employeeId: null, sourceWarehouseName: 'আঞ্চলিক অফিস - চট্টগ্রাম', branchName: null, employeeName: null },
]

export const MOCK_PURCHASE_ORDERS = [
  { purchaseOrderId: 1, purchaseOrderCode: 'PO-2024-001', supplierId: 1, supplierName: 'বাংলাদেশ প্রযুক্তি সরবরাহ কোম্পানি', warehouseId: 1, warehouseName: 'প্রধান গুদাম - ঢাকা', status: 'PENDING', orderDate: '2024-02-01T08:00:00Z', expectedDeliveryDate: '2024-02-15T00:00:00Z', totalAmount: 175000, notes: 'জরুরি অর্ডার', createdAt: '2024-02-01T08:00:00Z' },
  { purchaseOrderId: 2, purchaseOrderCode: 'PO-2024-002', supplierId: 2, supplierName: 'অফিস সরঞ্জাম বাংলাদেশ লিমিটেড', warehouseId: 1, warehouseName: 'প্রধান গুদাম - ঢাকা', status: 'CONFIRMED', orderDate: '2024-02-02T09:00:00Z', expectedDeliveryDate: '2024-02-20T00:00:00Z', totalAmount: 85000, notes: 'নিয়মিত অর্ডার', createdAt: '2024-02-02T09:00:00Z' },
  { purchaseOrderId: 3, purchaseOrderCode: 'PO-2024-003', supplierId: 3, supplierName: 'আসবাবপত্র শিল্য বাংলাদেশ', warehouseId: 2, warehouseName: 'আঞ্চলিক অফিস - চট্টগ্রাম', status: 'DELIVERED', orderDate: '2024-01-25T10:00:00Z', expectedDeliveryDate: '2024-02-10T00:00:00Z', totalAmount: 120000, notes: 'অফিস আসবাবপত্র', createdAt: '2024-01-25T10:00:00Z' },
]

export const MOCK_SALES_ORDERS = [
  { salesOrderId: 1, warehouseId: 1, warehouseName: 'প্রধান গুদাম - ঢাকা', status: 'PENDING', orderDate: '2024-02-03T10:00:00Z', deliveryDate: '2024-02-10T00:00:00Z', totalAmount: 50000, customerName: 'ঢাকা জেলা শিক্ষা অফিস', customerEmail: 'orders@dhakaedu.gov.bd', notes: 'বাল্ক অর্ডার', createdBy: 'admin@dpe.gov.bd', createdAt: '2024-02-03T10:00:00Z' },
  { salesOrderId: 2, warehouseId: 2, warehouseName: 'আঞ্চলিক অফিস - চট্টগ্রাম', status: 'CONFIRMED', orderDate: '2024-02-02T14:00:00Z', deliveryDate: '2024-02-08T00:00:00Z', totalAmount: 27000, customerName: 'চট্টগ্রাম জেলা শিক্ষা অফিস', customerEmail: 'orders@chattogramdu.gov.bd', notes: 'নিয়মিত অর্ডার', createdBy: 'user@dpe.gov.bd', createdAt: '2024-02-02T14:00:00Z' },
]

export const MOCK_STOCK_TRANSFERS = [
  { transferId: 1, itemId: 43, itemName: 'A4 Paper (500 sheets)', itemSku: 'PAPER-A4-500', fromWarehouseId: 1, fromWarehouseName: 'প্রধান গুদাম - ঢাকা', toWarehouseId: 2, toWarehouseName: 'আঞ্চলিক অফিস - চট্টগ্রাম', quantity: 100, status: 'COMPLETED', notes: 'নিয়মিত স্থানান্তর', createdBy: 'admin@dpe.gov.bd', createdAt: '2024-02-01T08:00:00Z' },
  { transferId: 2, itemId: 39, itemName: 'HDMI Cable (3 Meter)', itemSku: 'HDMI-3M', fromWarehouseId: 1, fromWarehouseName: 'প্রধান গুদাম - ঢাকা', toWarehouseId: 3, toWarehouseName: 'বিতরণ কেন্দ্র - খুলনা', quantity: 15, status: 'PENDING', notes: 'অপেক্ষমাণ স্থানান্তর', createdBy: 'user@dpe.gov.bd', createdAt: '2024-02-03T09:00:00Z' },
]

export const MOCK_DEMANDS = [
  // School Level Demands (from schools to upazila)
  { demandId: 1, demandCode: 'DEM-2024-001', employeeId: 1, demanderName: 'ধানমন্ডি প্রাথমিক বিদ্যালয়', position: 'প্রধানশিক্ষক', grade: 'G8', level: 'SCHOOL', levelId: 1, status: 'PENDING', note: 'অফিস সরঞ্জাম প্রয়োজন', itemId: 43, itemName: 'A4 Paper (500 sheets)', sku: 'PAPER-A4-500', sourceWarehouseId: 4, destinationWarehouseId: 7, requestedByName: 'ধানমন্ডি প্রাথমিক বিদ্যালয়', createdAt: '2024-02-02T10:00:00Z' },
  { demandId: 2, demandCode: 'DEM-2024-002', employeeId: 2, demanderName: 'মোহাম্মদপুর প্রাথমিক বিদ্যালয়', position: 'প্রধানশিক্ষক', grade: 'G8', level: 'SCHOOL', levelId: 2, status: 'APPROVED', note: 'প্রযুক্তি সরঞ্জাম প্রয়োজন', itemId: 25, itemName: 'UPS (1.5 KVA)', sku: 'UPS-1.5KVA', sourceWarehouseId: 5, destinationWarehouseId: 8, requestedByName: 'মোহাম্মদপুর প্রাথমিক বিদ্যালয়', createdAt: '2024-02-01T14:00:00Z' },
  { demandId: 3, demandCode: 'DEM-2024-003', employeeId: 3, demanderName: 'সোনারগাঁ প্রাথমিক বিদ্যালয়', position: 'প্রধানশিক্ষক', grade: 'G8', level: 'SCHOOL', levelId: 3, status: 'PENDING', note: 'নেটওয়ার্ক সরঞ্জাম প্রয়োজন', itemId: 28, itemName: 'Network Cable (Cat 6) 100m', sku: 'CAT6-100M', sourceWarehouseId: 6, destinationWarehouseId: 9, requestedByName: 'সোনারগাঁ প্রাথমিক বিদ্যালয়', createdAt: '2024-02-03T11:00:00Z' },
  
  // Upazila Level Demands (from upazila to district)
  { demandId: 4, demandCode: 'DEM-2024-004', employeeId: 4, demanderName: 'ধানমন্ডি উপজেলা', position: 'উপজেলা পরিচালক', grade: 'G7', level: 'UPAZILA', levelId: 1, status: 'APPROVED', note: 'প্রিন্টার সরঞ্জাম প্রয়োজন', itemId: 1, itemName: 'HP Laser Jet Pro M426dw Printer', sku: 'HP-M426DW', sourceWarehouseId: 2, destinationWarehouseId: 4, requestedByName: 'ধানমন্ডি উপজেলা', createdAt: '2024-02-04T09:30:00Z' },
  { demandId: 5, demandCode: 'DEM-2024-005', employeeId: 5, demanderName: 'মোহাম্মদপুর উপজেলা', position: 'উপজেলা পরিচালক', grade: 'G7', level: 'UPAZILA', levelId: 2, status: 'PENDING', note: 'কম্পিউটার হার্ডওয়্যার প্রয়োজন', itemId: 12, itemName: 'Laptop (Intel i7, 8GB RAM)', sku: 'LAPTOP-I7-8GB', sourceWarehouseId: 2, destinationWarehouseId: 5, requestedByName: 'মোহাম্মদপুর উপজেলা', createdAt: '2024-02-05T10:15:00Z' },
  { demandId: 6, demandCode: 'DEM-2024-006', employeeId: 6, demanderName: 'সোনারগাঁ উপজেলা', position: 'উপজেলা পরিচালক', grade: 'G7', level: 'UPAZILA', levelId: 3, status: 'APPROVED', note: 'অফিস আসবাবপত্র প্রয়োজন', itemId: 47, itemName: 'Student Chair (Ergonomic)', sku: 'CHAIR-STUDENT', sourceWarehouseId: 3, destinationWarehouseId: 6, requestedByName: 'সোনারগাঁ উপজেলা', createdAt: '2024-02-06T08:45:00Z' },
  
  // District Level Demands (from district to division)
  { demandId: 7, demandCode: 'DEM-2024-007', employeeId: 7, demanderName: 'ঢাকা জেলা', position: 'জেলা পরিচালক', grade: 'G4', level: 'DISTRICT', levelId: 1, status: 'PENDING', note: 'বাল্ক সরঞ্জাম প্রয়োজন', itemId: 43, itemName: 'A4 Paper (500 sheets)', sku: 'PAPER-A4-500', sourceWarehouseId: 1, destinationWarehouseId: 2, requestedByName: 'ঢাকা জেলা', createdAt: '2024-02-07T14:20:00Z' },
  { demandId: 8, demandCode: 'DEM-2024-008', employeeId: 8, demanderName: 'নারায়ণগঞ্জ জেলা', position: 'জেলা পরিচালক', grade: 'G4', level: 'DISTRICT', levelId: 2, status: 'APPROVED', note: 'প্রযুক্তি সরঞ্জাম প্রয়োজন', itemId: 11, itemName: 'Desktop Computer (i5 Processor)', sku: 'DESKTOP-I5', sourceWarehouseId: 1, destinationWarehouseId: 3, requestedByName: 'নারায়ণগঞ্জ জেলা', createdAt: '2024-02-08T11:00:00Z' },
]

export const MOCK_BATCHES = [
  { batchId: 1, itemId: 1, batchNumber: 'BATCH-001', supplierId: 1, expiryDate: '2025-12-31T00:00:00Z', manufacturingDate: '2024-01-01T00:00:00Z', quantityReceived: 5, isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { batchId: 2, itemId: 3, batchNumber: 'BATCH-002', supplierId: 1, expiryDate: '2026-06-30T00:00:00Z', manufacturingDate: '2024-01-15T00:00:00Z', quantityReceived: 20, isActive: true, createdAt: '2024-01-15T00:00:00Z' },
]

export const MOCK_STOCK_OUT_REASONS = [
  { reasonType: 'TRANSFERRED', reasonLabel: 'স্থানান্তরিত', count: 45, percentage: 28 },
  { reasonType: 'GIVEN', reasonLabel: 'কর্মচারীকে প্রদান করা', count: 38, percentage: 24 },
  { reasonType: 'USED', reasonLabel: 'ব্যবহৃত', count: 32, percentage: 20 },
  { reasonType: 'DAMAGED', reasonLabel: 'ক্ষতিগ্রস্ত', count: 25, percentage: 16 },
  { reasonType: 'LOST', reasonLabel: 'হারিয়ে গেছে', count: 12, percentage: 8 },
  { reasonType: 'EXPIRED', reasonLabel: 'মেয়াদ উত্তীর্ণ', count: 10, percentage: 4 },
]

export const MOCK_STOCK_MOVEMENTS = [
  // Stock In movements
  { id: 'SM-001', itemName: 'HP Laser Jet Pro M426dw Printer', itemSku: 'HP-M426DW', movementType: 'IN' as const, quantity: 5, previousStock: 0, newStock: 5, reason: undefined, recipient: undefined, notes: 'সরবরাহকারী থেকে গৃহীত', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-01T08:00:00Z' },
  { id: 'SM-002', itemName: 'HDMI Cable (3 Meter)', itemSku: 'HDMI-3M', movementType: 'IN' as const, quantity: 40, previousStock: 0, newStock: 40, reason: undefined, recipient: undefined, notes: 'বাল্ক অর্ডার গৃহীত', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-02T09:30:00Z' },
  { id: 'SM-003', itemName: 'Student Chair (Ergonomic)', itemSku: 'CHAIR-STUDENT', movementType: 'IN' as const, quantity: 12, previousStock: 0, newStock: 12, reason: undefined, recipient: undefined, notes: 'নতুন স্টক যোগ করা হয়েছে', userName: 'ডেমো ব্যবহারকারী', userEmail: 'user@dpe.gov.bd', createdAt: '2024-02-03T10:15:00Z' },
  { id: 'SM-004', itemName: 'A4 Paper (500 sheets)', itemSku: 'PAPER-A4-500', movementType: 'IN' as const, quantity: 200, previousStock: 0, newStock: 200, reason: undefined, recipient: undefined, notes: 'অফিস সরঞ্জাম বাংলাদেশ থেকে সরবরাহ', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-04T08:45:00Z' },
  { id: 'SM-005', itemName: 'Pen Set (12 pieces)', itemSku: 'PEN-SET-12', movementType: 'IN' as const, quantity: 150, previousStock: 0, newStock: 150, reason: undefined, recipient: undefined, notes: 'প্রযুক্তি সরবরাহকারী থেকে গৃহীত', userName: 'ডেমো ব্যবহারকারী', userEmail: 'user@dpe.gov.bd', createdAt: '2024-02-05T11:20:00Z' },

  // Stock Out - Transferred
  { id: 'SM-006', itemName: 'A4 Paper (500 sheets)', itemSku: 'PAPER-A4-500', movementType: 'OUT' as const, quantity: 50, previousStock: 200, newStock: 150, reason: 'TRANSFERRED', recipient: 'আঞ্চলিক অফিস - চট্টগ্রাম', notes: 'চট্টগ্রাম শাখায় স্থানান্তর', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-01T14:00:00Z' },
  { id: 'SM-007', itemName: 'HDMI Cable (3 Meter)', itemSku: 'HDMI-3M', movementType: 'OUT' as const, quantity: 15, previousStock: 40, newStock: 25, reason: 'TRANSFERRED', recipient: 'বিতরণ কেন্দ্র - খুলনা', notes: 'খুলনা বিতরণ কেন্দ্রে স্থানান্তর', userName: 'ডেমো ব্যবহারকারী', userEmail: 'user@dpe.gov.bd', createdAt: '2024-02-02T15:30:00Z' },
  { id: 'SM-008', itemName: 'Network Cable (Cat 6) 100m', itemSku: 'CAT6-100M', movementType: 'OUT' as const, quantity: 5, previousStock: 20, newStock: 15, reason: 'TRANSFERRED', recipient: 'আঞ্চলিক হাব - সিলেট', notes: 'সিলেট অফিসে স্থানান্তর', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-03T09:00:00Z' },

  // Stock Out - Given to Employee
  { id: 'SM-009', itemName: 'UPS (1.5 KVA)', itemSku: 'UPS-1.5KVA', movementType: 'OUT' as const, quantity: 1, previousStock: 4, newStock: 3, reason: 'GIVEN', recipient: 'মোহাম্মদ করিম', notes: 'কর্মচারীকে অফিস সরঞ্জাম প্রদান', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-01T10:30:00Z' },
  { id: 'SM-010', itemName: 'USB HUB (4 Port USB 3.0 Hub)', itemSku: 'USB-HUB-4PORT', movementType: 'OUT' as const, quantity: 2, previousStock: 30, newStock: 28, reason: 'GIVEN', recipient: 'ফাতিমা বেগম', notes: 'নতুন কর্মচারীকে সরঞ্জাম বরাদ্দ', userName: 'ডেমো ব্যবহারকারী', userEmail: 'user@dpe.gov.bd', createdAt: '2024-02-02T11:45:00Z' },
  { id: 'SM-011', itemName: 'Pen Set (12 pieces)', itemSku: 'PEN-SET-12', movementType: 'OUT' as const, quantity: 10, previousStock: 150, newStock: 140, reason: 'GIVEN', recipient: 'আবদুল হামিদ', notes: 'অফিস স্টেশনারি বিতরণ', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-03T13:15:00Z' },

  // Stock Out - Used
  { id: 'SM-012', itemName: 'HDMI Cable (3 Meter)', itemSku: 'HDMI-3M', movementType: 'OUT' as const, quantity: 10, previousStock: 25, newStock: 15, reason: 'USED', recipient: undefined, notes: 'অফিস সেটআপে ব্যবহৃত', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-04T09:00:00Z' },
  { id: 'SM-013', itemName: 'A4 Paper (500 sheets)', itemSku: 'PAPER-A4-500', movementType: 'OUT' as const, quantity: 30, previousStock: 150, newStock: 120, reason: 'USED', recipient: undefined, notes: 'প্রশাসনিক কাজে ব্যবহৃত', userName: 'ডেমো ব্যবহারকারী', userEmail: 'user@dpe.gov.bd', createdAt: '2024-02-05T10:30:00Z' },
  { id: 'SM-014', itemName: 'Notebook A5 (Lined)', itemSku: 'NOTEBOOK-A5', movementType: 'OUT' as const, quantity: 50, previousStock: 300, newStock: 250, reason: 'USED', recipient: undefined, notes: 'প্রশিক্ষণ কর্মসূচিতে বিতরণ', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-01T12:00:00Z' },

  // Stock Out - Damaged
  { id: 'SM-015', itemName: 'USB HUB (4 Port USB 3.0 Hub)', itemSku: 'USB-HUB-4PORT', movementType: 'OUT' as const, quantity: 2, previousStock: 28, newStock: 26, reason: 'DAMAGED', recipient: undefined, notes: 'পরিবহনের সময় ক্ষতিগ্রস্ত', userName: 'ডেমো ব্যবহারকারী', userEmail: 'user@dpe.gov.bd', createdAt: '2024-02-02T14:20:00Z' },
  { id: 'SM-016', itemName: 'Desktop Monitor (Samsung 19")', itemSku: 'MONITOR-SAMSUNG-19', movementType: 'OUT' as const, quantity: 1, previousStock: 7, newStock: 6, reason: 'DAMAGED', recipient: undefined, notes: 'বিদ্যুৎ সমস্যায় ক্ষতিগ্রস্ত', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-03T16:45:00Z' },

  // Stock Out - Lost
  { id: 'SM-017', itemName: 'Pen Set (12 pieces)', itemSku: 'PEN-SET-12', movementType: 'OUT' as const, quantity: 3, previousStock: 140, newStock: 137, reason: 'LOST', recipient: undefined, notes: 'অফিস থেকে হারিয়ে গেছে', userName: 'ডেমো ব্যবহারকারী', userEmail: 'user@dpe.gov.bd', createdAt: '2024-02-04T11:00:00Z' },

  // Stock Out - Expired
  { id: 'SM-018', itemName: 'UPS (1.5 KVA)', itemSku: 'UPS-1.5KVA', movementType: 'OUT' as const, quantity: 1, previousStock: 3, newStock: 2, reason: 'EXPIRED', recipient: undefined, notes: 'ওয়ারেন্টি মেয়াদ উত্তীর্ণ', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-05T13:30:00Z' },

  // Adjustment movements
  { id: 'SM-019', itemName: 'HP Laser Jet Pro M426dw Printer', itemSku: 'HP-M426DW', movementType: 'ADJUSTMENT' as const, quantity: 1, previousStock: 5, newStock: 6, reason: undefined, recipient: undefined, notes: 'স্টক গণনা সংশোধন', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-01T16:00:00Z' },
  { id: 'SM-020', itemName: 'Student Chair (Ergonomic)', itemSku: 'CHAIR-STUDENT', movementType: 'ADJUSTMENT' as const, quantity: -1, previousStock: 12, newStock: 11, reason: undefined, recipient: undefined, notes: 'ভৌত গণনায় ত্রুটি সংশোধন', userName: 'ডেমো ব্যবহারকারী', userEmail: 'user@dpe.gov.bd', createdAt: '2024-02-02T17:15:00Z' },
  { id: 'SM-021', itemName: 'Pen Set (12 pieces)', itemSku: 'PEN-SET-12', movementType: 'ADJUSTMENT' as const, quantity: 5, previousStock: 137, newStock: 142, reason: undefined, recipient: undefined, notes: 'সিস্টেম সিঙ্ক সংশোধন', userName: 'প্রশাসক ব্যবহারকারী', userEmail: 'admin@dpe.gov.bd', createdAt: '2024-02-03T18:30:00Z' },
]
