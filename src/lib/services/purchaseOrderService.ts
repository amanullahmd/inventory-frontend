import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface PurchaseOrder {
  purchaseOrderId: number
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

export class PurchaseOrderService {
  static async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    try {
      const res = await apiClient.get<any[]>('/purchase-orders')
      const raw = Array.isArray(res.data) ? res.data : []
      const normalized: PurchaseOrder[] = raw.map((po: any) => ({
        purchaseOrderId: po.purchaseOrderId ?? po.id ?? 0,
        supplierId: po.supplier?.supplierId ?? po.supplierId ?? 0,
        supplierName: po.supplier?.name,
        warehouseId: po.warehouse?.warehouseId ?? po.warehouseId ?? 0,
        warehouseName: po.warehouse?.name,
        status: po.status ?? 'DRAFT',
        orderDate: po.orderDate,
        expectedDeliveryDate: po.expectedDeliveryDate,
        totalAmount: po.totalAmount,
        notes: po.notes,
        createdAt: po.createdAt,
      }))
      return normalized
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
