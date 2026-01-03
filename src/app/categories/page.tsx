'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ApiError } from '@/lib/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { CategoryService } from '@/lib/services/categoryService'
import { ItemService } from '@/lib/services/itemService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SuccessMessage } from '@/components/ui/SuccessMessage'
import { formatDateDMY } from '@/lib/utils/date'

interface Category {
  id: string
  code?: string
  name: string
  description: string
  color: string
  createdAt: string
  itemCount?: number
}

export default function CategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCode, setEditCode] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCategories()
    }
  }, [status])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const [backendCategories, backendItems] = await Promise.all([
        CategoryService.getCategories(),
        ItemService.getItems(),
      ])

      const categoriesWithCounts = backendCategories.map(cat => {
        const itemCount = backendItems.filter(item => String((item as any).categoryId) === String(cat.id)).length
        return {
          id: String(cat.id),
          code: (cat as any).code,
          name: cat.name,
          description: cat.description,
          color: cat.color || '#3B82F6',
          createdAt: cat.createdAt,
          itemCount
        }
      })

      setCategories(categoriesWithCounts)
    } catch (err) {
      const apiError = err as ApiError
      console.error('Error fetching categories:', apiError)
      setError(apiError.message || 'Failed to fetch categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }
  
  const openEdit = (cat: Category) => {
    setEditCategory(cat)
    setEditName(cat.name)
    setEditDescription(cat.description || '')
    setEditCode(cat.code || '')
    setShowCreate(false)
  }
  
  const saveEdit = async () => {
    if (!editCategory) return
    if (!editCode.trim()) { setError('Category ID is required'); return }
    if (!editName.trim()) { setError('Name is required'); return }
    try {
      setCreating(true)
      setError(null)
      const updated = await CategoryService.updateCategory(Number(editCategory.id), { name: editName.trim(), description: editDescription.trim(), code: editCode.trim() })
      setSuccessMsg('Category updated successfully')
      setEditCategory(null)
      setEditName('')
      setEditDescription('')
      setEditCode('')
      await fetchCategories()
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to update category')
    } finally {
      setCreating(false)
    }
  }

  const handleCreate = async () => {
    try {
      setCreating(true)
      setError(null)
      setSuccessMsg(null)
      if (!code.trim()) {
        setError('Category ID is required')
        return
      }
      if (!name.trim()) {
        setError('Name is required')
        return
      }
      await CategoryService.createCategory({ name: name.trim(), description: description.trim(), code: code.trim() || undefined })
      setSuccessMsg('Category created successfully')
      setShowCreate(false)
      setName('')
      setDescription('')
      setCode('')
      await fetchCategories()
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to create category')
    } finally {
      setCreating(false)
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
        <div className="p-10 text-center">
          <p className="text-foreground font-medium">Please sign in to view categories.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <LoadingSpinner size="large" text="Loading categories..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Categories</h1>
              <p className="mt-2 text-base text-muted-foreground">Manage and browse inventory categories</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowCreate(true)} className="h-10 px-4">+ Create Category</Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={fetchCategories} />
          </div>
        )}

        {/* Create Form */}
        {showCreate && (
          <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">New Category</h3>
              <button className="text-muted-foreground hover:text-foreground" onClick={() => setShowCreate(false)}>Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category-code">Category ID</Label>
                <Input id="category-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Required unique code (e.g., CAT-ELC)" />
              </div>
              <div>
                <Label htmlFor="category-name">Name</Label>
                <Input id="category-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Electronics" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="category-description">Description</Label>
                <Input id="category-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Button onClick={handleCreate} disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)} disabled={creating}>Cancel</Button>
            </div>
          </div>
        )}
        
        {/* Edit Form */}
        {editCategory && (
          <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Edit Category</h3>
              <button className="text-muted-foreground hover:text-foreground" onClick={() => setEditCategory(null)}>Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category-code">Category ID</Label>
                <Input id="edit-category-code" value={editCode} onChange={(e) => setEditCode(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="edit-category-name">Name</Label>
                <Input id="edit-category-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="edit-category-description">Description</Label>
                <Input id="edit-category-description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Button onClick={saveEdit} disabled={creating}>{creating ? 'Saving...' : 'Save'}</Button>
              <Button variant="outline" onClick={() => setEditCategory(null)} disabled={creating}>Cancel</Button>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6">
            <SuccessMessage message={successMsg} onDismiss={() => setSuccessMsg(null)} autoHide />
          </div>
        )}

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <svg className="mx-auto h-12 w-12 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-base font-semibold text-foreground">No categories found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Categories will appear here once they are created.</p>
            <div className="mt-6">
              <Button onClick={() => setShowCreate(true)}>Create Category</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => router.push(`/categories/${category.id}`)}
                className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    {category.code ? (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">ID: {category.code}</span>
                    ) : null}
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {category.itemCount} items
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {category.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created {formatDateDMY(category.createdAt)}</span>
                  <span className="group-hover:text-primary transition-colors">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(category) }} className="rounded-md border border-border px-2 py-1 text-xs">Edit</button>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
