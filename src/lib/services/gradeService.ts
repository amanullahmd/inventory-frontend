import { apiClient } from '@/lib/api/client';
import { Grade } from '@/types/user';

export const gradeService = {
    getAll: async (): Promise<Grade[]> => {
        const response = await apiClient.get<Grade[]>('/grades');
        return response.data;
    },

    create: async (grade: Omit<Grade, 'id'>): Promise<Grade> => {
        const response = await apiClient.post<Grade>('/grades', grade);
        return response.data;
    },

    update: async (id: number, grade: Partial<Grade>): Promise<Grade> => {
        const response = await apiClient.put<Grade>(`/grades/${id}`, grade);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/grades/${id}`);
    },
};
