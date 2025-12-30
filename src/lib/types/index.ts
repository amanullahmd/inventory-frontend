// Core data types for the inventory management system

export interface Item {
  id: string;
  name: string;
  sku: string;
  unitCost: number;
  currentStock: number;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  movementType: 'IN' | 'OUT';
  quantity: number;
  note?: string;
  branch?: string;
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
  unitCost: number;
  categoryId?: number;
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