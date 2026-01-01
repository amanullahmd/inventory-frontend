import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface SalesOrder {
  salesOrderId: number
  warehouseId: number
  status: string
  orderDate: string
  deliveryDate?: string
  totalAmount?: number
  customerName?: string
  customerEmail?: string
  notes?: string
  createdBy: number
  createdAt: string
}

export interface SalesOrderItem {
  salesOrderItemId: number
  salesOrderId: number
  itemId: number
  batchId?: number
  quantity: number
  unitPrice: number
}

export interface CreateSalesOrderRequest {
  warehouseId: number
  orderDate: string
  deliveryDate?: string
  customerName?: string
  customerEmail?: string
  notes?: string
}

export class SalesOrderService {
  static async getSalesOrders(): Promise<SalesOrder[]> {
    try {
      const res = await apiClient.get<SalesOrder[]>('/sales-orders')
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch sales orders')
    }
  }

  static async createSalesOrder(payload: CreateSalesOrderRequest): Promise<SalesOrder> {
    try {
      const res = await apiClient.post<SalesOrder>('/sales-orders', payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to create sales order')
    }
  }
}
