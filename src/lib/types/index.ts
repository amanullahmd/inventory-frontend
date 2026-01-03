// Core data types for the inventory management system

export interface Item {
  id: string;
  name: string;
  sku: string;
  unitCost?: number;
  currentStock: number;
  createdAt: string;
  categoryId?: string;
  categoryName?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  movementType: 'IN' | 'OUT';
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
  supplierId: number;
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
}

export interface StockInSummary {
  referenceNumber: string;
  count: number;
  createdBy?: string;
  createdAt: string;
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
  username: string;
  email: string;
  password: string;
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
