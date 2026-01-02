'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { User, ApiError } from '@/lib/types'
import { apiClient } from '@/lib/api/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatDateDMY } from '@/lib/utils/date'

interface UserTableProps {
  onUserCreated?: () => void
}

export default function UserTable({ onUserCreated }: UserTableProps) {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is admin
  const isAdmin = session?.roles?.includes('Admin')

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) {
      setError('Access denied - Admin role required')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const fetchedUsers = await apiClient.getUsers()
      setUsers(fetchedUsers)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchUsers()
  }, [isAdmin, fetchUsers])

  // Refresh users when a new user is created
  useEffect(() => {
    if (onUserCreated) {
      fetchUsers()
    }
  }, [onUserCreated, fetchUsers])

  const handleRetry = () => {
    fetchUsers()
  }

  // Non-admin access denied
  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold text-destructive">Access denied</div>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have permission to access user management. Admin role is required.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="medium" text="Loading users..." />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold text-foreground">Error loading users</div>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <button
          onClick={handleRetry}
          className="mt-4 inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">User management</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage system users and their roles</p>
      </div>
      
      {users.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          <p>No users found in the system.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-accent/40 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {user.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            role === 'Admin'
                              ? 'bg-chart-4/10 text-chart-4'
                              : 'bg-chart-1/10 text-chart-1'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatDateDMY(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
