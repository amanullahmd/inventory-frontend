import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface Supplier {
  supplierId: number
  name: string
  email?: string
  phone?: string
  address?: string
  contactPerson?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateSupplierRequest {
  name: string
  email?: string
  phone?: string
  address?: string
  contactPerson?: string
}

export class SupplierService {
  static async getSuppliers(): Promise<Supplier[]> {
    try {
      const res = await apiClient.get<Supplier[]>('/suppliers')
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch suppliers')
    }
  }

  static async createSupplier(payload: CreateSupplierRequest): Promise<Supplier> {
    try {
      const res = await apiClient.post<Supplier>('/suppliers', payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to create supplier')
    }
  }
}
