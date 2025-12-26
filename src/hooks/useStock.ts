'use client';

import { useState, useCallback } from 'react';
import { StockService, StockMovementResponse } from '@/lib/services/stockService';
import { StockInRequest, StockOutRequest } from '@/lib/types';

/**
 * Custom hook for stock management
 * Handles stock in/out operations and movement tracking
 */
export function useStock() {
  const [movements, setMovements] = useState<StockMovementResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Record stock in
   */
  const stockIn = useCallback(async (itemId: string | number, quantity: number, note?: string, branch?: string) => {
    setError(null);
    setLoading(true);
    try {
      const movement = await StockService.recordStockIn({
        itemId: String(itemId),
        quantity,
        note,
        branch,
      });
      setMovements(prev => [movement, ...prev]);
      return movement;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to record stock in';
      setError(message);
      console.error('Error recording stock in:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Record stock out
   */
  const stockOut = useCallback(async (itemId: string | number, quantity: number, note?: string, branch?: string) => {
    setError(null);
    setLoading(true);
    try {
      const movement = await StockService.recordStockOut({
        itemId: String(itemId),
        quantity,
        note,
        branch,
      });
      setMovements(prev => [movement, ...prev]);
      return movement;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to record stock out';
      setError(message);
      console.error('Error recording stock out:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Record a stock movement (in or out)
   */
  const recordMovement = useCallback(async (itemId: string | number, movementType: 'IN' | 'OUT', quantity: number, note?: string, branch?: string) => {
    if (movementType === 'IN') {
      return stockIn(itemId, quantity, note, branch);
    } else {
      return stockOut(itemId, quantity, note, branch);
    }
  }, [stockIn, stockOut]);

  /**
   * Validate quantity
   */
  const validateQuantity = useCallback((quantity: number): boolean => {
    if (!quantity || quantity <= 0) {
      setError('Quantity must be greater than 0');
      return false;
    }
    return true;
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    movements,
    loading,
    error,
    recordMovement,
    stockIn,
    stockOut,
    validateQuantity,
    clearError,
  };
}
