// Mock API client - intercepts all API calls and returns dummy data
import {
  MOCK_CATEGORIES,
  MOCK_ITEMS,
  MOCK_WAREHOUSES,
  MOCK_SUPPLIERS,
  MOCK_GRADES,
  MOCK_EMPLOYEES,
  MOCK_USERS,
  MOCK_STOCK_IN_TRANSACTIONS,
  MOCK_STOCK_IN_DETAILS,
  MOCK_STOCK_OUT_TRANSACTIONS,
  MOCK_PURCHASE_ORDERS,
  MOCK_SALES_ORDERS,
  MOCK_STOCK_TRANSFERS,
  MOCK_DEMANDS,
  MOCK_BATCHES,
  MOCK_STATISTICS,
} from './mockData'

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

export class MockApiClient {
  async get<T>(endpoint: string): Promise<{ data: T }> {
    await delay()

    // Items endpoints
    if (endpoint === '/items') {
      return { data: MOCK_ITEMS as T }
    }
    if (endpoint === '/items/statistics') {
      return { data: MOCK_STATISTICS as T }
    }

    // Categories endpoints
    if (endpoint === '/categories') {
      return { data: MOCK_CATEGORIES as T }
    }

    // Warehouses endpoints
    if (endpoint === '/warehouses') {
      return { data: MOCK_WAREHOUSES as T }
    }

    // Suppliers endpoints
    if (endpoint === '/suppliers') {
      return { data: MOCK_SUPPLIERS as T }
    }

    // Grades endpoints
    if (endpoint === '/grades') {
      return { data: MOCK_GRADES as T }
    }

    // Employees endpoints
    if (endpoint === '/employees') {
      return { data: MOCK_EMPLOYEES as T }
    }

    // Users endpoints
    if (endpoint === '/users') {
      return { data: MOCK_USERS as T }
    }

    // Stock In endpoints
    if (endpoint === '/stock/in/grouped') {
      return { data: MOCK_STOCK_IN_TRANSACTIONS as T }
    }
    if (endpoint.startsWith('/stock/in/')) {
      const ref = endpoint.split('/').pop()
      const details = MOCK_STOCK_IN_DETAILS.filter(d => d.createdAt.includes('2024-02-01') || d.createdAt.includes('2024-02-02') || d.createdAt.includes('2024-02-03'))
      return { data: details as T }
    }

    // Stock Out endpoints
    if (endpoint === '/stock-outs' || endpoint === '/stock/out') {
      return { data: MOCK_STOCK_OUT_TRANSACTIONS as T }
    }

    // Purchase Orders endpoints
    if (endpoint === '/purchase-orders') {
      return { data: MOCK_PURCHASE_ORDERS as T }
    }

    // Sales Orders endpoints
    if (endpoint === '/sales-orders') {
      return { data: MOCK_SALES_ORDERS as T }
    }

    // Stock Transfers endpoints
    if (endpoint === '/stock-transfers') {
      return { data: MOCK_STOCK_TRANSFERS as T }
    }

    // Demands endpoints
    if (endpoint === '/demands') {
      return { data: MOCK_DEMANDS as T }
    }

    // Batches endpoints
    if (endpoint === '/batches') {
      return { data: MOCK_BATCHES as T }
    }

    console.warn(`Mock GET endpoint not found: ${endpoint}`)
    return { data: [] as T }
  }

  async post<T>(endpoint: string, data?: any): Promise<{ data: T }> {
    await delay()

    // Stock In Batch
    if (endpoint === '/stock/in/batch') {
      const referenceNumber = `SI-${Date.now()}`
      return {
        data: {
          referenceNumber,
          count: data?.items?.length || 0,
        } as T,
      }
    }

    // Stock Out Batch
    if (endpoint === '/stock-outs/batch' || endpoint === '/stock/out/batch') {
      const referenceNumber = `SO-${Date.now()}`
      return {
        data: {
          referenceNumber,
          count: data?.items?.length || 0,
        } as T,
      }
    }

    // Create endpoints
    if (endpoint === '/items') {
      return {
        data: {
          itemId: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint === '/categories') {
      return {
        data: {
          id: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint === '/warehouses') {
      return {
        data: {
          warehouseId: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint === '/suppliers') {
      return {
        data: {
          supplierId: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint === '/employees') {
      return {
        data: {
          employeeId: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint === '/users') {
      return {
        data: {
          userId: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint === '/grades') {
      return {
        data: {
          id: Math.floor(Math.random() * 10000),
          ...data,
        } as T,
      }
    }

    if (endpoint === '/purchase-orders') {
      return {
        data: {
          purchaseOrderId: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint === '/sales-orders') {
      return {
        data: {
          salesOrderId: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint === '/stock-transfers') {
      return {
        data: {
          transferId: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint === '/demands') {
      return {
        data: {
          demandId: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint === '/batches') {
      return {
        data: {
          batchId: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
        } as T,
      }
    }

    console.warn(`Mock POST endpoint not found: ${endpoint}`)
    return { data: {} as T }
  }

  async put<T>(endpoint: string, data?: any): Promise<{ data: T }> {
    await delay()

    // Update endpoints
    if (endpoint.includes('/items/')) {
      return {
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint.includes('/categories/')) {
      return {
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint.includes('/warehouses/')) {
      return {
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint.includes('/suppliers/')) {
      return {
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint.includes('/employees/')) {
      return {
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint.includes('/users/')) {
      return {
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint.includes('/stock/in/')) {
      return {
        data: {
          referenceNumber: endpoint.split('/').pop(),
          count: data?.items?.length || 0,
        } as T,
      }
    }

    if (endpoint.includes('/purchase-orders/')) {
      return {
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint.includes('/sales-orders/')) {
      return {
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        } as T,
      }
    }

    if (endpoint.includes('/demands/')) {
      return {
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        } as T,
      }
    }

    console.warn(`Mock PUT endpoint not found: ${endpoint}`)
    return { data: {} as T }
  }

  async delete<T>(endpoint: string): Promise<{ data: T }> {
    await delay()
    return { data: { success: true } as T }
  }

  async patch<T>(endpoint: string, data?: any): Promise<{ data: T }> {
    await delay()
    return {
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      } as T,
    }
  }

  // Special methods for specific operations
  async addStock<T>(request: any): Promise<T> {
    await delay()
    return {
      id: Math.floor(Math.random() * 10000),
      ...request,
      createdAt: new Date().toISOString(),
    } as T
  }

  async removeStock<T>(request: any): Promise<T> {
    await delay()
    return {
      id: Math.floor(Math.random() * 10000),
      ...request,
      createdAt: new Date().toISOString(),
    } as T
  }
}

export const mockApiClient = new MockApiClient()
