import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface Batch {
  batchId: number
  itemId: number
  batchNumber: string
  supplierId?: number
  expiryDate?: string
  manufacturingDate?: string
  quantityReceived?: number
  isActive: boolean
  createdAt: string
}

export interface CreateBatchRequest {
  itemId: number
  batchNumber: string
  supplierId?: number
  expiryDate?: string
  manufacturingDate?: string
  quantityReceived?: number
}

export class BatchService {
  static async getBatches(): Promise<Batch[]> {
    try {
      const res = await apiClient.get<Batch[]>('/batches')
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch batches')
    }
  }

  static async createBatch(payload: CreateBatchRequest): Promise<Batch> {
    try {
      const res = await apiClient.post<Batch>('/batches', payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to create batch')
    }
  }
}
