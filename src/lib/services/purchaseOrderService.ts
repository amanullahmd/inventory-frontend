import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface PurchaseOrder {
  purchaseOrderId: number
  purchaseOrderCode: string
  supplierId: number
  supplierName?: string
  warehouseId: number
  warehouseName?: string
  status: string
  orderDate: string
  expectedDeliveryDate?: string
  totalAmount?: number
  notes?: string
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
 
export interface AddPurchaseOrderItemsRequest {
  items: Array<{ itemId: number; quantity: number; unitPrice: number }>
  notes?: string
}
 
export interface UpdatePurchaseOrderRequest {
  expectedDeliveryDate?: string
  notes?: string
  status?: string
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
  
  static async addItems(purchaseOrderId: number, payload: AddPurchaseOrderItemsRequest): Promise<PurchaseOrder> {
    try {
      const res = await apiClient.post<PurchaseOrder>(`/purchase-orders/${purchaseOrderId}/items`, payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to add items to purchase order')
    }
  }
  
  static async updatePurchaseOrder(id: number, payload: UpdatePurchaseOrderRequest): Promise<PurchaseOrder> {
    try {
      const res = await apiClient.put<PurchaseOrder>(`/purchase-orders/${id}`, payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to update purchase order')
    }
  }
  
  static async getPurchaseOrderDetail(id: number): Promise<PurchaseOrder & { items: Array<{ purchaseOrderItemId: number; itemId: number; sku: string; name: string; quantity: number; unitPrice: number; lineTotal: number }> }> {
    try {
      const res = await apiClient.get<PurchaseOrder & { items: Array<{ purchaseOrderItemId: number; itemId: number; sku: string; name: string; quantity: number; unitPrice: number; lineTotal: number }> }>(`/purchase-orders/${id}`)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch purchase order detail')
    }
  }
  
  static async replaceItems(purchaseOrderId: number, payload: AddPurchaseOrderItemsRequest): Promise<PurchaseOrder> {
    try {
      const res = await apiClient.put<PurchaseOrder>(`/purchase-orders/${purchaseOrderId}/items`, payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to update purchase order items')
    }
  }
  
  static async deleteItem(purchaseOrderItemId: number): Promise<PurchaseOrder> {
    try {
      const res = await apiClient.delete<PurchaseOrder>(`/purchase-orders/items/${purchaseOrderItemId}`)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to delete purchase order item')
    }
  }
}
