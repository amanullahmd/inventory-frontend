/**
 * Custom hook for permission checking
 * Provides easy access to permission functions
 * 
 * @example
 * const { can, canAny, canAll, isAdmin } = usePermissions();
 * if (can('create_item')) {
 *   // Show create button
 * }
 */

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  Permission,
  UserRole
} from '@/lib/auth/permissions';

interface UsePermissionsReturn {
  userRole: UserRole | undefined;
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  isAdmin: () => boolean;
}

/**
 * Hook to check user permissions based on their role
 * Extracts role from NextAuth session and provides permission checking methods
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { data: session } = useSession();

  // Extract role from session, removing 'ROLE_' prefix if present
  const userRole = useMemo(() => {
    const role = session?.roles?.[0]?.replace('ROLE_', '') as UserRole;
    return role || undefined;
  }, [session?.roles]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    userRole,
    can: (permission: Permission) => hasPermission(userRole, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(userRole, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(userRole, permissions),
    isAdmin: () => isAdmin(userRole),
  }), [userRole]);
};
