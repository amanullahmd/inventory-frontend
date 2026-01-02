'use client'

import { useState, useEffect } from 'react'
import { formatDateDMY } from '@/lib/utils/date'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Item, ApiError } from '@/lib/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
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

export default function CategoryDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const categoryId = params?.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [items, setItems] = useState<ItemWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'authenticated' && categoryId) {
      fetchCategoryData()
    }
  }, [status, categoryId])

  const fetchCategoryData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [backendCategories, backendItems] = await Promise.all([
        CategoryService.getCategories(),
        ItemService.getItems(),
      ])

      const foundCategory = backendCategories.find(c => String(c.id) === categoryId)
      if (!foundCategory) {
        setError('Category not found')
        setLoading(false)
        return
      }

      const categoryData: Category = {
        id: String(foundCategory.id),
        name: foundCategory.name,
        description: foundCategory.description,
        color: foundCategory.color || '#3B82F6',
        createdAt: foundCategory.createdAt
      }

      const categoryItems = backendItems
        .filter(item => String((item as any).categoryId) === categoryId)
        .map(item => ({
          ...item,
          categoryId: String((item as any).categoryId || ''),
          categoryName: foundCategory.name,
        }))

      setCategory(categoryData)
      setItems(categoryItems)
    } catch (err) {
      const apiError = err as ApiError
      console.error('Error fetching category data:', apiError)
      setError(apiError.message || 'Failed to fetch category data')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
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
          <p className="text-foreground font-medium">Please sign in to view categories.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <LoadingSpinner size="large" text="Loading category..." />
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <ErrorMessage 
            message={error || 'Category not found'} 
            onRetry={() => router.push('/items')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => router.push('/items')}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
                >
                  ← Back to Items
                </button>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">{category.name}</h1>
              <p className="mt-2 text-base text-muted-foreground">{category.description || 'No description available'}</p>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-muted-foreground">Created {formatDateDMY(category.createdAt)}</span>
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
              placeholder={`Search items in ${category.name}...`}
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
                <p className="text-sm font-medium text-muted-foreground">Items in Category</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="mt-2 text-3xl font-bold text-foreground">${totalValue.toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-chart-1/10 p-3">
                <svg className="h-6 w-6 text-chart-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0H8m4 0h4M6.343 3.665c.886-.887 2.318-.887 3.203 0l9.759 9.759c.886.886.886 2.318 0 3.203l-9.759 9.759c-.886.886-2.317.886-3.203 0L3.14 16.168c-.886-.886-.886-2.317 0-3.203L6.343 3.665z" />
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

        {/* Items Table */}
        <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Items in {category.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{filteredItems.length} items shown</p>
            </div>
          </div>
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M8 7v10m8-10v10" />
              </svg>
              <h3 className="mt-4 text-base font-semibold text-foreground">No items found</h3>
              <p className="mt-2 text-sm text-muted-foreground">This category doesn't have any items yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Unit</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-md bg-muted/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground">{item.sku}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{item.unit || '-'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">${item.unitCost.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          item.currentStock === 0
                            ? 'border-destructive/30 bg-destructive/10 text-destructive'
                            : item.currentStock < 10
                            ? 'border-chart-3/30 bg-chart-3/10 text-chart-3'
                            : 'border-chart-2/30 bg-chart-2/10 text-chart-2'
                        }`}>
                          {item.currentStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">${(item.currentStock * item.unitCost).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
