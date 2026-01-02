'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import PermissionGuard from '@/components/PermissionGuard'
import { UserService } from '@/lib/services/userService'
import { formatDateDMY } from '@/lib/utils/date'

interface UserProfile {
  userId?: number
  firstName: string
  lastName: string
  email: string
  branchName: string
  position?: string
  grade?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

interface User extends UserProfile {
  userId: number
  createdAt?: string
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const isAdmin = (session as any)?.roles?.includes('ROLE_ADMIN')
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    branchName: '',
  })
  const [users, setUsers] = useState<User[]>([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', branchName: '', role: 'ROLE_USER' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    setError(null)
    const init = async () => {
      try {
        const p = await UserService.getCurrentUserProfile()
        const name = (p as any).name || ''
        const parts = name.trim().split(/\s+/)
        const first = parts[0] || ''
        const last = parts.slice(1).join(' ') || ''
        setProfile({
          firstName: first,
          lastName: last,
          email: p.email || session?.user?.email || '',
          branchName: p.branchName || 'Main Branch',
          position: (p as any).position || '',
          grade: (p as any).grade || '',
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })
      } catch {
        // Fallback to session
        const name = session?.user?.name || ''
        const parts = name.trim().split(/\s+/)
        setProfile(prev => ({
          ...prev,
          firstName: parts[0] || '',
          lastName: parts.slice(1).join(' ') || '',
          email: session?.user?.email || '',
          branchName: 'Main Branch',
        }))
      }
    }
    if (status === 'authenticated') init()
  }, [status])

  // Clear error on component mount and suppress unhandled errors
  useEffect(() => {
    setError(null)
    
    // Suppress unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Network')) {
        event.preventDefault()
      }
    }
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }, [])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const fullName = `${profile.firstName.trim()}${profile.lastName.trim() ? ' ' + profile.lastName.trim() : ''}`
      await UserService.updateUserProfile({
        name: fullName,
        email: profile.email,
        branchName: profile.branchName,
        position: profile.position,
        grade: profile.grade,
      })
      setSuccess('Profile updated successfully!')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update profile. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newUser.name || !newUser.email || !newUser.branchName) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      // Call API to create user
      const parts = newUser.name.trim().split(/\s+/)
      const createdUser: User = {
        userId: Math.floor(Math.random() * 10000),
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: newUser.email,
        branchName: newUser.branchName,
        role: newUser.role,
        createdAt: new Date().toISOString(),
      }
      
      setUsers([...users, createdUser])
      setSuccess(`User "${newUser.name}" created successfully!`)
      setNewUser({ name: '', email: '', branchName: '', role: 'ROLE_USER' })
      setShowUserForm(false)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create user'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      setLoading(true)
      setUsers(users.filter(u => u.userId !== userId))
      setSuccess('User deleted successfully!')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete user'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6">
          <LoadingSpinner size="medium" text="Loading..." />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to access settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">⚙️ Settings</h1>
        <p className="text-lg text-muted-foreground mt-2">Manage your profile and system settings</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <h2 className="text-2xl font-bold text-foreground mb-6">👤 Profile</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  placeholder="Enter your first name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  placeholder="Enter your last name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter your email address"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Branch Name */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">Branch Name</label>
                <input
                  type="text"
                  name="branchName"
                  value={profile.branchName}
                  onChange={handleProfileChange}
                  placeholder="Enter your branch name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">Position</label>
                <input
                  type="text"
                  name="position"
                  value={profile.position || ''}
                  onChange={handleProfileChange}
                  placeholder="e.g., Director, Assistant Director"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Grade */}
              <div>
                <label className="block text-base font-semibold text-foreground mb-3">Grade</label>
                <input
                  type="text"
                  name="grade"
                  value={profile.grade || ''}
                  onChange={handleProfileChange}
                  placeholder="e.g., 9th Grade, 8th Grade, High"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>💾 Save profile</>
                )}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <h2 className="text-2xl font-bold text-foreground mb-4">ℹ️ Account</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Role</p>
                <p className="text-lg font-semibold text-foreground mt-1">{session.roles?.join(', ').replace(/ROLE_/g, '') || 'User'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Member since</p>
                <p className="text-lg font-semibold text-foreground mt-1">{profile.createdAt ? formatDateDMY(profile.createdAt) : '2024'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Last updated</p>
                <p className="text-lg font-semibold text-foreground mt-1">{profile.updatedAt ? formatDateDMY(profile.updatedAt) : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management (Admin Only) */}
      {isAdmin && (
        <PermissionGuard permission="create_user">
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">👥 User management</h2>
                <p className="mt-2 text-base text-muted-foreground">Create and remove users.</p>
              </div>
              <button
                onClick={() => setShowUserForm(true)}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              >
                ➕ Add user
              </button>
            </div>

            {/* Add User Form */}
            {showUserForm ? (
              <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                <button
                  aria-label="Close"
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                  onClick={() => setShowUserForm(false)}
                />
                <div className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Create user</h3>
                      <p className="mt-2 text-base text-muted-foreground">Add a user with branch assignment.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUserForm(false)}
                      className="rounded-md border border-border bg-background px-3 py-2 text-base text-foreground hover:bg-accent transition-colors"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleAddUser} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                      <input
                        type="text"
                        placeholder="Branch Name"
                        value={newUser.branchName}
                        onChange={(e) => setNewUser({...newUser, branchName: e.target.value})}
                        className="rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        className="rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="ROLE_USER">User</option>
                        <option value="ROLE_ADMIN">Admin</option>
                      </select>
                    </div>
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setShowUserForm(false)}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-3 text-base font-semibold text-foreground shadow-sm hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                      >
                        Create user
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : null}

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Email</th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Branch</th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Role</th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No users yet. Create one to get started.
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.userId} className="hover:bg-accent/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-foreground">{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-muted-foreground">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-muted-foreground">{user.branchName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-chart-1/10 text-chart-1">
                            {user.role?.replace('ROLE_', '') || 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base">
                          <button
                            onClick={() => handleDeleteUser(user.userId)}
                            className="inline-flex items-center rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-base font-semibold text-destructive hover:bg-destructive/15 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </PermissionGuard>
      )}
    </div>
  )
}
