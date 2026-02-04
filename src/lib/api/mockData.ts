// Mock data for all features - disables database connections
export const MOCK_CATEGORIES = [
  { id: 1, code: 'CAT001', name: 'Electronics', description: 'Electronic devices and components', color: '#3B82F6', createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, code: 'CAT002', name: 'Office Supplies', description: 'Office and stationery items', color: '#10B981', createdAt: '2024-01-02T00:00:00Z' },
  { id: 3, code: 'CAT003', name: 'Hardware', description: 'Hardware and tools', color: '#F59E0B', createdAt: '2024-01-03T00:00:00Z' },
  { id: 4, code: 'CAT004', name: 'Furniture', description: 'Office furniture', color: '#8B5CF6', createdAt: '2024-01-04T00:00:00Z' },
  { id: 5, code: 'CAT005', name: 'Consumables', description: 'Consumable items', color: '#EC4899', createdAt: '2024-01-05T00:00:00Z' },
]

export const MOCK_ITEMS = [
  { itemId: 1, name: 'Laptop Dell XPS 13', sku: 'DELL-XPS-13', description: 'High-performance laptop', unitPrice: 1200, currentStock: 15, categoryId: 1, categoryName: 'Electronics', minimumStock: 5, maximumStock: 30, reorderLevel: 10, createdAt: '2024-01-01T00:00:00Z' },
  { itemId: 2, name: 'USB-C Cable', sku: 'USB-C-001', description: '2m USB-C cable', unitPrice: 15, currentStock: 150, categoryId: 1, categoryName: 'Electronics', minimumStock: 50, maximumStock: 300, reorderLevel: 100, createdAt: '2024-01-02T00:00:00Z' },
  { itemId: 3, name: 'Office Chair', sku: 'CHAIR-001', description: 'Ergonomic office chair', unitPrice: 250, currentStock: 8, categoryId: 4, categoryName: 'Furniture', minimumStock: 3, maximumStock: 20, reorderLevel: 5, createdAt: '2024-01-03T00:00:00Z' },
  { itemId: 4, name: 'A4 Paper Ream', sku: 'PAPER-A4-001', description: '500 sheets A4 paper', unitPrice: 5, currentStock: 200, categoryId: 2, categoryName: 'Office Supplies', minimumStock: 50, maximumStock: 500, reorderLevel: 100, createdAt: '2024-01-04T00:00:00Z' },
  { itemId: 5, name: 'Desk Lamp LED', sku: 'LAMP-LED-001', description: 'LED desk lamp with USB', unitPrice: 45, currentStock: 25, categoryId: 1, categoryName: 'Electronics', minimumStock: 10, maximumStock: 50, reorderLevel: 15, createdAt: '2024-01-05T00:00:00Z' },
  { itemId: 6, name: 'Mechanical Keyboard', sku: 'KB-MECH-001', description: 'RGB mechanical keyboard', unitPrice: 120, currentStock: 12, categoryId: 1, categoryName: 'Electronics', minimumStock: 5, maximumStock: 25, reorderLevel: 8, createdAt: '2024-01-06T00:00:00Z' },
  { itemId: 7, name: 'Wireless Mouse', sku: 'MOUSE-WL-001', description: 'Wireless optical mouse', unitPrice: 35, currentStock: 45, categoryId: 1, categoryName: 'Electronics', minimumStock: 20, maximumStock: 100, reorderLevel: 30, createdAt: '2024-01-07T00:00:00Z' },
  { itemId: 8, name: 'Monitor 27 inch', sku: 'MON-27-001', description: '27 inch 4K monitor', unitPrice: 350, currentStock: 6, categoryId: 1, categoryName: 'Electronics', minimumStock: 2, maximumStock: 15, reorderLevel: 4, createdAt: '2024-01-08T00:00:00Z' },
  { itemId: 9, name: 'Pen Set', sku: 'PEN-SET-001', description: 'Set of 12 ballpoint pens', unitPrice: 8, currentStock: 300, categoryId: 2, categoryName: 'Office Supplies', minimumStock: 100, maximumStock: 500, reorderLevel: 200, createdAt: '2024-01-09T00:00:00Z' },
  { itemId: 10, name: 'Notebook A5', sku: 'NOTE-A5-001', description: 'A5 lined notebook', unitPrice: 3, currentStock: 500, categoryId: 2, categoryName: 'Office Supplies', minimumStock: 200, maximumStock: 1000, reorderLevel: 300, createdAt: '2024-01-10T00:00:00Z' },
]

export const MOCK_WAREHOUSES = [
  { warehouseId: 1, name: 'Main Warehouse', warehouseCode: 'WH-001', address: '123 Industrial Ave, City', capacityUnits: 10000, isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { warehouseId: 2, name: 'Branch Office', warehouseCode: 'WH-002', address: '456 Business St, City', capacityUnits: 5000, isActive: true, createdAt: '2024-01-02T00:00:00Z' },
  { warehouseId: 3, name: 'Distribution Center', warehouseCode: 'WH-003', address: '789 Logistics Rd, City', capacityUnits: 15000, isActive: true, createdAt: '2024-01-03T00:00:00Z' },
  { warehouseId: 4, name: 'Regional Hub', warehouseCode: 'WH-004', address: '321 Commerce Blvd, City', capacityUnits: 8000, isActive: true, createdAt: '2024-01-04T00:00:00Z' },
]

export const MOCK_SUPPLIERS = [
  { supplierId: 1, name: 'Tech Supplies Inc', email: 'contact@techsupplies.com', phone: '+1-555-0101', address: '100 Tech Park, Silicon Valley', contactPerson: 'John Smith', registrationNumber: 'REG-001', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { supplierId: 2, name: 'Office World Ltd', email: 'sales@officeworld.com', phone: '+1-555-0102', address: '200 Business Center, Downtown', contactPerson: 'Jane Doe', registrationNumber: 'REG-002', isActive: true, createdAt: '2024-01-02T00:00:00Z' },
  { supplierId: 3, name: 'Furniture Plus', email: 'info@furnitureplus.com', phone: '+1-555-0103', address: '300 Furniture District, City', contactPerson: 'Bob Johnson', registrationNumber: 'REG-003', isActive: true, createdAt: '2024-01-03T00:00:00Z' },
  { supplierId: 4, name: 'Global Electronics', email: 'export@globalelec.com', phone: '+1-555-0104', address: '400 Export Zone, Port City', contactPerson: 'Alice Chen', registrationNumber: 'REG-004', isActive: true, createdAt: '2024-01-04T00:00:00Z' },
]

export const MOCK_GRADES = [
  { id: 1, gradeNumber: 'G1', description: 'Entry Level' },
  { id: 2, gradeNumber: 'G2', description: 'Junior' },
  { id: 3, gradeNumber: 'G3', description: 'Senior' },
  { id: 4, gradeNumber: 'G4', description: 'Lead' },
  { id: 5, gradeNumber: 'G5', description: 'Manager' },
]

export const MOCK_EMPLOYEES = [
  { employeeId: 1, employeeCode: 'EMP-001', name: 'Michael Johnson', grade: 'G3', position: 'Warehouse Manager', branchId: 1, mobileNumber: '+1-555-1001', email: 'michael@company.com', address: '123 Main St', servicePeriod: '5 years', nidNumber: 'NID-001', dateOfBirth: '1985-05-15', gender: 'Male', nationality: 'USA', createdAt: '2024-01-01T00:00:00Z' },
  { employeeId: 2, employeeCode: 'EMP-002', name: 'Sarah Williams', grade: 'G2', position: 'Stock Clerk', branchId: 1, mobileNumber: '+1-555-1002', email: 'sarah@company.com', address: '456 Oak Ave', servicePeriod: '2 years', nidNumber: 'NID-002', dateOfBirth: '1992-08-22', gender: 'Female', nationality: 'USA', createdAt: '2024-01-02T00:00:00Z' },
  { employeeId: 3, employeeCode: 'EMP-003', name: 'David Brown', grade: 'G2', position: 'Stock Clerk', branchId: 2, mobileNumber: '+1-555-1003', email: 'david@company.com', address: '789 Pine Rd', servicePeriod: '1 year', nidNumber: 'NID-003', dateOfBirth: '1995-03-10', gender: 'Male', nationality: 'USA', createdAt: '2024-01-03T00:00:00Z' },
  { employeeId: 4, employeeCode: 'EMP-004', name: 'Emily Davis', grade: 'G4', position: 'Operations Lead', branchId: 3, mobileNumber: '+1-555-1004', email: 'emily@company.com', address: '321 Elm St', servicePeriod: '7 years', nidNumber: 'NID-004', dateOfBirth: '1982-11-28', gender: 'Female', nationality: 'USA', createdAt: '2024-01-04T00:00:00Z' },
  { employeeId: 5, employeeCode: 'EMP-005', name: 'James Wilson', grade: 'G1', position: 'Intern', branchId: 1, mobileNumber: '+1-555-1005', email: 'james@company.com', address: '654 Maple Dr', servicePeriod: '3 months', nidNumber: 'NID-005', dateOfBirth: '2000-06-05', gender: 'Male', nationality: 'USA', createdAt: '2024-01-05T00:00:00Z' },
]

export const MOCK_USERS = [
  { id: 1, userId: 1, email: 'admin@example.com', firstName: 'Admin', lastName: 'User', fullName: 'Admin User', role: 'ROLE_ADMIN', position: 'System Administrator', enabled: true, createdAt: '2024-01-01T00:00:00Z', lastLogin: '2024-02-04T10:30:00Z', phone: '+1-555-0001', address: 'Admin Office', branchName: 'Main Warehouse', gradeId: 5, warehouseId: 1 },
  { id: 2, userId: 2, email: 'user@example.com', firstName: 'Demo', lastName: 'User', fullName: 'Demo User', role: 'ROLE_USER', position: 'Warehouse Staff', enabled: true, createdAt: '2024-01-02T00:00:00Z', lastLogin: '2024-02-04T09:15:00Z', phone: '+1-555-0002', address: 'Staff Office', branchName: 'Branch Office', gradeId: 2, warehouseId: 2 },
]

export const MOCK_STOCK_IN_TRANSACTIONS = [
  { referenceNumber: 'SI-2024-001', count: 3, createdBy: 'admin@example.com', createdAt: '2024-02-01T08:00:00Z', updatedAt: '2024-02-01T08:00:00Z', supplierName: 'Tech Supplies Inc', sourceMode: 'SUPPLIER' as const },
  { referenceNumber: 'SI-2024-002', count: 2, createdBy: 'admin@example.com', createdAt: '2024-02-02T09:30:00Z', updatedAt: '2024-02-02T09:30:00Z', supplierName: 'Office World Ltd', sourceMode: 'SUPPLIER' as const },
  { referenceNumber: 'SI-2024-003', count: 4, createdBy: 'user@example.com', createdAt: '2024-02-03T10:15:00Z', updatedAt: '2024-02-03T10:15:00Z', supplierName: 'Furniture Plus', sourceMode: 'SUPPLIER' as const },
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
  { id: 1, referenceNumber: 'SO-2024-001', stockOutType: 'USED', itemId: 2, itemName: 'USB-C Cable', itemSku: 'USB-C-001', quantity: 10, stockOutDate: '2024-02-01T14:00:00Z', note: 'Used for office setup', sourceWarehouseId: 1, branchId: null, employeeId: null, sourceWarehouseName: 'Main Warehouse', branchName: null, employeeName: null },
  { id: 2, referenceNumber: 'SO-2024-002', stockOutType: 'EMPLOYEE', itemId: 5, itemName: 'Desk Lamp LED', itemSku: 'LAMP-LED-001', quantity: 2, stockOutDate: '2024-02-02T11:00:00Z', note: 'Issued to employee', sourceWarehouseId: 1, branchId: null, employeeId: 1, sourceWarehouseName: 'Main Warehouse', branchName: null, employeeName: 'Michael Johnson' },
  { id: 3, referenceNumber: 'SO-2024-003', stockOutType: 'BRANCH_TRANSFER', itemId: 4, itemName: 'A4 Paper Ream', itemSku: 'PAPER-A4-001', quantity: 50, stockOutDate: '2024-02-03T09:30:00Z', note: 'Transfer to branch', sourceWarehouseId: 1, branchId: 2, employeeId: null, sourceWarehouseName: 'Main Warehouse', branchName: 'Branch Office', employeeName: null },
  { id: 4, referenceNumber: 'SO-2024-004', stockOutType: 'DAMAGE', itemId: 7, itemName: 'Wireless Mouse', itemSku: 'MOUSE-WL-001', quantity: 3, stockOutDate: '2024-02-04T13:45:00Z', note: 'Damaged during handling', sourceWarehouseId: 2, branchId: null, employeeId: null, sourceWarehouseName: 'Branch Office', branchName: null, employeeName: null },
]

export const MOCK_PURCHASE_ORDERS = [
  { purchaseOrderId: 1, purchaseOrderCode: 'PO-2024-001', supplierId: 1, supplierName: 'Tech Supplies Inc', warehouseId: 1, warehouseName: 'Main Warehouse', status: 'PENDING', orderDate: '2024-02-01T08:00:00Z', expectedDeliveryDate: '2024-02-15T00:00:00Z', totalAmount: 5000, notes: 'Urgent order', createdAt: '2024-02-01T08:00:00Z' },
  { purchaseOrderId: 2, purchaseOrderCode: 'PO-2024-002', supplierId: 2, supplierName: 'Office World Ltd', warehouseId: 1, warehouseName: 'Main Warehouse', status: 'CONFIRMED', orderDate: '2024-02-02T09:00:00Z', expectedDeliveryDate: '2024-02-20T00:00:00Z', totalAmount: 2500, notes: 'Regular order', createdAt: '2024-02-02T09:00:00Z' },
  { purchaseOrderId: 3, purchaseOrderCode: 'PO-2024-003', supplierId: 3, supplierName: 'Furniture Plus', warehouseId: 2, warehouseName: 'Branch Office', status: 'DELIVERED', orderDate: '2024-01-25T10:00:00Z', expectedDeliveryDate: '2024-02-10T00:00:00Z', totalAmount: 3500, notes: 'Office furniture', createdAt: '2024-01-25T10:00:00Z' },
]

export const MOCK_SALES_ORDERS = [
  { salesOrderId: 1, warehouseId: 1, warehouseName: 'Main Warehouse', status: 'PENDING', orderDate: '2024-02-03T10:00:00Z', deliveryDate: '2024-02-10T00:00:00Z', totalAmount: 1500, customerName: 'ABC Corporation', customerEmail: 'orders@abccorp.com', notes: 'Bulk order', createdBy: 'admin@example.com', createdAt: '2024-02-03T10:00:00Z' },
  { salesOrderId: 2, warehouseId: 2, warehouseName: 'Branch Office', status: 'CONFIRMED', orderDate: '2024-02-02T14:00:00Z', deliveryDate: '2024-02-08T00:00:00Z', totalAmount: 800, customerName: 'XYZ Ltd', customerEmail: 'sales@xyzltd.com', notes: 'Regular order', createdBy: 'user@example.com', createdAt: '2024-02-02T14:00:00Z' },
]

export const MOCK_STOCK_TRANSFERS = [
  { transferId: 1, itemId: 4, itemName: 'A4 Paper Ream', itemSku: 'PAPER-A4-001', fromWarehouseId: 1, fromWarehouseName: 'Main Warehouse', toWarehouseId: 2, toWarehouseName: 'Branch Office', quantity: 100, status: 'COMPLETED', notes: 'Regular transfer', createdBy: 'admin@example.com', createdAt: '2024-02-01T08:00:00Z' },
  { transferId: 2, itemId: 5, itemName: 'Desk Lamp LED', itemSku: 'LAMP-LED-001', fromWarehouseId: 1, fromWarehouseName: 'Main Warehouse', toWarehouseId: 3, toWarehouseName: 'Distribution Center', quantity: 15, status: 'PENDING', notes: 'Pending transfer', createdBy: 'user@example.com', createdAt: '2024-02-03T09:00:00Z' },
]

export const MOCK_DEMANDS = [
  { demandId: 1, demandCode: 'DEM-2024-001', employeeId: 1, demanderName: 'Michael Johnson', position: 'Warehouse Manager', grade: 'G3', status: 'PENDING', note: 'Need office supplies', itemId: 4, itemName: 'A4 Paper Ream', sku: 'PAPER-A4-001', warehouseId: 1, requestedByName: 'Michael Johnson', createdAt: '2024-02-02T10:00:00Z' },
  { demandId: 2, demandCode: 'DEM-2024-002', employeeId: 2, demanderName: 'Sarah Williams', position: 'Stock Clerk', grade: 'G2', status: 'APPROVED', note: 'Equipment needed', itemId: 5, itemName: 'Desk Lamp LED', sku: 'LAMP-LED-001', warehouseId: 1, requestedByName: 'Sarah Williams', createdAt: '2024-02-01T14:00:00Z' },
]

export const MOCK_BATCHES = [
  { batchId: 1, itemId: 1, batchNumber: 'BATCH-001', supplierId: 1, expiryDate: '2025-12-31T00:00:00Z', manufacturingDate: '2024-01-01T00:00:00Z', quantityReceived: 10, isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { batchId: 2, itemId: 2, batchNumber: 'BATCH-002', supplierId: 1, expiryDate: '2026-06-30T00:00:00Z', manufacturingDate: '2024-01-15T00:00:00Z', quantityReceived: 100, isActive: true, createdAt: '2024-01-15T00:00:00Z' },
]

export const MOCK_STATISTICS = {
  totalItems: 10,
  totalValue: 25000,
  lowStockCount: 2,
  outOfStockCount: 0,
}
