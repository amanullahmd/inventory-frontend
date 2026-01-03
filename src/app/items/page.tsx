'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Item, ApiError } from '@/lib/types'
import { usePermissions } from '@/hooks/usePermissions'
import PermissionGuard from '@/components/PermissionGuard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import { ExportButton } from '@/components/ui/ExportButton'
import { PDFExportService } from '@/lib/services/pdfExportService'
import { DateFilterService } from '@/lib/services/dateFilterService'
import { ItemService } from '@/lib/services/itemService'
import { CategoryService } from '@/lib/services/categoryService'

interface Category {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
}

interface ItemWithCategory extends Item {
  categoryId: string
  categoryName: string
  unit?: string
  createdBy?: string
  createdAt: string
  updatedAt?: string | null
}

export default function ItemsPage() {
  const { data: session, status } = useSession()
  const { can } = usePermissions()
  const router = useRouter()
  
  const [items, setItems] = useState<ItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingItem, setSubmittingItem] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showItemForm, setShowItemForm] = useState(false)
  const [itemForm, setItemForm] = useState({
    name: '',
    sku: '',
    categoryId: '',
    description: '',
    minimumStock: '',
    maximumStock: '',
  })
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    sku: '',
    categoryId: '',
    description: '',
    minimumStock: '',
    maximumStock: '',
  })
  const [exportLoading, setExportLoading] = useState(false)
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [backendCategories, backendItems] = await Promise.all([
        CategoryService.getCategories(),
        ItemService.getItems(),
      ])

      const mappedItems: ItemWithCategory[] = (backendItems as any).map((item: any) => ({
        ...item,
        categoryId: String(item.categoryId || ''),
        categoryName: item.categoryName || 'Uncategorized',
      }))

      setItems(mappedItems)
      setCategories(backendCategories.map(cat => ({
        id: String(cat.id),
        name: cat.name,
        description: cat.description,
        color: cat.color || '#3B82F6',
        createdAt: cat.createdAt
      })))
    } catch (err) {
      const apiError = err as ApiError
      console.error('Error fetching data:', apiError)
      setError(apiError.message || 'Failed to fetch data')
      setItems([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshCategories = async () => {
    try {
      const backendCategories = await CategoryService.getCategories()
      setCategories(backendCategories.map(cat => ({
        id: String(cat.id),
        name: cat.name,
        description: cat.description,
        color: cat.color || '#3B82F6',
        createdAt: cat.createdAt
      })))
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to fetch categories')
    }
  }

  const handleCreateInlineCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!can('create_category')) {
      setError('You do not have permission to create categories')
      return
    }
    
    if (!newCategoryName.trim()) {
      setError('Category name is required')
      return
    }
    try {
      setSubmittingItem(true)
      const created = await CategoryService.createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
      })
      const createdMapped: Category = {
        id: String(created.id),
        name: created.name,
        description: created.description,
        color: created.color || '#3B82F6',
        createdAt: created.createdAt
      }
      setCategories(prev => [createdMapped, ...prev])
      setItemForm(prev => ({ ...prev, categoryId: String(createdMapped.id) }))
      setCreatingCategory(false)
      setNewCategoryName('')
      setNewCategoryDescription('')
      setSuccess(`Category "${created.name}" created`)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to create category')
    } finally {
      setSubmittingItem(false)
    }
  }

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!can('create_item')) {
      setError('You do not have permission to create items')
      return
    }

    if (!itemForm.name || !itemForm.sku || !itemForm.categoryId) {
      setError('Please fill in all required fields')
      return
    }

    if (items.some(i => i.sku.toLowerCase() === itemForm.sku.toLowerCase())) {
      setError('Item with this SKU already exists')
      return
    }

    try {
      setError(null)
      setSuccess(null)
      setSubmittingItem(true)

      const newItem = await ItemService.createItem({
        name: itemForm.name,
        sku: itemForm.sku,
        categoryId: parseInt(itemForm.categoryId),
        description: itemForm.description || undefined,
        minimumStock: itemForm.minimumStock ? parseInt(itemForm.minimumStock) : undefined,
        maximumStock: itemForm.maximumStock ? parseInt(itemForm.maximumStock) : undefined,
      })

      const categoryName = categories.find(c => c.id === itemForm.categoryId)?.name || 'Uncategorized'

      const newItemWithCategory: ItemWithCategory = {
        ...newItem,
        categoryId: itemForm.categoryId,
        categoryName,
      }

      setItems(prev => [newItemWithCategory, ...prev])
      setSuccess(`Item "${itemForm.name}" created successfully!`)
      setItemForm({
        name: '',
        sku: '',
        categoryId: '',
        description: '',
        minimumStock: '',
        maximumStock: '',
      })
      setShowItemForm(false)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to create item')
    } finally {
      setSubmittingItem(false)
    }
  }

  const openEdit = (item: ItemWithCategory) => {
    setError(null)
    setSuccess(null)
    setEditingItemId(item.id)
    setEditForm({
      name: item.name,
      sku: item.sku,
      categoryId: String(item.categoryId || ''),
      description: '',
      minimumStock: '',
      maximumStock: '',
    })
    setShowEditForm(true)
  }

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!can('create_item')) {
      setError('You do not have permission to edit items')
      return
    }

    if (!editingItemId) return

    if (!editForm.name || !editForm.sku || !editForm.categoryId) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSubmittingItem(true)
      const updated = await ItemService.updateItem(parseInt(editingItemId), {
        name: editForm.name,
        sku: editForm.sku,
        categoryId: parseInt(editForm.categoryId),
        description: editForm.description || undefined,
        minimumStock: editForm.minimumStock ? parseInt(editForm.minimumStock) : undefined,
        maximumStock: editForm.maximumStock ? parseInt(editForm.maximumStock) : undefined,
      } as any)

      const categoryName = categories.find(c => c.id === editForm.categoryId)?.name || 'Uncategorized'

      const updatedWithCategory: ItemWithCategory = {
        ...updated,
        categoryId: editForm.categoryId,
        categoryName,
      }

      setItems(prev => prev.map(i => i.id === editingItemId ? { ...i, ...updatedWithCategory } : i))
      setSuccess(`Item "${editForm.name}" updated successfully!`)
      setShowEditForm(false)
      setEditingItemId(null)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to update item')
    } finally {
      setSubmittingItem(false)
    }
  }

  const handleExportInventory = async () => {
    setExportLoading(true)
    try {
      if (items.length === 0) {
        setError('No items to export')
        setExportLoading(false)
        return
      }

      const filename = `inventory-${DateFilterService.formatDateForFilename(new Date())}.pdf`
      PDFExportService.generateInventoryPDF(items, categories, {
        filename,
        title: 'Inventory Snapshot',
        timestamp: new Date(),
      })

      setSuccess(`Successfully exported ${items.length} items`)
    } catch (err) {
      setError('Failed to generate PDF. Please try again.')
      console.error('Export error:', err)
    } finally {
      setExportLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData()
    }
  }, [status, fetchData])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const lowStockItems = items.filter(item => item.currentStock < 10).length
  const outOfStockItems = items.filter(item => item.currentStock === 0).length

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
          <p className="text-foreground font-medium">Please sign in to view items.</p>
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
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Inventory Management</h1>
              <p className="mt-2 text-base text-muted-foreground">Track items, stock levels, and manage categories</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <ExportButton onClick={handleExportInventory} loading={exportLoading} exportType="inventory" label="Export" />
              <PermissionGuard permission="create_item">
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setSuccess(null)
                    setShowItemForm(true)
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Item
                </button>
              </PermissionGuard>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <svg className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search items by name or SKU…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{items.length}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M8 7v10m8-10v10" />
                </svg>
              </div>
            </div>
          </div>

          

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="mt-2 text-3xl font-bold text-chart-3">{lowStockItems}</p>
              </div>
              <div className="rounded-lg bg-chart-3/10 p-3">
                <svg className="h-6 w-6 text-chart-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M6.343 3.665c.886-.887 2.318-.887 3.203 0l9.759 9.759c.886.886.886 2.318 0 3.203l-9.759 9.759c-.886.886-2.317.886-3.203 0L3.14 16.168c-.886-.886-.886-2.317 0-3.203L6.343 3.665z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="mt-2 text-3xl font-bold text-destructive">{outOfStockItems}</p>
              </div>
              <div className="rounded-lg bg-destructive/10 p-3">
                <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v2m0 0H8m4 0h4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
            <SuccessMessage
              message={success}
              onDismiss={() => setSuccess(null)}
              autoHide
            />
          </div>
        )}
        {error && (
          <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
            <ErrorMessage
              message={error}
              onRetry={() => setError(null)}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Items Table */}
          <div className="lg:col-span-8">
            <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-6 py-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Items</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{filteredItems.length} items shown</p>
                </div>
              </div>
              {loading ? (
                <div className="p-12">
                  <LoadingSpinner size="medium" text="Loading items..." />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M8 7v10m8-10v10" />
                  </svg>
                  <h3 className="mt-4 text-base font-semibold text-foreground">No items found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or create a new item.</p>
                  <PermissionGuard permission="create_item">
                    <button
                      type="button"
                      onClick={() => {
                        setError(null)
                        setSuccess(null)
                        setShowItemForm(true)
                      }}
                      className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                    >
                      Create item
                    </button>
                  </PermissionGuard>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Item Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">SKU</th>
                        
                        
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">{item.name}</td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            <button
                              type="button"
                              onClick={() => router.push(`/categories/${item.categoryId}`)}
                              className="text-primary hover:text-primary/80 hover:underline transition-colors"
                            >
                              {item.categoryName}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-md bg-muted/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground">{item.sku}</span>
                          </td>
                          
                          
                          <td className="px-6 py-4 text-sm">
                            <PermissionGuard permission="create_item">
                              <button
                                type="button"
                                onClick={() => openEdit(item)}
                                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-accent"
                              >
                                Edit
                              </button>
                            </PermissionGuard>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Categories Sidebar */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-6 py-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Categories</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{categories.length} total</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {categories.length === 0 ? (
                    <p className="w-full text-center text-sm text-muted-foreground py-4">No categories yet</p>
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => router.push(`/categories/${category.id}`)}
                        className="rounded-full border border-border bg-background text-muted-foreground hover:bg-accent hover:border-primary/50 px-4 py-2 text-sm font-semibold transition-all"
                      >
                        {category.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Item Form Modal */}
        {showItemForm && can('create_item') && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <button
              aria-label="Close"
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowItemForm(false)}
            />
            <div className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-lg">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Create Item</h3>
                  <p className="mt-2 text-base text-muted-foreground">Add a new item to your inventory</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowItemForm(false)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-base text-foreground hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Item Name *</label>
                    <input
                      type="text"
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      placeholder="Enter item name"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">SKU *</label>
                    <input
                      type="text"
                      value={itemForm.sku}
                      onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })}
                      placeholder="Enter SKU"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <div className="flex gap-2">
                      <select
                        value={itemForm.categoryId}
                        onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={refreshCategories}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-accent"
                        aria-label="Refresh categories"
                      >
                        ↻
                      </button>
                      <PermissionGuard permission="create_category">
                        <button
                          type="button"
                          onClick={() => setCreatingCategory((v) => !v)}
                          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-accent"
                        >
                          Add
                        </button>
                      </PermissionGuard>
                    </div>
                    {creatingCategory && (
                      <form onSubmit={handleCreateInlineCategory} className="mt-2 space-y-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="New category name"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        />
                        <input
                          type="text"
                          value={newCategoryDescription}
                          onChange={(e) => setNewCategoryDescription(e.target.value)}
                          placeholder="Description (optional)"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={submittingItem}
                            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                          >
                            {submittingItem ? 'Creating…' : 'Create'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setCreatingCategory(false); setNewCategoryName(''); setNewCategoryDescription('') }}
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  

                  <div>
                    <label className="block text-sm font-medium mb-2">Min Stock Level</label>
                    <input
                      type="number"
                      value={itemForm.minimumStock}
                      onChange={(e) => setItemForm({ ...itemForm, minimumStock: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Stock Level</label>
                    <input
                      type="number"
                      value={itemForm.maximumStock}
                      onChange={(e) => setItemForm({ ...itemForm, maximumStock: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    placeholder="Enter item description"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowItemForm(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-3 text-base font-semibold text-foreground shadow-sm hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingItem}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {submittingItem ? 'Creating...' : 'Create Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Item Form Modal */}
        {showEditForm && can('create_item') && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <button
              aria-label="Close"
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowEditForm(false)}
            />
            <div className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-lg">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Edit Item</h3>
                  <p className="mt-2 text-base text-muted-foreground">Correct item details</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-base text-foreground hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleUpdateItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Item Name *</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">SKU *</label>
                    <input
                      type="text"
                      value={editForm.sku}
                      onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={editForm.categoryId}
                      onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  

                  
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-3 text-base font-semibold text-foreground shadow-sm hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingItem}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {submittingItem ? 'Updating...' : 'Update Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
