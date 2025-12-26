import { apiClient } from '@/lib/api/client';
import { StockMovement, StockInRequest, StockOutRequest, ApiError } from '@/lib/types';

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
   * Get stock in transactions
   * Requirements: 2.2, 2.4
   */
  static async getStockInTransactions(): Promise<StockMovementResponse[]> {
    try {
      const response = await apiClient.get<StockMovementResponse[]>('/stock/in');
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to fetch stock in transactions');
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
  static async getStockSummary(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>('/stock');
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to fetch stock summary');
    }
  }
}
