/**
 * Unit tests for permission system functions
 * Feature: frontend-rbac-permissions
 */

import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  ROLE_PERMISSIONS,
  Permission,
  UserRole
} from '@/lib/auth/permissions'

describe('Permission Functions', () => {
  describe('hasPermission', () => {
    test('returns true when ADMIN has permission', () => {
      expect(hasPermission('ADMIN', 'create_category')).toBe(true)
      expect(hasPermission('ADMIN', 'create_user')).toBe(true)
      expect(hasPermission('ADMIN', 'view_users')).toBe(true)
    })

    test('returns true when USER has permission', () => {
      expect(hasPermission('USER', 'create_item')).toBe(true)
      expect(hasPermission('USER', 'stock_in')).toBe(true)
      expect(hasPermission('USER', 'stock_out')).toBe(true)
    })

    test('returns false when USER lacks permission', () => {
      expect(hasPermission('USER', 'create_category')).toBe(false)
      expect(hasPermission('USER', 'create_user')).toBe(false)
      expect(hasPermission('USER', 'view_users')).toBe(false)
      expect(hasPermission('USER', 'view_audit_logs')).toBe(false)
      expect(hasPermission('USER', 'manage_system')).toBe(false)
    })

    test('returns false when role is undefined', () => {
      expect(hasPermission(undefined, 'create_category')).toBe(false)
      expect(hasPermission(undefined, 'create_item')).toBe(false)
    })
  })

  describe('hasAnyPermission', () => {
    test('returns true when user has at least one permission', () => {
      expect(hasAnyPermission('ADMIN', ['create_category', 'create_user'])).toBe(true)
      expect(hasAnyPermission('USER', ['create_item', 'create_category'])).toBe(true)
    })

    test('returns false when user has none of the permissions', () => {
      expect(hasAnyPermission('USER', ['create_category', 'create_user', 'view_users'])).toBe(false)
    })

    test('returns false when role is undefined', () => {
      expect(hasAnyPermission(undefined, ['create_category', 'create_item'])).toBe(false)
    })

    test('returns false with empty permissions array', () => {
      expect(hasAnyPermission('ADMIN', [])).toBe(false)
    })
  })

  describe('hasAllPermissions', () => {
    test('returns true when user has all permissions', () => {
      expect(hasAllPermissions('ADMIN', ['create_category', 'create_user', 'view_users'])).toBe(true)
    })

    test('returns false when user lacks any permission', () => {
      expect(hasAllPermissions('USER', ['create_item', 'create_category'])).toBe(false)
      expect(hasAllPermissions('USER', ['create_item', 'stock_in', 'create_user'])).toBe(false)
    })

    test('returns false when role is undefined', () => {
      expect(hasAllPermissions(undefined, ['create_category', 'create_item'])).toBe(false)
    })

    test('returns true with empty permissions array', () => {
      expect(hasAllPermissions('ADMIN', [])).toBe(true)
      expect(hasAllPermissions('USER', [])).toBe(true)
    })
  })

  describe('isAdmin', () => {
    test('returns true for ADMIN role', () => {
      expect(isAdmin('ADMIN')).toBe(true)
    })

    test('returns false for USER role', () => {
      expect(isAdmin('USER')).toBe(false)
    })

    test('returns false for undefined role', () => {
      expect(isAdmin(undefined)).toBe(false)
    })
  })

  describe('ROLE_PERMISSIONS mapping', () => {
    test('ADMIN has all 12 permissions', () => {
      expect(ROLE_PERMISSIONS['ADMIN'].length).toBe(12)
      const expectedPermissions = [
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
      ]
      expectedPermissions.forEach(perm => {
        expect(ROLE_PERMISSIONS['ADMIN']).toContain(perm)
      })
    })

    test('USER has exactly 7 permissions', () => {
      expect(ROLE_PERMISSIONS['USER'].length).toBe(7)
      const expectedPermissions = [
        'create_item',
        'stock_in',
        'stock_out',
        'create_order',
        'view_reports',
        'update_category',
        'delete_category'
      ]
      expectedPermissions.forEach(perm => {
        expect(ROLE_PERMISSIONS['USER']).toContain(perm)
      })
    })

    test('USER does not have restricted permissions', () => {
      const restrictedPermissions = [
        'create_category',
        'create_user',
        'view_users',
        'view_audit_logs',
        'manage_system'
      ]
      restrictedPermissions.forEach(perm => {
        expect(ROLE_PERMISSIONS['USER']).not.toContain(perm)
      })
    })
  })

  describe('Permission consistency', () => {
    test('multiple calls with same inputs return same result', () => {
      const role: UserRole = 'ADMIN'
      const permission: Permission = 'create_category'

      const result1 = hasPermission(role, permission)
      const result2 = hasPermission(role, permission)
      const result3 = hasPermission(role, permission)

      expect(result1).toBe(result2)
      expect(result2).toBe(result3)
    })

    test('hasAnyPermission and hasAllPermissions are consistent', () => {
      const role: UserRole = 'ADMIN'
      const permissions: Permission[] = ['create_category', 'create_user']

      // For ADMIN with these permissions, both should be true
      expect(hasAnyPermission(role, permissions)).toBe(true)
      expect(hasAllPermissions(role, permissions)).toBe(true)

      // For USER with these permissions, both should be false
      expect(hasAnyPermission('USER', permissions)).toBe(false)
      expect(hasAllPermissions('USER', permissions)).toBe(false)
    })
  })
})
