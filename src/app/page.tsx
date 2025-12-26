'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Dummy inventory data (same as items page)
const DUMMY_ITEMS = [
  { id: '1', name: 'MacBook Pro 16"', sku: 'MBP-16-001', unitCost: 2499.99, currentStock: 12, categoryId: '1', categoryName: 'Laptops' },
  { id: '2', name: 'Dell XPS 13', sku: 'DXP-13-002', unitCost: 1299.99, currentStock: 28, categoryId: '1', categoryName: 'Laptops' },
  { id: '3', name: 'HP Pavilion 15', sku: 'HPP-15-003', unitCost: 799.99, currentStock: 45, categoryId: '1', categoryName: 'Laptops' },
  { id: '4', name: 'Lenovo ThinkPad', sku: 'LTP-X1-004', unitCost: 1199.99, currentStock: 18, categoryId: '1', categoryName: 'Laptops' },
  { id: '5', name: 'ASUS VivoBook', sku: 'ASV-15-005', unitCost: 649.99, currentStock: 52, categoryId: '1', categoryName: 'Laptops' },
  { id: '6', name: 'Logitech MX Master 3', sku: 'LGM-MX3-006', unitCost: 99.99, currentStock: 156, categoryId: '2', categoryName: 'Peripherals' },
  { id: '7', name: 'Razer DeathAdder V3', sku: 'RZR-DA3-007', unitCost: 69.99, currentStock: 89, categoryId: '2', categoryName: 'Peripherals' },
  { id: '8', name: 'SteelSeries Rival 600', sku: 'STS-R600-008', unitCost: 79.99, currentStock: 42, categoryId: '2', categoryName: 'Peripherals' },
  { id: '9', name: 'USB-C Cable 2m', sku: 'USB-C2M-009', unitCost: 12.99, currentStock: 234, categoryId: '2', categoryName: 'Peripherals' },
  { id: '10', name: 'HDMI 2.1 Cable', sku: 'HDMI-21-010', unitCost: 19.99, currentStock: 178, categoryId: '2', categoryName: 'Peripherals' },
  { id: '11', name: 'DisplayPort Cable', sku: 'DP-14-011', unitCost: 24.99, currentStock: 95, categoryId: '2', categoryName: 'Peripherals' },
  { id: '12', name: 'LG UltraWide 34"', sku: 'LG-UW34-012', unitCost: 799.99, currentStock: 8, categoryId: '3', categoryName: 'Monitors' },
  { id: '13', name: 'Dell S3422DWG', sku: 'DLS-34-013', unitCost: 699.99, currentStock: 5, categoryId: '3', categoryName: 'Monitors' },
  { id: '14', name: 'ASUS ProArt PA278QV', sku: 'ASP-PA27-014', unitCost: 549.99, currentStock: 0, categoryId: '3', categoryName: 'Monitors' },
  { id: '15', name: 'BenQ EW2780U', sku: 'BNQ-EW27-015', unitCost: 449.99, currentStock: 12, categoryId: '3', categoryName: 'Monitors' },
  { id: '16', name: 'Mechanical Keyboard RGB', sku: 'MKB-RGB-016', unitCost: 149.99, currentStock: 67, categoryId: '2', categoryName: 'Peripherals' },
  { id: '17', name: 'Keychron K8 Pro', sku: 'KCH-K8P-017', unitCost: 129.99, currentStock: 43, categoryId: '2', categoryName: 'Peripherals' },
  { id: '18', name: 'Corsair K95 Platinum', sku: 'COR-K95-018', unitCost: 199.99, currentStock: 21, categoryId: '2', categoryName: 'Peripherals' },
  { id: '19', name: 'Logitech MX Keys', sku: 'LGM-MXK-019', unitCost: 99.99, currentStock: 78, categoryId: '2', categoryName: 'Peripherals' },
  { id: '20', name: 'Webcam Logitech 4K', sku: 'LGW-4K-020', unitCost: 149.99, currentStock: 34, categoryId: '4', categoryName: 'Audio' },
  { id: '21', name: 'Razer Kiyo Pro', sku: 'RZR-KP-021', unitCost: 199.99, currentStock: 19, categoryId: '4', categoryName: 'Audio' },
  { id: '22', name: 'Elgato Facecam', sku: 'ELG-FC-022', unitCost: 179.99, currentStock: 26, categoryId: '4', categoryName: 'Audio' },
  { id: '23', name: 'Blue Yeti Microphone', sku: 'BLU-YET-023', unitCost: 99.99, currentStock: 112, categoryId: '4', categoryName: 'Audio' },
  { id: '24', name: 'Audio-Technica AT2020', sku: 'ATA-2020-024', unitCost: 99.00, currentStock: 45, categoryId: '4', categoryName: 'Audio' },
  { id: '25', name: 'Shure SM7B', sku: 'SHR-SM7B-025', unitCost: 399.00, currentStock: 8, categoryId: '4', categoryName: 'Audio' },
  { id: '26', name: 'Desk Lamp LED RGB', sku: 'DLM-RGB-026', unitCost: 59.99, currentStock: 89, categoryId: '5', categoryName: 'Accessories' },
  { id: '27', name: 'Monitor Arm Dual', sku: 'MNA-DUL-027', unitCost: 79.99, currentStock: 56, categoryId: '5', categoryName: 'Accessories' },
  { id: '28', name: 'Laptop Stand Aluminum', sku: 'LPS-ALU-028', unitCost: 49.99, currentStock: 134, categoryId: '5', categoryName: 'Accessories' },
  { id: '29', name: 'Phone Stand Premium', sku: 'PHS-PRM-029', unitCost: 29.99, currentStock: 267, categoryId: '5', categoryName: 'Accessories' },
  { id: '30', name: 'Desk Pad XL', sku: 'DSP-XL-030', unitCost: 39.99, currentStock: 178, categoryId: '5', categoryName: 'Accessories' },
]

export default function Home() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  })

  useEffect(() => {
    // Calculate stats from inventory data - only once on mount
    if (stats.totalItems === 0) {
      const totalItems = DUMMY_ITEMS.length
      const totalValue = DUMMY_ITEMS.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
      const lowStockItems = DUMMY_ITEMS.filter(item => item.currentStock > 0 && item.currentStock < 10).length
      const outOfStockItems = DUMMY_ITEMS.filter(item => item.currentStock === 0).length

      setStats({
        totalItems,
        totalValue,
        lowStockItems,
        outOfStockItems,
      })
    }
  }, [])

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h1 className="text-lg font-semibold text-foreground">Inventory Management System</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to access your dashboard.</p>
              <Link
                href="/auth/signin"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isAdmin = (session as any)?.roles?.includes('ROLE_ADMIN')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">Overview and quick actions</p>
          </div>
          <div className="text-base text-muted-foreground bg-card rounded-lg px-4 py-3 border border-border">
            Signed in as <span className="font-semibold text-foreground text-lg">{session.user?.name || 'User'}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Items</div>
            <div className="mt-3 text-5xl font-bold text-foreground">{stats.totalItems}</div>
            <div className="mt-2 text-sm text-muted-foreground">Items in inventory</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Value</div>
            <div className="mt-3 text-5xl font-bold text-foreground">${stats.totalValue.toFixed(2)}</div>
            <div className="mt-2 text-sm text-muted-foreground">Inventory value</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Low Stock</div>
            <div className="mt-3 text-5xl font-bold text-yellow-600">{stats.lowStockItems}</div>
            <div className="mt-2 text-sm text-muted-foreground">Items below threshold</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Out of Stock</div>
            <div className="mt-3 text-5xl font-bold text-red-600">{stats.outOfStockItems}</div>
            <div className="mt-2 text-sm text-muted-foreground">Items unavailable</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Quick Actions */}
          <div className="lg:col-span-8">
            <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
              <div className="border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4">
                <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
                <p className="mt-1 text-base text-muted-foreground">Jump to common workflows</p>
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <Link href="/items" className="group rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Items</div>
                      <div className="mt-2 text-base text-muted-foreground">Create and manage inventory items</div>
                    </div>
                    <div className="text-2xl">📦</div>
                  </div>
                </Link>
                <Link href="/stock-in" className="group rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Stock In</div>
                      <div className="mt-2 text-base text-muted-foreground">Record incoming inventory</div>
                    </div>
                    <div className="text-2xl">📥</div>
                  </div>
                </Link>
                <Link href="/stock-out" className="group rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Stock Out</div>
                      <div className="mt-2 text-base text-muted-foreground">Record outgoing inventory</div>
                    </div>
                    <div className="text-2xl">📤</div>
                  </div>
                </Link>
                <Link href="/stock-movements" className="group rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Movements</div>
                      <div className="mt-2 text-base text-muted-foreground">View movement history</div>
                    </div>
                    <div className="text-2xl">📊</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
              <div className="border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4">
                <h2 className="text-2xl font-bold text-foreground">Reports</h2>
                <p className="mt-1 text-base text-muted-foreground">Operational insights</p>
              </div>
              <div className="grid gap-4 p-6">
                <Link href="/reports/stock-out-reasons" className="group rounded-lg border border-border bg-background p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Stock-out Reasons</div>
                      <div className="mt-1 text-base text-muted-foreground">Breakdown by reason</div>
                    </div>
                    <div className="text-2xl">📈</div>
                  </div>
                </Link>
                <Link href="/stock-movements" className="group rounded-lg border border-border bg-background p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Movement History</div>
                      <div className="mt-1 text-base text-muted-foreground">Full audit trail</div>
                    </div>
                    <div className="text-2xl">📋</div>
                  </div>
                </Link>
                {isAdmin ? (
                  <Link href="/users" className="group rounded-lg border border-border bg-background p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">User Management</div>
                        <div className="mt-1 text-base text-muted-foreground">Manage users and roles</div>
                      </div>
                      <div className="text-2xl">👥</div>
                    </div>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
