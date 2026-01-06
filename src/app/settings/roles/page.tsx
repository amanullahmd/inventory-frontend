'use client'

import { useState, useEffect } from 'react'
import { roleService } from '@/lib/services/roleService'
import { Role, Permission } from '@/types/user'
import { Shield, Plus, Edit2, Trash2, X, Check, Save } from 'lucide-react'
import SuccessMessage from '@/components/ui/SuccessMessage'
import PermissionGuard from '@/components/auth/PermissionGuard'

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form State
  const [showForm, setShowForm] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '',
    permissionIds: [] as number[]
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [rolesData, permissionsData] = await Promise.all([
        roleService.getAll(),
        roleService.getAllPermissions()
      ])
      setRoles(rolesData)
      setPermissions(permissionsData)
    } catch (err: any) {
      setError('Failed to load roles and permissions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = []
    }
    acc[perm.module].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    try {
      const selectedPermissions = permissions.filter(p => formData.permissionIds.includes(p.id))
      
      const rolePayload = {
        name: formData.name,
        description: formData.description,
        permissions: selectedPermissions
      }

      if (editingRole) {
        await roleService.update(editingRole.id, rolePayload)
        setSuccess('Role updated successfully')
      } else {
        await roleService.create(rolePayload)
        setSuccess('Role created successfully')
      }
      
      await loadData()
      resetForm()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this role? This action cannot be undone.')) return
    
    try {
      await roleService.delete(id)
      setSuccess('Role deleted successfully')
      loadData()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete role')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingRole(null)
    setFormData({ name: '', description: '', permissionIds: [] })
  }

  const openEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({ 
      name: role.name, 
      description: role.description,
      permissionIds: role.permissions.map(p => p.id)
    })
    setShowForm(true)
  }

  const togglePermission = (id: number) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(id)
        ? prev.permissionIds.filter(pid => pid !== id)
        : [...prev.permissionIds, id]
    }))
  }

  const toggleModule = (module: string) => {
    const modulePerms = groupedPermissions[module].map(p => p.id)
    const allSelected = modulePerms.every(id => formData.permissionIds.includes(id))
    
    setFormData(prev => ({
      ...prev,
      permissionIds: allSelected
        ? prev.permissionIds.filter(id => !modulePerms.includes(id))
        : [...new Set([...prev.permissionIds, ...modulePerms])]
    }))
  }

  if (loading) return <div className="p-8 text-center">Loading roles...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
        </div>
        <PermissionGuard permission="ROLE_MANAGE">
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Role
          </button>
        </PermissionGuard>
      </div>

      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map(role => (
          <div key={role.id} className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{role.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{role.description}</p>
              </div>
              <PermissionGuard permission="ROLE_MANAGE">
                <div className="flex gap-2">
                  <button onClick={() => openEdit(role)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {role.name !== 'Administrator' && (
                    <button onClick={() => handleDelete(role.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </PermissionGuard>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Access Rights</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(role.permissions.map(p => p.module))).slice(0, 5).map(module => (
                  <span key={module} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                    {module}
                  </span>
                ))}
                {new Set(role.permissions.map(p => p.module)).size > 5 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                    +{new Set(role.permissions.map(p => p.module)).size - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border rounded-lg shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-xl font-semibold">
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Role Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="e.g. Warehouse Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Brief description of the role"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-medium mb-4">Permissions Matrix</h3>
                <div className="grid gap-6">
                  {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                    <div key={module} className="bg-muted/30 p-4 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-primary">{module}</h4>
                        <button
                          type="button"
                          onClick={() => toggleModule(module)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Toggle All
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {modulePermissions.map(perm => (
                          <label key={perm.id} className="flex items-start gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors">
                            <div className="relative flex items-center mt-0.5">
                              <input
                                type="checkbox"
                                className="peer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={formData.permissionIds.includes(perm.id)}
                                onChange={() => togglePermission(perm.id)}
                              />
                            </div>
                            <div className="text-sm">
                              <div className="font-medium text-foreground">{perm.name}</div>
                              <div className="text-muted-foreground text-xs">{perm.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border sticky bottom-0 bg-card">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium border border-input rounded-md hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {submitting ? 'Saving...' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
