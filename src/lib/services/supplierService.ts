import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface Supplier {
  supplierId: number
  name: string
  email?: string
  phone?: string
  address?: string
  contactPerson?: string
  registrationNumber?: string
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
  registrationNumber?: string
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

  static async updateSupplier(id: number, payload: Partial<CreateSupplierRequest> & { name: string; isActive?: boolean }): Promise<Supplier> {
    try {
      const res = await apiClient.put<Supplier>(`/suppliers/${id}`, payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to update supplier')
    }
  }

  static async setActive(id: number, active: boolean): Promise<Supplier> {
    try {
      const res = await apiClient.patch<Supplier>(`/suppliers/${id}/status?active=${active}`)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to update status')
    }
  }

  static async deleteSupplier(id: number): Promise<void> {
    try {
      await apiClient.delete<void>(`/suppliers/${id}`)
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to delete supplier')
    }
  }
}
