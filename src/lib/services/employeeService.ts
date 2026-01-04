import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/types'

export interface Employee {
  employeeId: number
  employeeCode: string
  name: string
  grade?: string
  position?: string
  branchId?: number
  branchName?: string
  mobileNumber?: string
  email?: string
  address?: string
  servicePeriod?: string
  nidNumber?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateEmployeeRequest {
  name: string
  grade?: string
  position?: string
  branchId?: number
  mobileNumber?: string
  email?: string
  address?: string
  servicePeriod?: string
  nidNumber?: string
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  employeeCode?: string
}

export class EmployeeService {
  static async getEmployees(): Promise<Employee[]> {
    try {
      const res = await apiClient.get<Employee[]>('/employees')
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch employees')
    }
  }
  static async createEmployee(payload: CreateEmployeeRequest): Promise<Employee> {
    try {
      const res = await apiClient.post<Employee>('/employees', payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to create employee')
    }
  }
  static async getEmployee(id: number): Promise<Employee> {
    try {
      const res = await apiClient.get<Employee>(`/employees/${id}`)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to fetch employee')
    }
  }
  static async updateEmployee(id: number, payload: UpdateEmployeeRequest): Promise<Employee> {
    try {
      const res = await apiClient.put<Employee>(`/employees/${id}`, payload)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to update employee')
    }
  }
  static async deleteEmployee(id: number): Promise<void> {
    try {
      await apiClient.delete<void>(`/employees/${id}`)
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to delete employee')
    }
  }
}
