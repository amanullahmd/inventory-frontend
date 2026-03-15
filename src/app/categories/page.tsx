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
import { PDFExportService } from '@/lib/services/pdfExportService'
import { ExportButton } from '@/components/ui/ExportButton'

interface Category {
  id: string
  code?: string
  name: string
  description: string
  color: string
  createdAt: string
  itemCount?: number
}

interface ItemForCategory {
  id: string
  name: string
  sku: string
  categoryId: string
}

export default function CategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [allItems, setAllItems] = useState<ItemForCategory[]>([])
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
  // Assign items modal
  const [assignCategory, setAssignCategory] = useState<Category | null>(null)
  const [assignSearch, setAssignSearch] = useState('')
  const [assignSaving, setAssignSaving] = useState(false)

  const handleExportPDF = async () => {
    try {
      await PDFExportService.generateCategoryPDF(categories, {
        filename: `categories_${new Date().toISOString().split('T')[0]}.pdf`,
        title: 'Inventory Categories Report',
        timestamp: new Date(),
      })
    } catch (err) {
      console.error('Export failed:', err)
      setError('Failed to export PDF')
    }
  }

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

      const mappedItems: ItemForCategory[] = (backendItems as any[]).map((item: any) => ({
        id: String(item.id),
        name: item.name,
        sku: item.sku,
        categoryId: String(item.categoryId || ''),
      }))
      setAllItems(mappedItems)

      const categoriesWithCounts = backendCategories.map(cat => {
        const itemCount = mappedItems.filter(item => item.categoryId === String(cat.id)).length
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

  const handleAssignItem = async (itemId: string, categoryId: string) => {
    setAssignSaving(true)
    try {
      await ItemService.updateItem(parseInt(itemId), { categoryId: parseInt(categoryId) } as any)
      setAllItems(prev => prev.map(it => it.id === itemId ? { ...it, categoryId } : it))
      setCategories(prev => prev.map(cat => {
        if (cat.id === categoryId) return { ...cat, itemCount: (cat.itemCount || 0) + 1 }
        const oldCount = allItems.filter(it => it.id !== itemId && it.categoryId === cat.id).length
        return { ...cat, itemCount: oldCount }
      }))
      setSuccessMsg('Item assigned to category successfully')
    } catch (err: any) {
      setError(err.message || 'Failed to assign item')
    } finally {
      setAssignSaving(false)
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
      <div className="min-h-screen bg-transparent text-foreground">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <LoadingSpinner size="large" text="Loading categories..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-slide-down">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Categories</h1>
              <p className="mt-2 text-muted-foreground">Manage and browse inventory categories</p>
            </div>
            <div className="flex items-center gap-3">
              <ExportButton
                onClick={handleExportPDF}
                label="Export PDF"
              />
              <Button onClick={() => setShowCreate(true)} className="h-10 px-4 rounded-xl shadow-md hover:shadow-lg transition-all">+ Create Category</Button>
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
          <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm animate-slide-up">
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
          <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm animate-slide-up">
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

        {/* Assign Items Modal */}
        {assignCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setAssignCategory(null); setAssignSearch('') }} />
            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Assign Items to "{assignCategory.name}"</h3>
                <button onClick={() => { setAssignCategory(null); setAssignSearch('') }} className="rounded-full p-2 hover:bg-muted">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Search items..."
                value={assignSearch}
                onChange={e => setAssignSearch(e.target.value)}
                className="w-full mb-4 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
              <div className="max-h-80 overflow-y-auto space-y-2">
                {allItems
                  .filter(it => it.categoryId !== assignCategory.id)
                  .filter(it => !assignSearch || it.name.toLowerCase().includes(assignSearch.toLowerCase()) || it.sku.toLowerCase().includes(assignSearch.toLowerCase()))
                  .map(it => (
                    <div key={it.id} className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2">
                      <div>
                        <span className="text-sm font-medium text-foreground">{it.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({it.sku})</span>
                        {it.categoryId ? <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">→ reassign</span> : null}
                      </div>
                      <button
                        onClick={() => handleAssignItem(it.id, assignCategory.id)}
                        disabled={assignSaving}
                        className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                {allItems.filter(it => it.categoryId !== assignCategory.id).length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4">All items are already in this category</p>
                )}
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground font-medium mb-2">Items already in this category ({allItems.filter(it => it.categoryId === assignCategory.id).length}):</p>
                <div className="flex flex-wrap gap-2">
                  {allItems.filter(it => it.categoryId === assignCategory.id).map(it => (
                    <span key={it.id} className="inline-flex items-center rounded-full bg-primary/20 px-2 py-1 text-xs text-foreground">
                      {it.name}
                    </span>
                  ))}
                  {allItems.filter(it => it.categoryId === assignCategory.id).length === 0 && (
                    <span className="text-xs text-muted-foreground italic">No items assigned yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm animate-slide-up">
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-slide-up">
            {categories.map((category, index) => {
              const categoryItems = allItems.filter(it => it.categoryId === category.id)
              return (
                <div
                  key={category.id || `category-${index}`}
                  className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all group"
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => router.push(`/categories/${category.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {category.code ? (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">ID: {category.code}</span>
                        ) : null}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${categoryItems.length > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                          {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-foreground mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {category.description || 'No description available'}
                    </p>

                    {/* Items under category */}
                    {categoryItems.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {categoryItems.slice(0, 3).map(it => (
                            <span key={it.id} className="inline-flex items-center rounded-full bg-muted/70 px-2 py-0.5 text-[10px] text-foreground">
                              {it.name}
                            </span>
                          ))}
                          {categoryItems.length > 3 && (
                            <span className="text-[10px] text-muted-foreground italic">+{categoryItems.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    {categoryItems.length === 0 && (
                      <p className="text-[11px] italic text-muted-foreground mb-3">No items assigned yet. Use "Assign Items" below.</p>
                    )}

                    <div className="text-xs text-muted-foreground">Created {formatDateDMY(category.createdAt)}</div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-border px-4 py-2.5 bg-muted/20">
                    <button
                      onClick={(e) => { e.stopPropagation(); setAssignCategory(category); setAssignSearch('') }}
                      className="flex-1 rounded-md bg-primary/10 text-primary-foreground px-2 py-1 text-xs font-medium hover:bg-primary/20 transition-colors"
                    >
                      + Assign Items
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(category) }}
                      className="rounded-md border border-border px-2 py-1 text-xs text-foreground hover:bg-muted"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/categories/${category.id}`) }}
                      className="rounded-md border border-border px-2 py-1 text-xs text-foreground hover:bg-muted"
                    >
                      View
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
