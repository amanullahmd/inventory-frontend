'use client'

import { ReactNode } from 'react'
import { usePermission } from '@/hooks/usePermission'

interface PermissionGuardProps {
  permission: string | string[]
  children: ReactNode
  fallback?: ReactNode
  requireAll?: boolean
}

export default function PermissionGuard({ 
  permission, 
  children, 
  fallback = null,
  requireAll = false 
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()

  if (Array.isArray(permission)) {
    if (requireAll) {
      if (!hasAllPermissions(permission)) return <>{fallback}</>
    } else {
      if (!hasAnyPermission(permission)) return <>{fallback}</>
    }
  } else {
    if (!hasPermission(permission)) return <>{fallback}</>
  }

  return <>{children}</>
}
