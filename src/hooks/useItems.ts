'use client';

import { useState, useCallback, useEffect } from 'react';
import { ItemService } from '@/lib/services/itemService';
import { Item, CreateItemRequest } from '@/lib/types';

/**
 * Custom hook for item management
 * Handles fetching, creating, and managing inventory items
 */
export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all items with stock information
   */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ItemService.getItems();
      setItems(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(message);
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new item
   */
  const createItem = useCallback(async (input: CreateItemRequest) => {
    setError(null);
    try {
      const newItem = await ItemService.createItem(input);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create item';
      setError(message);
      console.error('Error creating item:', err);
      throw err;
    }
  }, []);

  /**
   * Get a specific item by ID from the items list
   */
  const getItem = useCallback((itemId: string | number) => {
    return items.find(item => String(item.id) === String(itemId)) || null;
  }, [items]);

  /**
   * Refresh items list
   */
  const refresh = useCallback(() => {
    return fetchItems();
  }, [fetchItems]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    getItem,
    refresh,
    clearError,
  };
}
