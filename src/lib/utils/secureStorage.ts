/**
 * Secure storage utilities
 * Provides safe storage for sensitive data
 */

const STORAGE_PREFIX = 'app_';
const SENSITIVE_KEYS = ['token', 'password', 'secret', 'key', 'auth'];

/**
 * Check if a key is sensitive
 */
function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive));
}

/**
 * Safely store data in sessionStorage (cleared on browser close)
 */
export function setSessionData(key: string, value: any): void {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    const serialized = JSON.stringify(value);

    if (isSensitiveKey(key)) {
      // For sensitive data, use sessionStorage instead of localStorage
      sessionStorage.setItem(prefixedKey, serialized);
    } else {
      sessionStorage.setItem(prefixedKey, serialized);
    }
  } catch (error) {
    console.error('Error storing session data:', error);
  }
}

/**
 * Safely retrieve data from sessionStorage
 */
export function getSessionData(key: string): any {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    const data = sessionStorage.getItem(prefixedKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving session data:', error);
    return null;
  }
}

/**
 * Safely remove data from sessionStorage
 */
export function removeSessionData(key: string): void {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    sessionStorage.removeItem(prefixedKey);
  } catch (error) {
    console.error('Error removing session data:', error);
  }
}

/**
 * Clear all session data
 */
export function clearSessionData(): void {
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
}

/**
 * Store authentication token securely
 */
export function storeAuthToken(token: string): void {
  setSessionData('auth_token', token);
}

/**
 * Retrieve authentication token
 */
export function getAuthToken(): string | null {
  return getSessionData('auth_token');
}

/**
 * Clear authentication token
 */
export function clearAuthToken(): void {
  removeSessionData('auth_token');
}

/**
 * Store refresh token securely
 */
export function storeRefreshToken(token: string): void {
  setSessionData('refresh_token', token);
}

/**
 * Retrieve refresh token
 */
export function getRefreshToken(): string | null {
  return getSessionData('refresh_token');
}

/**
 * Clear refresh token
 */
export function clearRefreshToken(): void {
  removeSessionData('refresh_token');
}

/**
 * Check if token exists
 */
export function hasAuthToken(): boolean {
  return getAuthToken() !== null;
}

/**
 * Clear all authentication data
 */
export function clearAllAuthData(): void {
  clearAuthToken();
  clearRefreshToken();
  clearSessionData();
}

/**
 * Safely store user data (non-sensitive)
 */
export function storeUserData(userData: any): void {
  // Only store non-sensitive user data
  const safeData = {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    role: userData.role,
  };
  setSessionData('user_data', safeData);
}

/**
 * Retrieve user data
 */
export function getUserData(): any {
  return getSessionData('user_data');
}

/**
 * Clear user data
 */
export function clearUserData(): void {
  removeSessionData('user_data');
}

/**
 * Get all stored data (for debugging only)
 */
export function getAllStoredData(): Record<string, any> {
  const data: Record<string, any> = {};
  const keys = Object.keys(sessionStorage);

  keys.forEach((key) => {
    if (key.startsWith(STORAGE_PREFIX)) {
      const cleanKey = key.replace(STORAGE_PREFIX, '');
      data[cleanKey] = getSessionData(cleanKey);
    }
  });

  return data;
}
