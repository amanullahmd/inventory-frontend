import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface Warehouse {
  warehouseId: number
  name: string
  warehouseCode?: string
  address?: string
  capacityUnits?: number
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateWarehouseRequest {
  name: string
  warehouseCode?: string
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

  static async updateWarehouse(id: number, payload: Partial<CreateWarehouseRequest> & { name: string; isActive?: boolean }): Promise<Warehouse> {
    try {
      const res = await apiClient.put<Warehouse>(`/warehouses/${id}`, payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to update warehouse')
    }
  }

  static async setActive(id: number, active: boolean): Promise<Warehouse> {
    try {
      const res = await apiClient.patch<Warehouse>(`/warehouses/${id}/status?active=${active}`)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to update status')
    }
  }

  static async deleteWarehouse(id: number): Promise<Warehouse> {
    try {
      const res = await apiClient.delete<Warehouse>(`/warehouses/${id}`)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to delete warehouse')
    }
  }
}
