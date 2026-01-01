import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface Warehouse {
  warehouseId: number
  name: string
  address?: string
  capacityUnits?: number
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateWarehouseRequest {
  name: string
  address?: string
  capacityUnits?: number
}

export class WarehouseService {
  static async getWarehouses(): Promise<Warehouse[]> {
    try {
      const res = await apiClient.get<Warehouse[]>('/warehouses')
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch warehouses')
    }
  }

  static async createWarehouse(payload: CreateWarehouseRequest): Promise<Warehouse> {
    try {
      const res = await apiClient.post<Warehouse>('/warehouses', payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to create warehouse')
    }
  }
}
