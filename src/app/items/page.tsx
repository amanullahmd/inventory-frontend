'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Item, ApiError } from '@/lib/types'
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

// Extended Item type with category details
interface ItemWithCategory extends Item {
  categoryId: string
  categoryName: string
}

// Fallback dummy data (only used if API fails)
const DUMMY_CATEGORIES: Category[] = [
  { id: '1', name: 'Laptops', description: 'Portable computers', color: 'from-blue-500 to-blue-600', createdAt: '2024-01-10' },
  { id: '2', name: 'Peripherals', description: 'Mice, keyboards, cables', color: 'from-purple-500 to-purple-600', createdAt: '2024-01-11' },
  { id: '3', name: 'Monitors', description: 'Display screens', color: 'from-green-500 to-green-600', createdAt: '2024-01-12' },
  { id: '4', name: 'Audio', description: 'Microphones and speakers', color: 'from-orange-500 to-orange-600', createdAt: '2024-01-13' },
  { id: '5', name: 'Accessories', description: 'Desk accessories and stands', color: 'from-pink-500 to-pink-600', createdAt: '2024-01-14' },
]

// Comprehensive dummy inventory data with category assignments
const DUMMY_ITEMS: ItemWithCategory[] = [
  { id: '1', name: 'MacBook Pro 16"', sku: 'MBP-16-001', unitCost: 2499.99, currentStock: 12, createdAt: '2024-01-15', categoryId: '1', categoryName: 'Laptops' },
  { id: '2', name: 'Dell XPS 13', sku: 'DXP-13-002', unitCost: 1299.99, currentStock: 28, createdAt: '2024-01-16', categoryId: '1', categoryName: 'Laptops' },
  { id: '3', name: 'HP Pavilion 15', sku: 'HPP-15-003', unitCost: 799.99, currentStock: 45, createdAt: '2024-01-17', categoryId: '1', categoryName: 'Laptops' },
  { id: '4', name: 'Lenovo ThinkPad', sku: 'LTP-X1-004', unitCost: 1199.99, currentStock: 18, createdAt: '2024-01-18', categoryId: '1', categoryName: 'Laptops' },
  { id: '5', name: 'ASUS VivoBook', sku: 'ASV-15-005', unitCost: 649.99, currentStock: 52, createdAt: '2024-01-19', categoryId: '1', categoryName: 'Laptops' },
  { id: '6', name: 'Logitech MX Master 3', sku: 'LGM-MX3-006', unitCost: 99.99, currentStock: 156, createdAt: '2024-01-20', categoryId: '2', categoryName: 'Peripherals' },
  { id: '7', name: 'Razer DeathAdder V3', sku: 'RZR-DA3-007', unitCost: 69.99, currentStock: 89, createdAt: '2024-01-21', categoryId: '2', categoryName: 'Peripherals' },
  { id: '8', name: 'SteelSeries Rival 600', sku: 'STS-R600-008', unitCost: 79.99, currentStock: 42, createdAt: '2024-01-22', categoryId: '2', categoryName: 'Peripherals' },
  { id: '9', name: 'USB-C Cable 2m', sku: 'USB-C2M-009', unitCost: 12.99, currentStock: 234, createdAt: '2024-01-23', categoryId: '2', categoryName: 'Peripherals' },
  { id: '10', name: 'HDMI 2.1 Cable', sku: 'HDMI-21-010', unitCost: 19.99, currentStock: 178, createdAt: '2024-01-24', categoryId: '2', categoryName: 'Peripherals' },
  { id: '11', name: 'DisplayPort Cable', sku: 'DP-14-011', unitCost: 24.99, currentStock: 95, createdAt: '2024-01-25', categoryId: '2', categoryName: 'Peripherals' },
  { id: '12', name: 'LG UltraWide 34"', sku: 'LG-UW34-012', unitCost: 799.99, currentStock: 8, createdAt: '2024-01-26', categoryId: '3', categoryName: 'Monitors' },
  { id: '13', name: 'Dell S3422DWG', sku: 'DLS-34-013', unitCost: 699.99, currentStock: 5, createdAt: '2024-01-27', categoryId: '3', categoryName: 'Monitors' },
  { id: '14', name: 'ASUS ProArt PA278QV', sku: 'ASP-PA27-014', unitCost: 549.99, currentStock: 0, createdAt: '2024-01-28', categoryId: '3', categoryName: 'Monitors' },
  { id: '15', name: 'BenQ EW2780U', sku: 'BNQ-EW27-015', unitCost: 449.99, currentStock: 12, createdAt: '2024-01-29', categoryId: '3', categoryName: 'Monitors' },
  { id: '16', name: 'Mechanical Keyboard RGB', sku: 'MKB-RGB-016', unitCost: 149.99, currentStock: 67, createdAt: '2024-01-30', categoryId: '2', categoryName: 'Peripherals' },
  { id: '17', name: 'Keychron K8 Pro', sku: 'KCH-K8P-017', unitCost: 129.99, currentStock: 43, createdAt: '2024-02-01', categoryId: '2', categoryName: 'Peripherals' },
  { id: '18', name: 'Corsair K95 Platinum', sku: 'COR-K95-018', unitCost: 199.99, currentStock: 21, createdAt: '2024-02-02', categoryId: '2', categoryName: 'Peripherals' },
  { id: '19', name: 'Logitech MX Keys', sku: 'LGM-MXK-019', unitCost: 99.99, currentStock: 78, createdAt: '2024-02-03', categoryId: '2', categoryName: 'Peripherals' },
  { id: '20', name: 'Webcam Logitech 4K', sku: 'LGW-4K-020', unitCost: 149.99, currentStock: 34, createdAt: '2024-02-04', categoryId: '4', categoryName: 'Audio' },
  { id: '21', name: 'Razer Kiyo Pro', sku: 'RZR-KP-021', unitCost: 199.99, currentStock: 19, createdAt: '2024-02-05', categoryId: '4', categoryName: 'Audio' },
  { id: '22', name: 'Elgato Facecam', sku: 'ELG-FC-022', unitCost: 179.99, currentStock: 26, createdAt: '2024-02-06', categoryId: '4', categoryName: 'Audio' },
  { id: '23', name: 'Blue Yeti Microphone', sku: 'BLU-YET-023', unitCost: 99.99, currentStock: 112, createdAt: '2024-02-07', categoryId: '4', categoryName: 'Audio' },
  { id: '24', name: 'Audio-Technica AT2020', sku: 'ATA-2020-024', unitCost: 99.00, currentStock: 45, createdAt: '2024-02-08', categoryId: '4', categoryName: 'Audio' },
  { id: '25', name: 'Shure SM7B', sku: 'SHR-SM7B-025', unitCost: 399.00, currentStock: 8, createdAt: '2024-02-09', categoryId: '4', categoryName: 'Audio' },
  { id: '26', name: 'Desk Lamp LED RGB', sku: 'DLM-RGB-026', unitCost: 59.99, currentStock: 89, createdAt: '2024-02-10', categoryId: '5', categoryName: 'Accessories' },
  { id: '27', name: 'Monitor Arm Dual', sku: 'MNA-DUL-027', unitCost: 79.99, currentStock: 56, createdAt: '2024-02-11', categoryId: '5', categoryName: 'Accessories' },
  { id: '28', name: 'Laptop Stand Aluminum', sku: 'LPS-ALU-028', unitCost: 49.99, currentStock: 134, createdAt: '2024-02-12', categoryId: '5', categoryName: 'Accessories' },
  { id: '29', name: 'Phone Stand Premium', sku: 'PHS-PRM-029', unitCost: 29.99, currentStock: 267, createdAt: '2024-02-13', categoryId: '5', categoryName: 'Accessories' },
  { id: '30', name: 'Desk Pad XL', sku: 'DSP-XL-030', unitCost: 39.99, currentStock: 178, createdAt: '2024-02-14', categoryId: '5', categoryName: 'Accessories' },
]

export default function ItemsPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<ItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingCategory, setSubmittingCategory] = useState(false)
  const [submittingItem, setSubmittingItem] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' })
  const [showItemForm, setShowItemForm] = useState(false)
  const [itemForm, setItemForm] = useState({ 
    name: '', 
    sku: '', 
    unitCost: '', 
    categoryId: '',
    description: '',
    minimumStock: '',
    maximumStock: '',
    reorderLevel: ''
  })

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch categories from backend API first
      const backendCategories = await CategoryService.getCategories()
      
      // Fetch items from backend API
      const backendItems = await ItemService.getItems()

      // Map backend items to frontend format
      const mappedItems: ItemWithCategory[] = backendItems.map((item, idx) => {
        const category = backendCategories[idx % backendCategories.length]
        return {
          ...item,
          categoryId: String(category.id),
          categoryName: category.name,
        }
      })
      
      setItems(mappedItems)
      setCategories(backendCategories.map(cat => ({
        id: String(cat.id),
        name: cat.name,
        description: cat.description,
        color: cat.color,
        createdAt: cat.createdAt
      })))
      setLoading(false)
    } catch (err) {
      const apiError = err as ApiError
      console.error('Error in fetchItems:', apiError)
      setError(apiError.message || 'Failed to fetch items')
      setItems([])
      setCategories([])
      setLoading(false)
    }
  }, [])

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (submittingCategory) {
      return
    }

    if (!categoryForm.name || !categoryForm.description) {
      setError('Please fill in all fields')
      return
    }

    if (categories.some(c => c.name.toLowerCase() === categoryForm.name.toLowerCase())) {
      setError('Category already exists')
      return
    }

    try {
      setError(null)
      setSuccess(null)
      setSubmittingCategory(true)
      // Call backend API to create category
      const newCategory = await CategoryService.createCategory({
        name: categoryForm.name,
        description: categoryForm.description
      })

      // Convert backend response to frontend format
      const categoryForDisplay: Category = {
        id: String(newCategory.id),
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color || '#3B82F6',
        createdAt: newCategory.createdAt
      }

      setCategories(prev => [categoryForDisplay, ...prev])
      setSuccess(`Category "${categoryForm.name}" created successfully!`)
      setCategoryForm({ name: '', description: '' })
      setShowCategoryForm(false)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to create category')
    } finally {
      setSubmittingCategory(false)
    }
  }

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (submittingItem) {
      return
    }

    if (!itemForm.name || !itemForm.sku || !itemForm.unitCost) {
      setError('Please fill in all required fields')
      return
    }

    // Check if SKU already exists
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
        unitCost: parseFloat(itemForm.unitCost),
        ...(itemForm.categoryId && { categoryId: parseInt(itemForm.categoryId) }),
        ...(itemForm.description && { description: itemForm.description }),
        ...(itemForm.minimumStock && { minimumStock: parseInt(itemForm.minimumStock) }),
        ...(itemForm.maximumStock && { maximumStock: parseInt(itemForm.maximumStock) }),
        ...(itemForm.reorderLevel && { reorderLevel: parseInt(itemForm.reorderLevel) })
      })

      const categoryName = itemForm.categoryId 
        ? categories.find(c => c.id === itemForm.categoryId)?.name 
        : 'Uncategorized'

      const newItemWithCategory: ItemWithCategory = {
        ...newItem,
        categoryId: itemForm.categoryId || '0',
        categoryName: categoryName || 'Uncategorized',
      }

      setItems(prev => [newItemWithCategory, ...prev])
      setSuccess(`Item "${itemForm.name}" created successfully!`)
      setItemForm({ name: '', sku: '', unitCost: '', categoryId: '', description: '', minimumStock: '', maximumStock: '', reorderLevel: '' })
      setShowItemForm(false)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to create item')
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
      fetchItems()
    }
  }, [status, fetchItems])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

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
              <button
                type="button"
                onClick={() => {
                  setError(null)
                  setSuccess(null)
                  setShowCategoryForm(false)
                  setShowItemForm(true)
                }}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Item
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null)
                  setSuccess(null)
                  setShowItemForm(false)
                  setShowCategoryForm(true)
                }}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-accent transition-colors"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Category
              </button>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Items Table */}
          <div className="lg:col-span-8">
            <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">Items</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{filteredItems.length} items shown</p>
                  </div>
                  {selectedCategory ? (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(null)}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear filter
                    </button>
                  ) : null}
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
                  <button
                    type="button"
                    onClick={() => {
                      setError(null)
                      setSuccess(null)
                      setShowCategoryForm(false)
                      setShowItemForm(true)
                    }}
                    className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                  >
                    Create item
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Item Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Unit Price</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">{item.name}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{item.categoryName}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-md bg-muted/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground">{item.sku}</span>
                          </td>
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

          {/* Categories Sidebar */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">Categories</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{categories.length} total</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null)
                      setSuccess(null)
                      setShowItemForm(false)
                      setShowCategoryForm(true)
                    }}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                  >
                    Add
                  </button>
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
                        onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                          selectedCategory === category.id
                            ? 'border-primary bg-primary text-primary-foreground shadow-md'
                            : 'border-border bg-background text-muted-foreground hover:bg-accent hover:border-primary/50'
                        }`}
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

        {success ? (
          <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
            <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />
          </div>
        ) : null}

        {error ? (
          <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
            <ErrorMessage message={error} onRetry={() => setError(null)} />
          </div>
        ) : null}

        {showItemForm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
            <div className="relative z-50 w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-5">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">Create New Item</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Add a new item to your inventory</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (submittingItem) return
                    setShowItemForm(false)
                  }}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-accent transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreateItem} className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-base font-semibold text-foreground">Item Name *</label>
                    <input
                      type="text"
                      value={itemForm.name}
                      onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="e.g., Dell Monitor 27 inch"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-foreground">SKU *</label>
                    <input
                      type="text"
                      value={itemForm.sku}
                      onChange={(e) => setItemForm({...itemForm, sku: e.target.value})}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="e.g., DELL-27-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-foreground">Description</label>
                  <textarea
                    rows={3}
                    value={itemForm.description}
                    onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="Optional: Item details, specifications, etc."
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-base font-semibold text-foreground">Unit Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={itemForm.unitCost}
                      onChange={(e) => setItemForm({...itemForm, unitCost: e.target.value})}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-foreground">Category</label>
                    <select
                      value={itemForm.categoryId}
                      onChange={(e) => {
                        setItemForm(prev => ({...prev, categoryId: e.target.value}))
                      }}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-base font-semibold text-foreground">Minimum Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={itemForm.minimumStock}
                      onChange={(e) => setItemForm({...itemForm, minimumStock: e.target.value})}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-foreground">Maximum Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={itemForm.maximumStock}
                      onChange={(e) => setItemForm({...itemForm, maximumStock: e.target.value})}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-foreground">Reorder Level</label>
                    <input
                      type="number"
                      min="0"
                      value={itemForm.reorderLevel}
                      onChange={(e) => setItemForm({...itemForm, reorderLevel: e.target.value})}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (submittingItem) return
                      setShowItemForm(false)
                    }}
                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingItem}
                    className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 disabled:opacity-60 transition-all"
                  >
                    {submittingItem ? 'Creating…' : 'Create Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCategoryForm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
            <div className="relative z-50 w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-5">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">Create New Category</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Organize items for faster filtering</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (submittingCategory) return
                    setShowCategoryForm(false)
                  }}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-accent transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreateCategory} className="space-y-6 p-6">
                <div>
                  <label className="block text-base font-semibold text-foreground">Category Name *</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="e.g., Electronics"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-foreground">Description</label>
                  <textarea
                    rows={4}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="Optional: Describe what items belong in this category"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (submittingCategory) return
                      setShowCategoryForm(false)
                    }}
                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCategory}
                    className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 disabled:opacity-60 transition-all"
                  >
                    {submittingCategory ? 'Creating…' : 'Create Category'}
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