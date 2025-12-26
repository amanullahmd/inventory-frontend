import { apiClient } from '@/lib/api/client';
import { User, ApiError } from '@/lib/types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  branchName: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  branchName: string;
}

export class UserService {
  /**
   * Get current user's profile
   * Requirements: 1.1, 1.2
   */
  static async getCurrentUserProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>('/users/profile');
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to fetch user profile');
    }
  }

  /**
   * Update current user's profile
   * Requirements: 1.1, 1.2, 1.3, 1.4
   */
  static async updateUserProfile(request: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>('/users/profile', request);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to update user profile');
    }
  }

  /**
   * Add dummy data for testing
   * Requirements: 5.1, 5.5
   */
  static async addDummyData(): Promise<{ itemsCreated: number; message: string }> {
    try {
      const response = await apiClient.post<{ itemsCreated: number; message: string }>('/users/dummy-data', {});
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to add dummy data');
    }
  }

  /**
   * Get all users (admin only)
   * Requirements: 5.2
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      return await apiClient.getUsers();
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to fetch users');
    }
  }
}
