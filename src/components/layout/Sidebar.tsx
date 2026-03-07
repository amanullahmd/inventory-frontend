'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, memo, useMemo } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  ShoppingCart,
  TrendingUp,
  Users,
  Building2,
  Tags,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Items', href: '/items', icon: <Package size={20} /> },
  { name: 'Stock In', href: '/stock-in', icon: <ArrowDownToLine size={20} /> },
  { name: 'Stock Out', href: '/stock-out', icon: <ArrowUpFromLine size={20} /> },
  { name: 'Movements', href: '/stock-movements', icon: <History size={20} /> },
  { name: 'Most Used', href: '/reports/most-used-items', icon: <TrendingUp size={20} /> },
  { name: 'Purchase Orders', href: '/orders/purchase', icon: <ShoppingCart size={20} /> },
  { name: 'Demand', href: '/demand', icon: <TrendingUp size={20} /> },
]

const managementItems: NavItem[] = [
  { name: 'Categories', href: '/categories', icon: <Tags size={20} /> },
  { name: 'Suppliers', href: '/suppliers', icon: <Truck size={20} /> },
  { name: 'Division', href: '/warehouses', icon: <Building2 size={20} /> },
  { name: 'Employees', href: '/employees', icon: <Users size={20} /> },
  { name: 'Users', href: '/users', icon: <Users size={20} />, adminOnly: true },
  { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
]

// Memoized nav link component
const NavLink = memo(({ item, collapsed, isActive, isAdmin, onNavigate }: {
  item: NavItem
  collapsed: boolean
  isActive: boolean
  isAdmin: boolean
  onNavigate: () => void
}) => {
  if (item.adminOnly && !isAdmin) return null

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
        ${isActive
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
      title={collapsed ? item.name : undefined}
    >
      <span className={isActive ? 'text-primary-foreground' : ''}>{item.icon}</span>
      {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
    </Link>
  )
})

NavLink.displayName = 'NavLink'

export default function Sidebar() {
  const { data: session } = useSession()
  const { isAdmin } = usePermissions()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Memoize filtered nav items
  const filteredNavItems = useMemo(() =>
    navItems.filter(item => !item.adminOnly || isAdmin()),
    [isAdmin]
  )

  const filteredManagementItems = useMemo(() =>
    managementItems.filter(item => !item.adminOnly || isAdmin()),
    [isAdmin]
  )

  if (!session) return null


  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-5 border-b border-sidebar-border`}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Package size={18} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">DPE Inventory</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Package size={18} className="text-primary-foreground" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {filteredNavItems.map(item => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              isActive={isActive(item.href)}
              isAdmin={isAdmin()}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </div>

        {!collapsed && (
          <div className="mt-6 mb-2 px-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Management</span>
          </div>
        )}
        {collapsed && <div className="my-4 border-t border-sidebar-border" />}

        <div className="space-y-1">
          {filteredManagementItems.map(item => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              isActive={isActive(item.href)}
              isAdmin={isAdmin()}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </div>
      </div>


    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-background border-b border-border flex items-center justify-between px-4" suppressHydrationWarning>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Package size={18} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">DPE Inventory</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        lg:hidden fixed top-14 left-0 bottom-0 z-50 w-72 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `} suppressHydrationWarning>
        <div className="flex flex-col h-full">
          {sidebarContent}
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40
        bg-sidebar border-r border-sidebar-border
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-64'}
      `} suppressHydrationWarning>
        {sidebarContent}
      </aside>
    </>
  )
}
