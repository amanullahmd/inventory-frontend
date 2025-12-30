/**
 * Permission Guard Component
 * Conditionally renders content based on user permissions
 * 
 * @example
 * // Single permission check
 * <PermissionGuard permission="create_item">
 *   <button>Create Item</button>
 * </PermissionGuard>
 * 
 * // Multiple permissions with OR logic
 * <PermissionGuard permissions={['create_item', 'edit_item']}>
 *   <button>Manage Item</button>
 * </PermissionGuard>
 * 
 * // Multiple permissions with AND logic
 * <PermissionGuard permissions={['create_item', 'view_reports']} requireAll>
 *   <button>Create and Report</button>
 * </PermissionGuard>
 * 
 * // With fallback content
 * <PermissionGuard 
 *   permission="admin_only"
 *   fallback={<p>You don't have permission</p>}
 * >
 *   <button>Admin Action</button>
 * </PermissionGuard>
 */

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/auth/permissions';

interface PermissionGuardProps {
  /** Single permission to check */
  permission?: Permission;
  /** Multiple permissions to check */
  permissions?: Permission[];
  /** Use AND logic for multiple permissions (default: false = OR logic) */
  requireAll?: boolean;
  /** Content to render when permission is denied (default: null) */
  fallback?: ReactNode;
  /** Content to render when permission is granted */
  children: ReactNode;
}

/**
 * Component that conditionally renders content based on user permissions
 * Supports single and multiple permission checks with AND/OR logic
 */
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
