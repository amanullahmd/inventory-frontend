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
}

export class ItemService {
  private static toItem(backendItem: BackendItemStockResponse): Item {
    return {
      id: String(backendItem.itemId),
      name: backendItem.name,
      sku: backendItem.sku,
      unitCost: backendItem.unitPrice,
      currentStock: backendItem.currentStock,
      createdAt: backendItem.createdAt,
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
      // Ensure unitCost is a number and convert to backend's unitPrice field
      const payload = {
        name: item.name,
        sku: item.sku,
        unitPrice: typeof item.unitCost === 'string' ? parseFloat(item.unitCost) : item.unitCost,
        categoryId: item.categoryId,
        description: item.description,
        minimumStock: item.minimumStock ? parseInt(String(item.minimumStock)) : undefined,
        maximumStock: item.maximumStock ? parseInt(String(item.maximumStock)) : undefined,
        reorderLevel: item.reorderLevel ? parseInt(String(item.reorderLevel)) : undefined,
        unit: (item as any).unit || undefined,
      };
      
      const response = await apiClient.post<BackendItemStockResponse>('/items', payload);
      return ItemService.toItem(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to create item');
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
