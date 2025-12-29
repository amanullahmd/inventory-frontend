/**
 * Permission Guard Component
 * Conditionally renders content based on user permissions
 */

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/auth/permissions';

interface PermissionGuardProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export default function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children
}: PermissionGuardProps) {
  const { can, canAny, canAll } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  }

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
}
