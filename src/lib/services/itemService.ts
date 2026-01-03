import { apiClient } from '@/lib/api/client';
import { Item, CreateItemRequest, ApiError } from '@/lib/types';

interface BackendItemStockResponse {
  itemId: number;
  name: string;
  sku: string;
  unitPrice: number;
  currentStock: number;
  createdAt: string;
  totalStockIn?: number;
  totalStockOut?: number;
  categoryId?: number;
  categoryName?: string;
}

export class ItemService {
  private static toItem(backendItem: BackendItemStockResponse): Item {
    return {
      id: String(backendItem.itemId),
      name: backendItem.name,
      sku: backendItem.sku,
      currentStock: backendItem.currentStock,
      createdAt: backendItem.createdAt,
      unitCost: backendItem.unitPrice,
      categoryId: backendItem.categoryId !== undefined && backendItem.categoryId !== null ? String(backendItem.categoryId) : undefined,
      categoryName: backendItem.categoryName,
    };
  }

  /**
   * Fetch all inventory items from the backend
   * Requirements: 1.1, 2.1, 4.1
   */
  static async getItems(): Promise<Item[]> {
    try {
      const response = await apiClient.get<BackendItemStockResponse[]>('/items');
      // Backend returns array directly, not wrapped
      const data = Array.isArray(response.data) ? response.data : [];
      return data.map(ItemService.toItem);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to fetch items');
    }
  }

  /**
   * Create a new inventory item
   * Requirements: 1.1
   */
  static async createItem(item: CreateItemRequest): Promise<Item> {
    try {
      const payload: any = {
        name: item.name,
        sku: item.sku,
        categoryId: item.categoryId,
        description: item.description,
        minimumStock: item.minimumStock ? parseInt(String(item.minimumStock)) : undefined,
        maximumStock: item.maximumStock ? parseInt(String(item.maximumStock)) : undefined,
        reorderLevel: item.reorderLevel ? parseInt(String(item.reorderLevel)) : undefined,
      };
      if (item.unitCost !== undefined && item.unitCost !== null) {
        payload.unitPrice = typeof item.unitCost === 'string' ? parseFloat(item.unitCost) : item.unitCost;
      }
      
      const response = await apiClient.post<BackendItemStockResponse>('/items', payload);
      return ItemService.toItem(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to create item');
    }
  }

  /**
   * Update an existing inventory item
   * Requirements: allow correcting wrong info
   */
  static async updateItem(itemId: number, item: CreateItemRequest): Promise<Item> {
    try {
      const payload: any = {
        name: item.name,
        sku: item.sku,
        categoryId: item.categoryId,
        description: item.description,
        minimumStock: item.minimumStock ? parseInt(String(item.minimumStock)) : undefined,
        maximumStock: item.maximumStock ? parseInt(String(item.maximumStock)) : undefined,
        reorderLevel: item.reorderLevel ? parseInt(String(item.reorderLevel)) : undefined,
      }
      if (item.unitCost !== undefined && item.unitCost !== null) {
        payload.unitPrice = typeof item.unitCost === 'string' ? parseFloat(item.unitCost) : item.unitCost
      }

      const response = await apiClient.put<BackendItemStockResponse>(`/items/${itemId}`, payload)
      return ItemService.toItem(response.data)
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to update item')
    }
  }

  /**
   * Get dashboard statistics
   * Requirements: 4.1, 4.2, 4.3, 4.4
   */
  static async getStatistics(): Promise<{
    totalItems: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
  }> {
    try {
      const response = await apiClient.get<{
        totalItems: number;
        totalValue: number;
        lowStockCount: number;
        outOfStockCount: number;
      }>('/items/statistics');
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to fetch statistics');
    }
  }
}
