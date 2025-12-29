/**
 * Permission system for RBAC
 * Defines all permissions and their role mappings
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
 * Check if user has specific permission
 */
export const hasPermission = (
  userRole: UserRole | undefined,
  permission: Permission
): boolean => {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (
  userRole: UserRole | undefined,
  permissions: Permission[]
): boolean => {
  if (!userRole) return false;
  return permissions.some(p => hasPermission(userRole, p));
};

/**
 * Check if user has all specified permissions
 */
export const hasAllPermissions = (
  userRole: UserRole | undefined,
  permissions: Permission[]
): boolean => {
  if (!userRole) return false;
  return permissions.every(p => hasPermission(userRole, p));
};

/**
 * Check if user is admin
 */
export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'ADMIN';
};
