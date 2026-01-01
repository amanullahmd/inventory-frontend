import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  ApiResponse,
  ApiError,
  Item,
  CreateItemRequest,
  StockInRequest,
  StockOutRequest,
  StockMovement,
  User,
  CreateUserRequest
} from '@/lib/types';
import { getSession, signOut } from 'next-auth/react';


class ApiClient {
  private client: AxiosInstance;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: attach token if already configured via setAuthToken
    this.client.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Reset retry count on successful response
        this.retryCount = 0;
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 unauthorized - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const session = await getSession();
            if (session?.refreshToken) {
              // Attempt to refresh the token
              const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: session.refreshToken })
              });

              if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                // Update session with new token
                // Note: NextAuth will handle this through the jwt callback
                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${refreshData.accessToken}`;
                return this.client(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }

          // If refresh failed, sign out user
          if (typeof window !== 'undefined') {
            await signOut({ callbackUrl: '/auth/signin' });
          }
          const apiError: ApiError = {
            message: 'Authentication required',
            status: 401,
            details: error.response?.data,
          };
          return Promise.reject(apiError);
        }

        // Handle 403 forbidden - session expired, sign out user
        if (error.response?.status === 403) {
          if (typeof window !== 'undefined') {
            // Sign out and redirect to login
            await signOut({ callbackUrl: '/auth/signin' });
          }
          const apiError: ApiError = {
            message: 'Session expired. Please sign in again.',
            status: 403,
            details: error.response?.data,
          };
          return Promise.reject(apiError);
        }

        // Handle network errors with retry logic
        if (!error.response && this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`Retrying request (${this.retryCount}/${this.maxRetries})`);
          return this.client.request(originalRequest!);
        }

        const apiError: ApiError = {
          message: (error.response?.data as { message?: string })?.message || error.message || 'An error occurred',
          status: error.response?.status || 500,
          details: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  // Method to set authorization token
  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Method to clear authorization token
  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  // Enhanced error handling methods
  private handleApiError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: (error.response.data as { message?: string })?.message || `Server error: ${error.response.status}`,
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error - please check your connection',
        status: 0,
        details: { type: 'network_error' },
      };
    } else {
      // Request setup error
      return {
        message: error.message || 'Request configuration error',
        status: 0,
        details: { type: 'request_error' },
      };
    }
  }

  // Success response processing
  private processSuccessResponse<T>(response: AxiosResponse<ApiResponse<T> | T>): ApiResponse<T> {
    const payload = response.data as ApiResponse<T> | T;

    if (
      payload &&
      typeof payload === 'object' &&
      'data' in payload &&
      !Array.isArray(payload)
    ) {
      const wrapped = payload as ApiResponse<T>;
      return {
        data: wrapped.data,
        message: wrapped.message || 'Operation successful',
      };
    }

    return {
      data: payload as T,
      message: 'Operation successful',
    };
  }

  // Enhanced HTTP methods with better error handling
  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T> | T>(url);
      return this.processSuccessResponse(response);
    } catch (error) {
      throw this.handleApiError(error as AxiosError);
    }
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T> | T>(url, data);
      return this.processSuccessResponse(response);
    } catch (error) {
      throw this.handleApiError(error as AxiosError);
    }
  }

  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T> | T>(url, data);
      return this.processSuccessResponse(response);
    } catch (error) {
      throw this.handleApiError(error as AxiosError);
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T> | T>(url);
      return this.processSuccessResponse(response);
    } catch (error) {
      throw this.handleApiError(error as AxiosError);
    }
  }

  // Public API methods
  async getItems(): Promise<Item[]> {
    const response = await this.get<Item[]>('/items');
    return response.data;
  }

  async createItem(item: CreateItemRequest): Promise<Item> {
    const response = await this.post<Item>('/items', item);
    return response.data;
  }

  async addStock(request: StockInRequest): Promise<StockMovement> {
    const response = await this.post<StockMovement>('/stock/in', request);
    return response.data;
  }

  async removeStock(request: StockOutRequest): Promise<StockMovement> {
    const response = await this.post<StockMovement>('/stock/out', request);
    return response.data;
  }

  async getUsers(): Promise<User[]> {
    const response = await this.get<User[]>('/users');
    return response.data;
  }

  async createUser(user: CreateUserRequest): Promise<User> {
    const response = await this.post<User>('/users', user);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
