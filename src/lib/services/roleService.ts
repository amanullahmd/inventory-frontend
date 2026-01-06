import { apiClient } from '@/lib/api/client'
import { Role, Permission } from '@/types/user'

export const roleService = {
  getAll: async (): Promise<Role[]> => {
    const response = await apiClient.get<Role[]>('/roles')
    return response.data
  },

  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await apiClient.get<Permission[]>('/permissions')
    return response.data
  },

  create: async (role: Partial<Role>): Promise<Role> => {
    const response = await apiClient.post<Role>('/roles', role)
    return response.data
  },

  update: async (id: number, role: Partial<Role>): Promise<Role> => {
    const response = await apiClient.put<Role>(`/roles/${id}`, role)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/roles/${id}`)
  }
}
