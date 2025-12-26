'use client';

import { useState, useCallback, useEffect } from 'react';
import { UserService } from '@/lib/services/userService';
import { User } from '@/lib/types';

/**
 * Custom hook for user management
 * Handles fetching, creating, and managing users
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all users
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new user (placeholder - implement in backend)
   */
  const createUser = useCallback(async (input: any) => {
    setError(null);
    // This would need to be implemented in the backend
    throw new Error('User creation not yet implemented');
  }, []);

  /**
   * Delete a user (placeholder - implement in backend)
   */
  const deleteUser = useCallback(async (userId: string | number) => {
    setError(null);
    // This would need to be implemented in the backend
    throw new Error('User deletion not yet implemented');
  }, []);

  /**
   * Validate email format
   */
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }
    return true;
  }, []);

  /**
   * Check if email already exists
   */
  const emailExists = useCallback((email: string): boolean => {
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  }, [users]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh users list
   */
  const refresh = useCallback(() => {
    return fetchUsers();
  }, [fetchUsers]);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    deleteUser,
    validateEmail,
    emailExists,
    clearError,
    refresh,
  };
}
