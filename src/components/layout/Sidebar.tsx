'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Boxes,
  Package,
  Building2,
  Tags,
  ArrowDownCircle,
  ArrowUpCircle,
  Shuffle,
  ClipboardList,
  ShoppingCart,
  Receipt,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  LogOut,
  ShieldCheck,
} from 'lucide-react'

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
  adminOnly?: boolean
}

type NavGroup = {
  id: string
  label: string
  icon: React.ReactNode
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <LayoutDashboard className="h-5 w-5" />,
    items: [
      { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    icon: <Boxes className="h-5 w-5" />,
    items: [
      { href: '/items', label: 'Items', icon: <Package className="h-4 w-4" /> },
      { href: '/suppliers', label: 'Suppliers', icon: <Users className="h-4 w-4" /> },
      { href: '/warehouses', label: 'Branches', icon: <Building2 className="h-4 w-4" /> },
      { href: '/categories', label: 'Categories', icon: <Tags className="h-4 w-4" /> },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: <ClipboardList className="h-5 w-5" />,
    items: [
      { href: '/stock-in', label: 'Stock In', icon: <ArrowDownCircle className="h-4 w-4" /> },
      { href: '/stock-out', label: 'Stock Out', icon: <ArrowUpCircle className="h-4 w-4" /> },
      { href: '/stock-movements', label: 'Movements', icon: <Shuffle className="h-4 w-4" /> },
      { href: '/transfers', label: 'Transfers', icon: <Shuffle className="h-4 w-4" /> },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: <ShoppingCart className="h-5 w-5" />,
    items: [
      { href: '/orders/purchase', label: 'Purchase Orders', icon: <ShoppingCart className="h-4 w-4" /> },
      { href: '/orders/sales', label: 'Sales Orders', icon: <Receipt className="h-4 w-4" /> },
    ],
  },
  {
    id: 'staff',
    label: 'Staff',
    icon: <Users className="h-5 w-5" />,
    items: [
      { href: '/employees', label: 'Employees', icon: <Users className="h-4 w-4" /> },
      { href: '/demand', label: 'Demand', icon: <ClipboardList className="h-4 w-4" /> },
    ],
  },
  {
    id: 'system',
    label: 'System',
    icon: <Settings className="h-5 w-5" />,
    items: [
      { href: '/users', label: 'Users', icon: <Users className="h-4 w-4" />, adminOnly: true },
      { href: '/grades', label: 'Grades', icon: <ShieldCheck className="h-4 w-4" /> },
      { href: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
]

export default function Sidebar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const c = window.localStorage.getItem('sidebar-collapsed')
    setCollapsed(c === 'true')
    const g = window.localStorage.getItem('sidebar-open-groups')
    if (g) {
      try {
        setOpenGroups(JSON.parse(g))
      } catch {}
    } else {
      const initial: Record<string, boolean> = {}
      for (const grp of groups) initial[grp.id] = true
      setOpenGroups(initial)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('sidebar-collapsed', String(collapsed))
  }, [collapsed])

  useEffect(() => {
    window.localStorage.setItem('sidebar-open-groups', JSON.stringify(openGroups))
  }, [openGroups])

  if (status !== 'authenticated') return null

  const isAdmin = (session as any)?.roles?.includes('ROLE_ADMIN')
  
  const visibleGroups = groups.map(group => ({
    ...group,
    items: group.items.filter(item => !item.adminOnly || isAdmin),
  })).filter(group => group.items.length > 0)

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const Container = ({ children }: { children: React.ReactNode }) => (
    <aside
      className={[
        'border-r border-border bg-card text-foreground',
        'transition-all duration-200 ease-in-out',
        collapsed ? 'w-20' : 'w-72',
        'hidden lg:flex flex-col',
      ].join(' ')}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <img src="/idp-logo.svg" alt="IDP" className="h-12 w-12 rounded-md" />
          {!collapsed && <span className="text-lg font-bold">IDP Inventory</span>}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-2 text-sm text-foreground hover:bg-accent"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 overflow-auto py-2">
        {visibleGroups.map(group => (
          <div key={group.id} className="px-2">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-semibold hover:bg-accent"
              onClick={() => (collapsed ? setCollapsed(false) : toggleGroup(group.id))}
            >
              <span className="text-muted-foreground">{group.icon}</span>
              {!collapsed && <span className="text-foreground">{group.label}</span>}
              {!collapsed && (
                <span className="ml-auto text-muted-foreground">
                  {openGroups[group.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </span>
              )}
            </button>
            {(collapsed || openGroups[group.id]) && (
              <div className={['mt-1 space-y-1', collapsed ? '' : 'pl-8'].join(' ')}>
                {group.items.map(it => {
                  const active = pathname === it.href
                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={[
                        'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      ].join(' ')}
                    >
                      <span>{it.icon}</span>
                      {!collapsed && <span>{it.label}</span>}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="border-t border-border px-4 py-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className={[
            'flex w-full items-center gap-2 rounded-md',
            'border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-accent',
          ].join(' ')}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )

  const Mobile = () => (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm hover:bg-accent"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close"
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-border bg-card shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <img src="/idp-logo.svg" alt="IDP" className="h-12 w-12 rounded-md" />
                <span className="text-lg font-bold">IDP Inventory</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-2 text-sm text-foreground hover:bg-accent"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 overflow-auto py-2">
              {visibleGroups.map(group => (
                <div key={group.id} className="px-2">
                  <div className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-semibold text-foreground">
                    <span className="text-muted-foreground">{group.icon}</span>
                    <span>{group.label}</span>
                  </div>
                  <div className="mt-1 space-y-1 pl-8">
                    {group.items.map(it => {
                      const active = pathname === it.href
                      return (
                        <Link
                          key={it.href}
                          href={it.href}
                          onClick={() => setMobileOpen(false)}
                          className={[
                            'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                            active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                          ].join(' ')}
                        >
                          <span>{it.icon}</span>
                          <span>{it.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="border-t border-border px-4 py-3">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/auth/signin' }) }}
                className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-accent"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Mobile />
      <Container>{null}</Container>
    </>
  )
}
