'use client'

import { Car, LayoutDashboard, List, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { VehicleService } from '@/lib/services/vehicleService'

interface VehicleNavItem {
  name: string
  href: string
  icon: React.ReactNode
}

interface VehicleSubSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const VehicleSubSidebarComponent = ({ collapsed, onToggle }: VehicleSubSidebarProps) => {
  const pathname = usePathname()

  const vehicleInfo = VehicleService.getVehicleInfoList()

  const navItems: VehicleNavItem[] = [
    { name: 'Dashboard', href: '/vehicle-management/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Vehicle List', href: '/vehicle-management/list', icon: <List size={18} /> },
  ]

  const isActive = (href: string) => {
    if (href === '/vehicle-management/dashboard') {
      return pathname === '/vehicle-management' || pathname === '/vehicle-management/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={`
        flex-shrink-0 sticky top-0 h-screen bg-sidebar/80 backdrop-blur-sm border-r border-sidebar-border
        transition-all duration-300 ease-in-out flex flex-col overflow-hidden
        ${collapsed ? 'w-16' : 'w-56'}
      `}
      suppressHydrationWarning
    >
      {/* Header */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-2 py-4 border-b border-sidebar-border`}>
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Car size={16} className="text-primary" />
            </div>
            <span className="font-bold text-xs text-sidebar-foreground truncate">Vehicles</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Car size={16} className="text-primary" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-sidebar-accent transition-colors flex-shrink-0"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
        {/* Main nav items */}
        <div className="space-y-0.5 mb-3">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 text-sm
                ${isActive(item.href)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }
                ${collapsed ? 'justify-center px-1' : ''}
              `}
              title={collapsed ? item.name : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="font-medium text-sm truncate">{item.name}</span>}
            </Link>
          ))}
        </div>

        {/* Vehicles section */}
        {!collapsed && (
          <>
            <div className="mt-3 mb-1.5 px-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicles</span>
            </div>
            <div className="space-y-0.5">
              {vehicleInfo.map(v => {
                const vehicleHref = `/vehicle-management/${encodeURIComponent(v.carModel)}`
                const active = isActive(vehicleHref)
                return (
                  <Link
                    key={v.carModel}
                    href={vehicleHref}
                    className={`
                      flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-sm
                      ${active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }
                    `}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-primary-foreground' : 'bg-primary/50'}`} />
                    <div className="min-w-0">
                      <span className="font-medium text-[11px] truncate block">{v.carModel}</span>
                      <span className="text-[9px] text-muted-foreground/60 truncate">{v.carNo}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* Collapsed: show dots */}
        {collapsed && (
          <div className="space-y-1 flex flex-col items-center">
            {vehicleInfo.map(v => {
              const vehicleHref = `/vehicle-management/${encodeURIComponent(v.carModel)}`
              const active = isActive(vehicleHref)
              return (
                <Link
                  key={v.carModel}
                  href={vehicleHref}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center transition-all
                    ${active ? 'bg-primary' : 'hover:bg-sidebar-accent'}
                  `}
                  title={v.carModel}
                >
                  <div className={`w-2 h-2 rounded-full ${active ? 'bg-primary-foreground' : 'bg-primary/50'}`} />
                </Link>
              )
            })}
          </div>
        )}
      </nav>
    </aside>
  )
}

export const VehicleSubSidebar = memo(VehicleSubSidebarComponent)
VehicleSubSidebar.displayName = 'VehicleSubSidebar'
