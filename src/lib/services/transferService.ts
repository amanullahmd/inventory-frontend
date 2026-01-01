import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface StockTransfer {
  transferId: number
  itemId: number
  batchId?: number
  fromWarehouseId: number
  toWarehouseId: number
  quantity: number
  status: string
  notes?: string
  createdBy: number
  createdAt: string
}

export interface CreateTransferRequest {
  itemId: number
  fromWarehouseId: number
  toWarehouseId: number
  quantity: number
  batchId?: number
  notes?: string
}

export class TransferService {
  static async getTransfers(): Promise<StockTransfer[]> {
    try {
      const res = await apiClient.get<StockTransfer[]>('/stock-transfers')
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch transfers')
    }
  }

  static async createTransfer(payload: CreateTransferRequest): Promise<StockTransfer> {
    try {
      const res = await apiClient.post<StockTransfer>('/stock-transfers', payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to create transfer')
    }
  }
}
