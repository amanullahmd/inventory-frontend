import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface Demand {
  demandId: number
  demandCode: string
  employeeId?: number
  employeeCode?: string
  demanderName: string
  position?: string
  grade?: string
  status?: string
  note?: string
  itemId: number
  itemName: string
  sku: string
  unit?: string
  warehouseId?: number
  warehouseName?: string
  requestedByName?: string
  createdAt: string
  updatedAt?: string
  items?: Array<{ demandItemId: number; itemId: number; sku: string; name: string; units: number }>
}

export interface CreateDemandRequest {
  employeeId?: number
  itemId?: number
  unit?: string
  status?: string
  note?: string
  items?: Array<{ itemId: number; units: number }>
}
 
export interface UpdateDemandRequest {
  demandCode?: string
  employeeId?: number
  itemId?: number
  unit?: string
  status?: string
  note?: string
  items?: Array<{ itemId: number; units: number }>
}

export class DemandService {
  static async getDemands(): Promise<Demand[]> {
    try {
      const res = await apiClient.get<Demand[]>('/demands')
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch demands')
    }
  }
  
  static async createDemand(payload: CreateDemandRequest): Promise<Demand> {
    try {
      const res = await apiClient.post<Demand>('/demands', payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to create demand')
    }
  }
  
  static async getDemand(id: number): Promise<Demand> {
    try {
      const res = await apiClient.get<Demand>(`/demands/${id}`)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch demand')
    }
  }
  
  static async updateDemand(id: number, payload: UpdateDemandRequest): Promise<Demand> {
    try {
      const res = await apiClient.put<Demand>(`/demands/${id}`, payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to update demand')
    }
  }
  
  static async deleteDemand(id: number): Promise<void> {
    try {
      await apiClient.delete<void>(`/demands/${id}`)
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to delete demand')
    }
  }
}
