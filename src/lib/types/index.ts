// Core data types for the store management system

export interface Item {
  id: string;
  name: string;
  sku: string;
  unitCost?: number;
  currentStock: number;
  createdAt: string;
  categoryId?: string;
  categoryName?: string;
  description?: string;
  minimumStock?: number;
  maximumStock?: number;
  reorderLevel?: number;
  expiryDate?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  movementType: "IN" | "OUT";
  quantity: number;
  note?: string;
  branch?: string;
  referenceNumber?: string;
  supplierId?: string;
  warehouseId?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface UserSession {
  user: {
    name: string;
    email: string;
  };
  roles: string[];
  accessToken: string;
}

// API Request/Response types
export interface CreateItemRequest {
  name: string;
  sku: string;
  unitCost?: number;
  categoryId: number;
  description?: string;
  minimumStock?: number;
  maximumStock?: number;
  reorderLevel?: number;
  unit?: string;
  expiryDate?: string;
}

export interface StockInRequest {
  itemId: string;
  quantity: number;
  note?: string;
  branch?: string;
  batchId?: string;
  warehouseId?: string;
}

export interface StockInBatchRequest {
  supplierId?: number;
  warehouseId: number;
  notes?: string;
  referenceNumber?: string;
  items: Array<{ itemId: number; quantity: number }>;
}

export interface StockInDetail {
  itemId: number;
  sku: string;
  name: string;
  quantity: number;
  createdAt: string;
  supplierId?: number;
  warehouseId?: number;
}

export interface StockInSummary {
  referenceNumber: string;
  count: number;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  supplierName?: string;
  sourceMode?: "SUPPLIER" | "NON_SUPPLIER";
}

export interface StockOutRequest {
  itemId: string;
  quantity: number;
  note?: string;
  branch?: string;
  reason?: string;
  recipient?: string;
  batchId?: string;
  warehouseId?: string;
}

export interface CreateUserRequest {
  username?: string; // Optional if using email as username
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  gradeId?: number;
  warehouseId?: number;
  name?: string; // Backward compatibility
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

// Vehicle Management types
export type VehicleRequisitionType = 'Oil' | 'Service' | 'Diesel' | 'Engine Oil' | 'Other';
export type VehicleRequisitionStatus = 'Pending' | 'Approved' | 'Completed' | 'Rejected';

export interface VehicleRequisition {
  id: string;
  carNo: string;
  carModel: string;
  vehicleType: string;
  date: string;
  type: VehicleRequisitionType;
  details: string;
  amount: number;
  status: VehicleRequisitionStatus;
  approvedBy?: string;
}

export type VehicleConditionStatus = 'Operational' | 'Under_Repair' | 'Unusable' | 'Awaiting_Inspection';

export interface VehicleRepairRecord {
  repairId: string;
  date: string;
  description: string;
  cost: number;
  vendor: string;
  status: 'Pending' | 'In_Progress' | 'Completed';
  isUnusable: boolean;
  inspectionNotes?: string;
}

export interface VehicleInfo {
  carModel: string;
  carNo: string;
  vehicleType: string;
  conditionStatus?: VehicleConditionStatus;
  lastInspectionDate?: string;
}

export interface VehicleCostSummary {
  carModel: string;
  carNo: string;
  vehicleType: string;
  dieselCost: number;
  serviceCost: number;
  engineOilCost: number;
  otherCost: number;
  totalCost: number;
  recordCount: number;
}

export interface VehicleMonthlyCost {
  month: string;
  monthIndex: number;
  year: number;
  dieselCost: number;
  serviceCost: number;
  engineOilCost: number;
  otherCost: number;
  totalCost: number;
  recordCount: number;
}

export interface VehicleCategoryCost {
  category: VehicleRequisitionType;
  totalCost: number;
  percentage: number;
  recordCount: number;
}
