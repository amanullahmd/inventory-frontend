'use client'

import { useSession } from "next-auth/react"

export function usePermission(permissionCode?: string) {
  const { data: session } = useSession()
  
  const hasPermission = (code: string) => {
    if (!session?.permissions) return false
    return session.permissions.includes(code)
  }

  const hasAnyPermission = (codes: string[]) => {
    if (!session?.permissions) return false
    return codes.some(code => session.permissions!.includes(code))
  }

  const hasAllPermissions = (codes: string[]) => {
    if (!session?.permissions) return false
    return codes.every(code => session.permissions!.includes(code))
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAllowed: permissionCode ? hasPermission(permissionCode) : false,
    permissions: session?.permissions || []
  }
}
