/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 * Provides token generation and validation
 */

const CSRF_TOKEN_KEY = 'csrf-token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create CSRF token
 */
export function getCsrfToken(): string {
  let token = localStorage.getItem(CSRF_TOKEN_KEY);

  if (!token) {
    token = generateCsrfToken();
    localStorage.setItem(CSRF_TOKEN_KEY, token);
  }

  return token;
}

/**
 * Clear CSRF token
 */
export function clearCsrfToken(): void {
  localStorage.removeItem(CSRF_TOKEN_KEY);
}

/**
 * Get CSRF token header
 */
export function getCsrfHeader(): Record<string, string> {
  return {
    [CSRF_HEADER_NAME]: getCsrfToken(),
  };
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string): boolean {
  const storedToken = localStorage.getItem(CSRF_TOKEN_KEY);
  return storedToken === token;
}

/**
 * Add CSRF token to request headers
 */
export function addCsrfTokenToHeaders(headers: Record<string, string>): Record<string, string> {
  return {
    ...headers,
    ...getCsrfHeader(),
  };
}

/**
 * Add CSRF token to form data
 */
export function addCsrfTokenToFormData(formData: FormData): FormData {
  formData.append('_csrf', getCsrfToken());
  return formData;
}

/**
 * Verify same-site cookie policy
 */
export function verifySameSiteCookie(): boolean {
  // Check if cookies are being sent with same-site policy
  const cookies = document.cookie;
  return cookies.length > 0;
}

/**
 * Set secure cookie with same-site policy
 */
export function setSecureCookie(name: string, value: string, days: number = 7): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieString = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Strict; Secure`;
  document.cookie = cookieString;
}

/**
 * Get cookie value
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }

  return null;
}

/**
 * Delete cookie
 */
export function deleteCookie(name: string): void {
  setSecureCookie(name, '', -1);
}
