import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface PurchaseOrder {
  purchaseOrderId: number
  supplierId: number
  warehouseId: number
  status: string
  orderDate: string
  expectedDeliveryDate?: string
  totalAmount?: number
  notes?: string
  createdBy: number
  createdAt: string
}

export interface PurchaseOrderItem {
  purchaseOrderItemId: number
  purchaseOrderId: number
  itemId: number
  batchId?: number
  quantity: number
  unitPrice: number
  receivedQuantity?: number
}

export interface CreatePurchaseOrderRequest {
  supplierId: number
  warehouseId: number
  orderDate: string
  expectedDeliveryDate?: string
  notes?: string
}

export class PurchaseOrderService {
  static async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    try {
      const res = await apiClient.get<PurchaseOrder[]>('/purchase-orders')
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch purchase orders')
    }
  }

  static async createPurchaseOrder(payload: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    try {
      const res = await apiClient.post<PurchaseOrder>('/purchase-orders', payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to create purchase order')
    }
  }
}
