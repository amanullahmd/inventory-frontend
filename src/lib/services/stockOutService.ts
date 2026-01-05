import { apiClient } from '@/lib/api/client';

const API_URL = '/stock-outs';

export enum StockOutType {
    BRANCH_TRANSFER = 'BRANCH_TRANSFER',
    EMPLOYEE = 'EMPLOYEE',
    LOST = 'LOST',
    DAMAGE = 'DAMAGE',
    USED = 'USED'
}

export interface StockOutRequest {
    stockOutType: StockOutType;
    itemId: number;
    quantity: number;
    note?: string;
    date?: string;
}

export interface StockOutResponse {
    id: number;
    stockOutType: StockOutType;
    itemId: number;
    itemName: string;
    itemSku: string;
    quantity: number;
    stockOutDate: string;
    note?: string;
    sourceWarehouseId?: number;
    sourceWarehouseName?: string;
    branchId?: number;
    branchName?: string;
    employeeId?: number;
    employeeName?: string;
    referenceNumber?: string;
}

export interface StockOutItemRequest {
    itemId: number;
    quantity: number;
}

export interface CreateStockOutBatchRequest {
    stockOutType: StockOutType;
    sourceWarehouseId?: number;
    branchId?: number;
    employeeId?: number;
    note?: string;
    date?: string;
    items: StockOutItemRequest[];
}

export const stockOutService = {
    getAll: async () => {
        const response = await apiClient.get<StockOutResponse[]>(API_URL);
        return Array.isArray(response.data) ? response.data : [];
    },

    getById: async (id: number) => {
        const response = await apiClient.get<StockOutResponse>(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (data: StockOutRequest) => {
        const response = await apiClient.post<StockOutResponse>(API_URL, data);
        return response.data;
    },

    createBatch: async (data: CreateStockOutBatchRequest) => {
        const response = await apiClient.post<StockOutResponse[]>(`${API_URL}/batch`, data);
        return response.data;
    },

    update: async (id: number, data: StockOutRequest) => {
        const response = await apiClient.put<StockOutResponse>(`${API_URL}/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await apiClient.delete(`${API_URL}/${id}`);
    }
};
