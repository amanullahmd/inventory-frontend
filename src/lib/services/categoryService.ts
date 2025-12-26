import { apiClient } from '@/lib/api/client';
import { ApiError } from '@/lib/types';

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt?: string;
}

interface BackendCategory {
  categoryId: number;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export class CategoryService {
  private static toCategory(category: BackendCategory): Category {
    return {
      id: category.categoryId,
      name: category.name,
      description: category.description,
      color: category.color,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  /**
   * Fetch all categories from the backend
   * Requirements: 3.2 - Category retrieval
   */
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<BackendCategory[]>('/categories');
      // Backend returns array directly, not wrapped
      const data = Array.isArray(response.data) ? response.data : [];
      return data.map(CategoryService.toCategory);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to fetch categories');
    }
  }

  /**
   * Create a new category
   * Requirements: 3.1 - Category creation with validation
   */
  static async createCategory(request: CreateCategoryRequest): Promise<Category> {
    try {
      const response = await apiClient.post<BackendCategory>('/categories', request);
      return CategoryService.toCategory(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to create category');
    }
  }

  /**
   * Update an existing category
   * Requirements: 3.1 - Category update
   */
  static async updateCategory(categoryId: number, request: CreateCategoryRequest): Promise<Category> {
    try {
      const response = await apiClient.put<BackendCategory>(`/categories/${categoryId}`, request);
      return CategoryService.toCategory(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to update category');
    }
  }

  /**
   * Delete a category
   * Requirements: 3.1 - Category deletion
   */
  static async deleteCategory(categoryId: number): Promise<void> {
    try {
      await apiClient.delete(`/categories/${categoryId}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to delete category');
    }
  }
}
