// Mock data for all features - disables database connections
export const MOCK_CATEGORIES = [
  { id: 1, code: 'CAT001', name: 'শিক্ষা উপকরণ', description: 'শিক্ষা সামগ্রী এবং পাঠ্য সহায়ক', color: '#3B82F6', createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, code: 'CAT002', name: 'অফিস সরঞ্জাম', description: 'অফিস এবং স্টেশনারি আইটেম', color: '#10B981', createdAt: '2024-01-02T00:00:00Z' },
  { id: 3, code: 'CAT003', name: 'কম্পিউটার সরঞ্জাম', description: 'কম্পিউটার এবং প্রযুক্তি সরঞ্জাম', color: '#F59E0B', createdAt: '2024-01-03T00:00:00Z' },
  { id: 4, code: 'CAT004', name: 'আসবাবপত্র', description: 'অফিস এবং শ্রেণীকক্ষ আসবাবপত্র', color: '#8B5CF6', createdAt: '2024-01-04T00:00:00Z' },
  { id: 5, code: 'CAT005', name: 'ভোগ্য পণ্য', description: 'ভোগ্য এবং খরচযোগ্য আইটেম', color: '#EC4899', createdAt: '2024-01-05T00:00:00Z' },
]

export const MOCK_ITEMS = [
  { itemId: 1, name: 'ডেস্কটপ কম্পিউটার', sku: 'COMP-DT-001', description: 'শিক্ষা কেন্দ্রের জন্য ডেস্কটপ কম্পিউটার', unitPrice: 35000, currentStock: 15, categoryId: 3, categoryName: 'কম্পিউটার সরঞ্জাম', minimumStock: 5, maximumStock: 30, reorderLevel: 10, createdAt: '2024-01-01T00:00:00Z' },
  { itemId: 2, name: 'ইউএসবি কেবল', sku: 'USB-CABLE-001', description: '২ মিটার ইউএসবি কেবল', unitPrice: 500, currentStock: 150, categoryId: 3, categoryName: 'কম্পিউটার সরঞ্জাম', minimumStock: 50, maximumStock: 300, reorderLevel: 100, createdAt: '2024-01-02T00:00:00Z' },
  { itemId: 3, name: 'শিক্ষার্থী চেয়ার', sku: 'CHAIR-STU-001', description: 'এরগনমিক শিক্ষার্থী চেয়ার', unitPrice: 8000, currentStock: 8, categoryId: 4, categoryName: 'আসবাবপত্র', minimumStock: 3, maximumStock: 20, reorderLevel: 5, createdAt: '2024-01-03T00:00:00Z' },
  { itemId: 4, name: 'এ৪ কাগজ রিম', sku: 'PAPER-A4-001', description: '৫০০ শীট এ৪ কাগজ', unitPrice: 200, currentStock: 200, categoryId: 2, categoryName: 'অফিস সরঞ্জাম', minimumStock: 50, maximumStock: 500, reorderLevel: 100, createdAt: '2024-01-04T00:00:00Z' },
  { itemId: 5, name: 'এলইডি ডেস্ক ল্যাম্প', sku: 'LAMP-LED-001', description: 'ইউএসবি সহ এলইডি ডেস্ক ল্যাম্প', unitPrice: 1500, currentStock: 0, categoryId: 3, categoryName: 'কম্পিউটার সরঞ্জাম', minimumStock: 10, maximumStock: 50, reorderLevel: 15, createdAt: '2024-01-05T00:00:00Z' },
  { itemId: 6, name: 'মেকানিক্যাল কীবোর্ড', sku: 'KB-MECH-001', description: 'আরজিবি মেকানিক্যাল কীবোর্ড', unitPrice: 4000, currentStock: 12, categoryId: 3, categoryName: 'কম্পিউটার সরঞ্জাম', minimumStock: 5, maximumStock: 25, reorderLevel: 8, createdAt: '2024-01-06T00:00:00Z' },
  { itemId: 7, name: 'ওয়্যারলেস মাউস', sku: 'MOUSE-WL-001', description: 'ওয়্যারলেস অপটিক্যাল মাউস', unitPrice: 1200, currentStock: 45, categoryId: 3, categoryName: 'কম্পিউটার সরঞ্জাম', minimumStock: 20, maximumStock: 100, reorderLevel: 30, createdAt: '2024-01-07T00:00:00Z' },
  { itemId: 8, name: 'মনিটর ২৭ ইঞ্চি', sku: 'MON-27-001', description: '২৭ ইঞ্চি ৪কে মনিটর', unitPrice: 12000, currentStock: 6, categoryId: 3, categoryName: 'কম্পিউটার সরঞ্জাম', minimumStock: 2, maximumStock: 15, reorderLevel: 4, createdAt: '2024-01-08T00:00:00Z' },
  { itemId: 9, name: 'কলম সেট', sku: 'PEN-SET-001', description: '১২টি বলপয়েন্ট কলমের সেট', unitPrice: 300, currentStock: 300, categoryId: 2, categoryName: 'অফিস সরঞ্জাম', minimumStock: 100, maximumStock: 500, reorderLevel: 200, createdAt: '2024-01-09T00:00:00Z' },
  { itemId: 10, name: 'নোটবুক এ৫', sku: 'NOTE-A5-001', description: 'এ৫ লাইনযুক্ত নোটবুক', unitPrice: 100, currentStock: 500, categoryId: 2, categoryName: 'অফিস সরঞ্জাম', minimumStock: 200, maximumStock: 1000, reorderLevel: 300, createdAt: '2024-01-10T00:00:00Z' },
]

export const MOCK_WAREHOUSES = [
  { warehouseId: 1, name: 'প্রধান গুদাম - ঢাকা', warehouseCode: 'WH-001', address: 'প্রাথমিক শিক্ষা অধিদপ্তর, ঢাকা', capacityUnits: 10000, isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { warehouseId: 2, name: 'আঞ্চলিক অফিস - চট্টগ্রাম', warehouseCode: 'WH-002', address: 'চট্টগ্রাম বিভাগীয় অফিস', capacityUnits: 5000, isActive: true, createdAt: '2024-01-02T00:00:00Z' },
  { warehouseId: 3, name: 'বিতরণ কেন্দ্র - খুলনা', warehouseCode: 'WH-003', address: 'খুলনা বিভাগীয় অফিস', capacityUnits: 15000, isActive: true, createdAt: '2024-01-03T00:00:00Z' },
  { warehouseId: 4, name: 'আঞ্চলিক হাব - সিলেট', warehouseCode: 'WH-004', address: 'সিলেট বিভাগীয় অফিস', capacityUnits: 8000, isActive: true, createdAt: '2024-01-04T00:00:00Z' },
]

export const MOCK_SUPPLIERS = [
  { supplierId: 1, name: 'বাংলাদেশ প্রযুক্তি সরবরাহ কোম্পানি', email: 'contact@bdtech.com.bd', phone: '+880-2-9876543', address: 'ঢাকা, বাংলাদেশ', contactPerson: 'মোহাম্মদ করিম', registrationNumber: 'REG-001', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { supplierId: 2, name: 'অফিস সরঞ্জাম বাংলাদেশ লিমিটেড', email: 'sales@officebd.com.bd', phone: '+880-2-8765432', address: 'ঢাকা, বাংলাদেশ', contactPerson: 'ফাতিমা বেগম', registrationNumber: 'REG-002', isActive: true, createdAt: '2024-01-02T00:00:00Z' },
  { supplierId: 3, name: 'আসবাবপত্র শিল্প বাংলাদেশ', email: 'info@furniturebd.com.bd', phone: '+880-2-7654321', address: 'ঢাকা, বাংলাদেশ', contactPerson: 'আবদুল হামিদ', registrationNumber: 'REG-003', isActive: true, createdAt: '2024-01-03T00:00:00Z' },
  { supplierId: 4, name: 'বৈশ্বিক ইলেকট্রনিক্স বাংলাদেশ', email: 'export@globalelecbd.com.bd', phone: '+880-2-6543210', address: 'চট্টগ্রাম, বাংলাদেশ', contactPerson: 'রহিম আহমেদ', registrationNumber: 'REG-004', isActive: true, createdAt: '2024-01-04T00:00:00Z' },
]

export const MOCK_GRADES = [
  { id: 1, gradeNumber: 'G1', description: 'Entry Level' },
  { id: 2, gradeNumber: 'G2', description: 'Junior' },
  { id: 3, gradeNumber: 'G3', description: 'Senior' },
  { id: 4, gradeNumber: 'G4', description: 'Lead' },
  { id: 5, gradeNumber: 'G5', description: 'Manager' },
]

export const MOCK_EMPLOYEES = [
  { employeeId: 1, employeeCode: 'EMP-001', name: 'মোহাম্মদ করিম', grade: 'G3', position: 'গুদাম ব্যবস্থাপক', branchId: 1, mobileNumber: '+880-1700000001', email: 'karim@dpe.gov.bd', address: 'ঢাকা', servicePeriod: '৫ বছর', nidNumber: 'NID-001', dateOfBirth: '1985-05-15', gender: 'পুরুষ', nationality: 'বাংলাদেশী', createdAt: '2024-01-01T00:00:00Z' },
  { employeeId: 2, employeeCode: 'EMP-002', name: 'ফাতিমা বেগম', grade: 'G2', position: 'স্টক কর্মচারী', branchId: 1, mobileNumber: '+880-1700000002', email: 'fatima@dpe.gov.bd', address: 'ঢাকা', servicePeriod: '২ বছর', nidNumber: 'NID-002', dateOfBirth: '1992-08-22', gender: 'মহিলা', nationality: 'বাংলাদেশী', createdAt: '2024-01-02T00:00:00Z' },
  { employeeId: 3, employeeCode: 'EMP-003', name: 'আবদুল হামিদ', grade: 'G2', position: 'স্টক কর্মচারী', branchId: 2, mobileNumber: '+880-1700000003', email: 'hamid@dpe.gov.bd', address: 'চট্টগ্রাম', servicePeriod: '১ বছর', nidNumber: 'NID-003', dateOfBirth: '1995-03-10', gender: 'পুরুষ', nationality: 'বাংলাদেশী', createdAt: '2024-01-03T00:00:00Z' },
  { employeeId: 4, employeeCode: 'EMP-004', name: 'রহিমা আক্তার', grade: 'G4', position: 'অপারেশন লিড', branchId: 3, mobileNumber: '+880-1700000004', email: 'rahima@dpe.gov.bd', address: 'খুলনা', servicePeriod: '৭ বছর', nidNumber: 'NID-004', dateOfBirth: '1982-11-28', gender: 'মহিলা', nationality: 'বাংলাদেশী', createdAt: '2024-01-04T00:00:00Z' },
  { employeeId: 5, employeeCode: 'EMP-005', name: 'জামিল আহমেদ', grade: 'G1', position: 'ইন্টার্ন', branchId: 1, mobileNumber: '+880-1700000005', email: 'jamil@dpe.gov.bd', address: 'ঢাকা', servicePeriod: '৩ মাস', nidNumber: 'NID-005', dateOfBirth: '2000-06-05', gender: 'পুরুষ', nationality: 'বাংলাদেশী', createdAt: '2024-01-05T00:00:00Z' },
]

export const MOCK_USERS = [
  { id: 1, userId: 1, email: 'admin@dpe.gov.bd', firstName: 'প্রশাসক', lastName: 'ব্যবহারকারী', fullName: 'প্রশাসক ব্যবহারকারী', role: 'ROLE_ADMIN', position: 'সিস্টেম প্রশাসক', enabled: true, createdAt: '2024-01-01T00:00:00Z', lastLogin: '2024-02-04T10:30:00Z', phone: '+880-2-9876543', address: 'প্রাথমিক শিক্ষা অধিদপ্তর, ঢাকা', branchName: 'প্রধান গুদাম - ঢাকা', gradeId: 5, warehouseId: 1 },
  { id: 2, userId: 2, email: 'user@dpe.gov.bd', firstName: 'ডেমো', lastName: 'ব্যবহারকারী', fullName: 'ডেমো ব্যবহারকারী', role: 'ROLE_USER', position: 'গুদাম কর্মচারী', enabled: true, createdAt: '2024-01-02T00:00:00Z', lastLogin: '2024-02-04T09:15:00Z', phone: '+880-1700000010', address: 'আঞ্চলিক অফিস - চট্টগ্রাম', branchName: 'আঞ্চলিক অফিস - চট্টগ্রাম', gradeId: 2, warehouseId: 2 },
]

export const MOCK_STOCK_IN_TRANSACTIONS = [
  { referenceNumber: 'SI-2024-001', count: 3, createdBy: 'admin@dpe.gov.bd', createdAt: '2024-02-01T08:00:00Z', updatedAt: '2024-02-01T08:00:00Z', supplierName: 'বাংলাদেশ প্রযুক্তি সরবরাহ কোম্পানি', sourceMode: 'SUPPLIER' as const },
  { referenceNumber: 'SI-2024-002', count: 2, createdBy: 'admin@dpe.gov.bd', createdAt: '2024-02-02T09:30:00Z', updatedAt: '2024-02-02T09:30:00Z', supplierName: 'অফিস সরঞ্জাম বাংলাদেশ লিমিটেড', sourceMode: 'SUPPLIER' as const },
  { referenceNumber: 'SI-2024-003', count: 4, createdBy: 'user@dpe.gov.bd', createdAt: '2024-02-03T10:15:00Z', updatedAt: '2024-02-03T10:15:00Z', supplierName: 'আসবাবপত্র শিল্প বাংলাদেশ', sourceMode: 'SUPPLIER' as const },
]

export const MOCK_STOCK_IN_DETAILS = [
  { itemId: 1, sku: 'DELL-XPS-13', name: 'Laptop Dell XPS 13', quantity: 5, createdAt: '2024-02-01T08:00:00Z', supplierId: 1, warehouseId: 1 },
  { itemId: 2, sku: 'USB-C-001', name: 'USB-C Cable', quantity: 50, createdAt: '2024-02-01T08:00:00Z', supplierId: 1, warehouseId: 1 },
  { itemId: 5, sku: 'LAMP-LED-001', name: 'Desk Lamp LED', quantity: 20, createdAt: '2024-02-01T08:00:00Z', supplierId: 1, warehouseId: 1 },
  { itemId: 4, sku: 'PAPER-A4-001', name: 'A4 Paper Ream', quantity: 100, createdAt: '2024-02-02T09:30:00Z', supplierId: 2, warehouseId: 1 },
  { itemId: 9, sku: 'PEN-SET-001', name: 'Pen Set', quantity: 50, createdAt: '2024-02-02T09:30:00Z', supplierId: 2, warehouseId: 1 },
  { itemId: 3, sku: 'CHAIR-001', name: 'Office Chair', quantity: 10, createdAt: '2024-02-03T10:15:00Z', supplierId: 3, warehouseId: 2 },
  { itemId: 8, sku: 'MON-27-001', name: 'Monitor 27 inch', quantity: 5, createdAt: '2024-02-03T10:15:00Z', supplierId: 3, warehouseId: 2 },
  { itemId: 6, sku: 'KB-MECH-001', name: 'Mechanical Keyboard', quantity: 8, createdAt: '2024-02-03T10:15:00Z', supplierId: 3, warehouseId: 2 },
]

export const MOCK_STOCK_OUT_TRANSACTIONS = [
  { id: 1, referenceNumber: 'SO-2024-001', stockOutType: 'USED', itemId: 2, itemName: 'ইউএসবি কেবল', itemSku: 'USB-CABLE-001', quantity: 10, stockOutDate: '2024-02-01T14:00:00Z', note: 'অফিস সেটআপের জন্য ব্যবহৃত', sourceWarehouseId: 1, branchId: null, employeeId: null, sourceWarehouseName: 'প্রধান গুদাম - ঢাকা', branchName: null, employeeName: null },
  { id: 2, referenceNumber: 'SO-2024-002', stockOutType: 'EMPLOYEE', itemId: 5, itemName: 'এলইডি ডেস্ক ল্যাম্প', itemSku: 'LAMP-LED-001', quantity: 2, stockOutDate: '2024-02-02T11:00:00Z', note: 'কর্মচারীকে জারি করা হয়েছে', sourceWarehouseId: 1, branchId: null, employeeId: 1, sourceWarehouseName: 'প্রধান গুদাম - ঢাকা', branchName: null, employeeName: 'মোহাম্মদ করিম' },
  { id: 3, referenceNumber: 'SO-2024-003', stockOutType: 'BRANCH_TRANSFER', itemId: 4, itemName: 'এ৪ কাগজ রিম', itemSku: 'PAPER-A4-001', quantity: 50, stockOutDate: '2024-02-03T09:30:00Z', note: 'শাখায় স্থানান্তর', sourceWarehouseId: 1, branchId: 2, employeeId: null, sourceWarehouseName: 'প্রধান গুদাম - ঢাকা', branchName: 'আঞ্চলিক অফিস - চট্টগ্রাম', employeeName: null },
  { id: 4, referenceNumber: 'SO-2024-004', stockOutType: 'DAMAGE', itemId: 7, itemName: 'ওয়্যারলেস মাউস', itemSku: 'MOUSE-WL-001', quantity: 3, stockOutDate: '2024-02-04T13:45:00Z', note: 'পরিচালনার সময় ক্ষতিগ্রস্ত', sourceWarehouseId: 2, branchId: null, employeeId: null, sourceWarehouseName: 'আঞ্চলিক অফিস - চট্টগ্রাম', branchName: null, employeeName: null },
]

export const MOCK_PURCHASE_ORDERS = [
  { purchaseOrderId: 1, purchaseOrderCode: 'PO-2024-001', supplierId: 1, supplierName: 'বাংলাদেশ প্রযুক্তি সরবরাহ কোম্পানি', warehouseId: 1, warehouseName: 'প্রধান গুদাম - ঢাকা', status: 'PENDING', orderDate: '2024-02-01T08:00:00Z', expectedDeliveryDate: '2024-02-15T00:00:00Z', totalAmount: 175000, notes: 'জরুরি অর্ডার', createdAt: '2024-02-01T08:00:00Z' },
  { purchaseOrderId: 2, purchaseOrderCode: 'PO-2024-002', supplierId: 2, supplierName: 'অফিস সরঞ্জাম বাংলাদেশ লিমিটেড', warehouseId: 1, warehouseName: 'প্রধান গুদাম - ঢাকা', status: 'CONFIRMED', orderDate: '2024-02-02T09:00:00Z', expectedDeliveryDate: '2024-02-20T00:00:00Z', totalAmount: 85000, notes: 'নিয়মিত অর্ডার', createdAt: '2024-02-02T09:00:00Z' },
  { purchaseOrderId: 3, purchaseOrderCode: 'PO-2024-003', supplierId: 3, supplierName: 'আসবাবপত্র শিল্প বাংলাদেশ', warehouseId: 2, warehouseName: 'আঞ্চলিক অফিস - চট্টগ্রাম', status: 'DELIVERED', orderDate: '2024-01-25T10:00:00Z', expectedDeliveryDate: '2024-02-10T00:00:00Z', totalAmount: 120000, notes: 'অফিস আসবাবপত্র', createdAt: '2024-01-25T10:00:00Z' },
]

export const MOCK_SALES_ORDERS = [
  { salesOrderId: 1, warehouseId: 1, warehouseName: 'প্রধান গুদাম - ঢাকা', status: 'PENDING', orderDate: '2024-02-03T10:00:00Z', deliveryDate: '2024-02-10T00:00:00Z', totalAmount: 50000, customerName: 'ঢাকা জেলা শিক্ষা অফিস', customerEmail: 'orders@dhakaedu.gov.bd', notes: 'বাল্ক অর্ডার', createdBy: 'admin@dpe.gov.bd', createdAt: '2024-02-03T10:00:00Z' },
  { salesOrderId: 2, warehouseId: 2, warehouseName: 'আঞ্চলিক অফিস - চট্টগ্রাম', status: 'CONFIRMED', orderDate: '2024-02-02T14:00:00Z', deliveryDate: '2024-02-08T00:00:00Z', totalAmount: 27000, customerName: 'চট্টগ্রাম জেলা শিক্ষা অফিস', customerEmail: 'orders@chattogramdu.gov.bd', notes: 'নিয়মিত অর্ডার', createdBy: 'user@dpe.gov.bd', createdAt: '2024-02-02T14:00:00Z' },
]

export const MOCK_STOCK_TRANSFERS = [
  { transferId: 1, itemId: 4, itemName: 'এ৪ কাগজ রিম', itemSku: 'PAPER-A4-001', fromWarehouseId: 1, fromWarehouseName: 'প্রধান গুদাম - ঢাকা', toWarehouseId: 2, toWarehouseName: 'আঞ্চলিক অফিস - চট্টগ্রাম', quantity: 100, status: 'COMPLETED', notes: 'নিয়মিত স্থানান্তর', createdBy: 'admin@dpe.gov.bd', createdAt: '2024-02-01T08:00:00Z' },
  { transferId: 2, itemId: 5, itemName: 'এলইডি ডেস্ক ল্যাম্প', itemSku: 'LAMP-LED-001', fromWarehouseId: 1, fromWarehouseName: 'প্রধান গুদাম - ঢাকা', toWarehouseId: 3, toWarehouseName: 'বিতরণ কেন্দ্র - খুলনা', quantity: 15, status: 'PENDING', notes: 'অপেক্ষমাণ স্থানান্তর', createdBy: 'user@dpe.gov.bd', createdAt: '2024-02-03T09:00:00Z' },
]

export const MOCK_DEMANDS = [
  { demandId: 1, demandCode: 'DEM-2024-001', employeeId: 1, demanderName: 'মোহাম্মদ করিম', position: 'গুদাম ব্যবস্থাপক', grade: 'G3', status: 'PENDING', note: 'অফিস সরঞ্জাম প্রয়োজন', itemId: 4, itemName: 'এ৪ কাগজ রিম', sku: 'PAPER-A4-001', warehouseId: 1, requestedByName: 'মোহাম্মদ করিম', createdAt: '2024-02-02T10:00:00Z' },
  { demandId: 2, demandCode: 'DEM-2024-002', employeeId: 2, demanderName: 'ফাতিমা বেগম', position: 'স্টক কর্মচারী', grade: 'G2', status: 'APPROVED', note: 'সরঞ্জাম প্রয়োজন', itemId: 5, itemName: 'এলইডি ডেস্ক ল্যাম্প', sku: 'LAMP-LED-001', warehouseId: 1, requestedByName: 'ফাতিমা বেগম', createdAt: '2024-02-01T14:00:00Z' },
]

export const MOCK_BATCHES = [
  { batchId: 1, itemId: 1, batchNumber: 'BATCH-001', supplierId: 1, expiryDate: '2025-12-31T00:00:00Z', manufacturingDate: '2024-01-01T00:00:00Z', quantityReceived: 10, isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { batchId: 2, itemId: 2, batchNumber: 'BATCH-002', supplierId: 1, expiryDate: '2026-06-30T00:00:00Z', manufacturingDate: '2024-01-15T00:00:00Z', quantityReceived: 100, isActive: true, createdAt: '2024-01-15T00:00:00Z' },
]

export const MOCK_STATISTICS = {
  totalItems: 10,
  totalValue: 25000,
  lowStockCount: 2,
  outOfStockCount: 1,
}

export const MOCK_STOCK_OUT_REASONS = [
  { reasonType: 'TRANSFERRED', reasonLabel: 'স্থানান্তরিত', count: 45, percentage: 28 },
  { reasonType: 'GIVEN', reasonLabel: 'কর্মচারীকে প্রদান করা', count: 38, percentage: 24 },
  { reasonType: 'USED', reasonLabel: 'ব্যবহৃত', count: 32, percentage: 20 },
  { reasonType: 'DAMAGED', reasonLabel: 'ক্ষতিগ্রস্ত', count: 25, percentage: 16 },
  { reasonType: 'LOST', reasonLabel: 'হারিয়ে গেছে', count: 12, percentage: 8 },
  { reasonType: 'EXPIRED', reasonLabel: 'মেয়াদ উত্তীর্ণ', count: 10, percentage: 4 },
]
