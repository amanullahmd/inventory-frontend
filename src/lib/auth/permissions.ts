/**
 * Permission system for RBAC (Role-Based Access Control)
 * Defines all permissions and their role mappings
 * 
 * @module lib/auth/permissions
 * @example
 * import { hasPermission, usePermissions } from '@/lib/auth/permissions';
 * 
 * // Check permission directly
 * if (hasPermission('ADMIN', 'create_item')) {
 *   // User can create items
 * }
 * 
 * // Use in React component
 * const { can, isAdmin } = usePermissions();
 * if (can('create_item')) {
 *   // Show create button
 * }
 */

export type Permission =
  | 'create_category'
  | 'create_user'
  | 'view_users'
  | 'view_audit_logs'
  | 'manage_system'
  | 'create_item'
  | 'stock_in'
  | 'stock_out'
  | 'create_order'
  | 'view_reports'
  | 'update_category'
  | 'delete_category';

export type UserRole = 'ADMIN' | 'USER';

/**
 * Maps each user role to their allowed permissions
 * ADMIN has all permissions, USER has limited permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'ADMIN': [
    'create_category',
    'create_user',
    'view_users',
    'view_audit_logs',
    'manage_system',
    'create_item',
    'stock_in',
    'stock_out',
    'create_order',
    'view_reports',
    'update_category',
    'delete_category'
  ],
  'USER': [
    'create_item',
    'stock_in',
    'stock_out',
    'create_order',
    'view_reports',
    'update_category',
    'delete_category'
  ]
};

/**
 * Check if user has a specific permission
 * @param userRole - The user's role (ADMIN or USER)
 * @param permission - The permission to check
 * @returns true if user has the permission, false otherwise
 */
export const hasPermission = (
  userRole: UserRole | undefined,
  permission: Permission
): boolean => {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
};

/**
 * Check if user has any of the specified permissions (OR logic)
 * @param userRole - The user's role (ADMIN or USER)
 * @param permissions - Array of permissions to check
 * @returns true if user has at least one permission, false otherwise
 */
export const hasAnyPermission = (
  userRole: UserRole | undefined,
  permissions: Permission[]
): boolean => {
  if (!userRole) return false;
  return permissions.some(p => hasPermission(userRole, p));
};

/**
 * Check if user has all specified permissions (AND logic)
 * @param userRole - The user's role (ADMIN or USER)
 * @param permissions - Array of permissions to check
 * @returns true if user has all permissions, false otherwise
 */
export const hasAllPermissions = (
  userRole: UserRole | undefined,
  permissions: Permission[]
): boolean => {
  if (!userRole) return false;
  return permissions.every(p => hasPermission(userRole, p));
};

/**
 * Check if user is an admin
 * @param userRole - The user's role (ADMIN or USER)
 * @returns true if user is ADMIN, false otherwise
 */
export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'ADMIN';
};
