'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import PermissionGuard from '@/components/PermissionGuard'
import { apiClient } from '@/lib/api/client'

interface User {
  userId: number
  email: string
  firstName: string
  lastName: string
  role: string
  enabled: boolean
  createdAt: string
}

// Fallback dummy data (only used if API fails - test data only)
const DUMMY_USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joinDate: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'active', joinDate: '2024-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'active', joinDate: '2024-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'inactive', joinDate: '2024-01-05' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'User', status: 'active', joinDate: '2024-04-01' },
  { id: 6, name: 'Eve Wilson', email: 'eve@example.com', role: 'User', status: 'active', joinDate: '2024-05-12' },
]

export default function UsersPage() {
  const { data: session, status } = useSession()
  // Admin-only page
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' })

  // Fetch users from backend on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get<User[]>('/users')
        // Transform backend user data to display format
        const transformedUsers = response.data.map(user => ({
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          status: user.enabled ? 'active' : 'inactive',
          joinDate: new Date(user.createdAt).toLocaleDateString(),
        }))
        setUsers(transformedUsers)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        // Fallback to dummy data if API fails
        setUsers(DUMMY_USERS)
        setError('Failed to load users from server, showing demo data')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchUsers()
    }
  }, [status])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
    const user = users.find(u => u.id === userId)
    setSuccess(`User ${user?.name} status updated`)
  }

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId)
    setUsers(users.filter(u => u.id !== userId))
    setSuccess(`User ${user?.name} has been removed`)
  }

  const handleCreateUser = (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (users.some(u => u.email === formData.email)) {
      setError('Email already exists')
      return
    }

    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    }

    setUsers([newUser, ...users])
    setSuccess(`User ${formData.name} created successfully!`)
    setFormData({ name: '', email: '', password: '', role: 'User' })
    setShowCreateForm(false)
  }

  const activeUsers = users.filter(u => u.status === 'active').length
  const adminUsers = users.filter(u => u.role === 'Admin').length
  const managerUsers = users.filter(u => u.role === 'Manager').length

  if (status === 'loading') {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to manage users.</p>
        </div>
      </div>
    )
  }

  const isAdmin = (session as any).roles?.includes('ROLE_ADMIN')

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Access denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">Only administrators can access the user management page.</p>
          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage system users and their roles</p>
        </div>
        <PermissionGuard permission="create_user">
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Create user
          </button>
        </PermissionGuard>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Total users</div>
          <div className="mt-2 text-2xl font-semibold text-foreground">{users.length}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Active users</div>
          <div className="mt-2 text-2xl font-semibold text-foreground">{activeUsers}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Admins</div>
          <div className="mt-2 text-2xl font-semibold text-foreground">{adminUsers}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Managers</div>
          <div className="mt-2 text-2xl font-semibold text-foreground">{managerUsers}</div>
        </div>
      </div>

      {/* Create User Form */}
      {showCreateForm ? (
        <PermissionGuard permission="create_user">
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <button
              aria-label="Close"
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowCreateForm(false)}
            />
            <div className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Create user</h2>
                <p className="mt-1 text-sm text-muted-foreground">Add a new user with role-based access.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground hover:bg-accent"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Create user
                </button>
              </div>
            </form>
          </div>
        </div>
        </PermissionGuard>
      ) : null}

      {/* Messages */}
      {success ? (
        <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
          <SuccessMessage 
            message={success} 
            onDismiss={() => setSuccess(null)}
            autoHide
          />
        </div>
      ) : null}
      {error ? (
        <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
          <ErrorMessage 
            message={error} 
            onRetry={() => setError(null)}
          />
        </div>
      ) : null}

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h2 className="text-2xl font-semibold text-foreground">Users ({filteredUsers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Join Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-accent/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground">
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-foreground">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'Admin'
                        ? 'bg-chart-4/10 text-chart-4'
                        : user.role === 'Manager'
                        ? 'bg-chart-5/10 text-chart-5'
                        : 'bg-chart-1/10 text-chart-1'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active'
                        ? 'bg-chart-2/10 text-chart-2'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className="inline-flex items-center rounded-lg border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm hover:bg-accent transition-colors"
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="inline-flex items-center rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/15 transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
