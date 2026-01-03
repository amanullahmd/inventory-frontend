import { apiClient } from '@/lib/api/client';
import { StockMovement, StockInRequest, StockOutRequest, ApiError, StockInBatchRequest } from '@/lib/types';

export interface StockMovementResponse extends StockMovement {
  branch?: string;
}

export class StockService {
  /**
   * Record a stock-in movement
   * Requirements: 2.1, 2.2
   */
  static async recordStockIn(request: StockInRequest & { branch?: string }): Promise<StockMovementResponse> {
    try {
      return await apiClient.addStock(request);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to record stock in');
    }
  }

  /**
   * Record a stock-out movement
   * Requirements: 2.1, 2.2
   */
  static async recordStockOut(request: StockOutRequest & { branch?: string }): Promise<StockMovementResponse> {
    try {
      return await apiClient.removeStock(request);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to record stock out');
    }
  }

  
  /**
   * Record a stock-in batch (multiple items under one reference id)
   */
  static async recordStockInBatch(payload: StockInBatchRequest): Promise<{ referenceNumber: string; count: number }> {
    try {
      const response = await apiClient.post<{ referenceNumber: string; count: number }>('/stock/in/batch', payload);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to record stock in batch');
    }
  }
  
  /**
   * Get stock-in items by reference id
   */
  static async getStockInByReference(ref: string): Promise<import('@/lib/types').StockInDetail[]> {
    try {
      const response = await apiClient.get<import('@/lib/types').StockInDetail[]>(`/stock/in/${ref}`);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to fetch stock-in details');
    }
  }
  
  static async deleteStockIn(ref: string): Promise<void> {
    try {
      await apiClient.delete<void>(`/stock/in/${ref}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to delete stock-in');
    }
  }
  
  static async updateStockIn(ref: string, payload: import('@/lib/types').StockInBatchRequest): Promise<{ referenceNumber: string }> {
    try {
      const response = await apiClient.put<{ referenceNumber: string }>(`/stock/in/${ref}`, payload);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to update stock-in');
    }
  }

  /**
   * Get stock out transactions
   * Requirements: 2.2, 2.4
   */
  static async getStockOutTransactions(): Promise<StockMovementResponse[]> {
    try {
      const response = await apiClient.get<StockMovementResponse[]>('/stock/out');
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to fetch stock out transactions');
    }
  }

  /**
   * Get stock summary for all items
   * Requirements: 2.4
   */
  static async getStockInTransactions(): Promise<import('@/lib/types').StockInSummary[]> {
    try {
      const response = await apiClient.get<import('@/lib/types').StockInSummary[]>('/stock/in/grouped');
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to fetch stock summary');
    }
  }
}
