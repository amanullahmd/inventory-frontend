'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import PermissionGuard from '@/components/PermissionGuard'
import { apiClient, UpdateUserRequest } from '@/lib/api/client'
import { formatDateDMY, formatDateTime } from '@/lib/utils/date'
import { Grade } from '@/types/user'
import { WarehouseService, Warehouse } from '@/lib/services/warehouseService'
import { gradeService } from '@/lib/services/gradeService'
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  Mail, 
  Briefcase, 
  Trash2,
  Save,
  X,
  RefreshCw
} from 'lucide-react'

interface User {
  userId: number
  email: string
  firstName: string
  lastName: string
  fullName: string
  role: string
  position?: string
  enabled: boolean
  createdAt: string
  lastLogin?: string
  phone?: string
  address?: string
  branchName?: string
  gradeId?: number
  warehouseId?: number
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  
  // Form State
  const [showForm, setShowForm] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  
  const initialFormData = { 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    position: '',
    role: 'User', 
    gradeId: '',
    warehouseId: '' 
  }
  const [formData, setFormData] = useState(initialFormData)

  // Fetch users from backend on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [usersRes, gradesRes, warehousesRes] = await Promise.all([
          apiClient.get<any[]>('/users'),
          gradeService.getAll(),
          WarehouseService.getWarehouses()
        ])
        
        // Transform backend user data to display format
        const transformedUsers = usersRes.data.map(user => ({
          userId: user.id || user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          role: user.roles?.[0] || user.role?.name || user.role || 'User',
          position: user.position || '-',
          enabled: user.enabled,
          createdAt: user.createdAt,
          joinDate: formatDateDMY(user.createdAt),
          lastLogin: user.lastLogin ? formatDateTime(user.lastLogin) : 'Never',
          phone: user.phone || '-',
          address: user.address || '-',
          branchName: user.branchName || user.warehouse?.name || '-',
          gradeId: user.gradeId || user.grade?.id,
          warehouseId: user.warehouseId || user.warehouse?.warehouseId || user.warehouse?.id
        }))
        setUsers(transformedUsers)
        setGrades(gradesRes)
        setWarehouses(warehousesRes)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setUsers([])
        setError('Failed to load data from server')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      loadData()
    }
  }, [status])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.position && user.position.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleDeleteClick = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      try {
        // In a real app, you would call the delete API here
        // await apiClient.deleteUser(user.userId)
        
        // Optimistic update
        setUsers(users.filter(u => u.userId !== user.userId))
        setSuccess(`User ${user.fullName} has been removed`)
        
        // If we were editing this user, reset the form
        if (editingUserId === user.userId) {
          handleCancelEdit()
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete user')
      }
    }
  }

  const handleAddNewClick = () => {
    setEditingUserId(null)
    setFormData(initialFormData)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditClick = (user: User) => {
    setEditingUserId(user.userId)
    setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '', // Password is optional on edit
        position: user.position === '-' ? '' : user.position || '',
        role: user.role === 'ROLE_ADMIN' || user.role === 'ADMIN' ? 'Admin' : 'User',
        gradeId: user.gradeId ? String(user.gradeId) : '',
        warehouseId: user.warehouseId ? String(user.warehouseId) : ''
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setFormData(initialFormData)
    setShowForm(false)
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields')
      return
    }

    if (!editingUserId && !formData.password) {
        setError('Password is required for new users')
        return
    }

    try {
      if (editingUserId) {
        // Update User
        const payload: UpdateUserRequest = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            role: formData.role,
            position: formData.position,
            gradeId: formData.gradeId ? Number(formData.gradeId) : undefined,
            warehouseId: formData.warehouseId ? Number(formData.warehouseId) : undefined,
        }
        await apiClient.updateUser(editingUserId, payload)
        setSuccess(`User updated successfully!`)
      } else {
        // Create User
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            position: formData.position,
            role: formData.role,
            gradeId: formData.gradeId ? Number(formData.gradeId) : undefined,
            warehouseId: formData.warehouseId ? Number(formData.warehouseId) : undefined,
            username: formData.email 
        }
        await apiClient.createUser(payload)
        setSuccess(`User created successfully!`)
      }
      
      handleCancelEdit()
      
      // Refresh list
      const response = await apiClient.get<any[]>('/users')
      const transformedUsers = response.data.map(user => ({
          userId: user.id || user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          role: user.roles?.[0] || user.role?.name || user.role || 'User',
          position: user.position || '-',
          enabled: user.enabled,
          createdAt: user.createdAt,
          joinDate: formatDateDMY(user.createdAt),
          lastLogin: user.lastLogin ? formatDateTime(user.lastLogin) : 'Never',
          phone: user.phone || '-',
          address: user.address || '-',
          branchName: user.branchName || user.warehouse?.name || '-',
          gradeId: user.gradeId || user.grade?.id,
          warehouseId: user.warehouseId || user.warehouse?.warehouseId || user.warehouse?.id
        }))
        setUsers(transformedUsers)

    } catch (err: any) {
      setError(err.message || 'Operation failed')
    }
  }

  if (status === 'loading') return <LoadingSpinner />
  
  if (!session) {
    return <div className="p-10 text-center">Please sign in to manage users.</div>
  }

  const isAdmin = (session as any).roles?.includes('ROLE_ADMIN') || (session as any).roles?.includes('ADMIN')

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground">Access denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">Only administrators can access the user management page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              User Management
            </h1>
            <p className="mt-2 text-base text-muted-foreground">Manage system users, roles, and access permissions</p>
          </div>
          {!showForm && (
            <button 
              onClick={handleAddNewClick}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Users className="w-4 h-4" /> Add New User
            </button>
          )}
        </div>
        
        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />}
        {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}
        
        {/* Inline Create/Edit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-4 duration-200">
          <div className="md:col-span-4 mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {editingUserId ? <><Briefcase className="w-5 h-5" /> Edit User</> : <><Users className="w-5 h-5" /> Add New User</>}
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">First Name *</label>
            <input 
              className="w-full rounded-lg border border-border px-3 py-2 bg-background" 
              value={formData.firstName} 
              onChange={e => setFormData({ ...formData, firstName: e.target.value })} 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <input 
              className="w-full rounded-lg border border-border px-3 py-2 bg-background" 
              value={formData.lastName} 
              onChange={e => setFormData({ ...formData, lastName: e.target.value })} 
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              type="email"
              className="w-full rounded-lg border border-border px-3 py-2 bg-background" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password {editingUserId && '(Optional)'}</label>
            <input 
              type="password"
              className="w-full rounded-lg border border-border px-3 py-2 bg-background" 
              value={formData.password} 
              onChange={e => setFormData({ ...formData, password: e.target.value })} 
              placeholder={editingUserId ? "Leave blank to keep" : "Min 8 chars"}
              required={!editingUserId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <select 
              className="w-full rounded-lg border border-border px-3 py-2 bg-background" 
              value={formData.role} 
              onChange={e => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input 
              className="w-full rounded-lg border border-border px-3 py-2 bg-background" 
              value={formData.position} 
              onChange={e => setFormData({ ...formData, position: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Grade</label>
            <select 
              className="w-full rounded-lg border border-border px-3 py-2 bg-background" 
              value={formData.gradeId} 
              onChange={e => setFormData({ ...formData, gradeId: e.target.value })}
            >
              <option value="">Select Grade</option>
              {grades.map(g => (
                <option key={g.id} value={g.id}>{g.gradeNumber} - {g.description}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Branch</label>
            <select 
              className="w-full rounded-lg border border-border px-3 py-2 bg-background" 
              value={formData.warehouseId} 
              onChange={e => setFormData({ ...formData, warehouseId: e.target.value })}
            >
              <option value="">Select Branch</option>
              {warehouses.map(w => (
                <option key={w.warehouseId} value={w.warehouseId}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end gap-3 mt-2">
            {editingUserId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {editingUserId ? <Save className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              {editingUserId ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
        )}
        
        {/* Search & Filter Bar */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full md:w-48 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Role & Position</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Branch</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Last Login</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No users found</td></tr>
                ) : filteredUsers.map(user => (
                  <tr key={user.userId} className={`hover:bg-accent/40 transition-colors ${editingUserId === user.userId ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div 
                          className="cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleEditClick(user)}
                        >
                          <div className="font-medium text-foreground">{user.fullName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'Admin' || user.role === 'ADMIN' || user.role === 'ROLE_ADMIN'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                        }`}>
                          {user.role === 'ROLE_ADMIN' || user.role === 'ADMIN' ? 'Admin' : 'User'}
                        </span>
                        {user.position && user.position !== '-' && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {user.position}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.branchName}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit"
                        >
                          <Briefcase className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
