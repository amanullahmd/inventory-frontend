/**
 * Custom hook for permission checking
 * Provides easy access to permission functions
 */

import { useSession } from 'next-auth/react';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  Permission,
  UserRole
} from '@/lib/auth/permissions';

export const usePermissions = () => {
  const { data: session } = useSession();

  // Extract role from session, removing 'ROLE_' prefix if present
  const userRole = (session?.roles?.[0]?.replace('ROLE_', '') as UserRole) || undefined;

  return {
    userRole,
    can: (permission: Permission) => hasPermission(userRole, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(userRole, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(userRole, permissions),
    isAdmin: () => isAdmin(userRole),
  };
};
