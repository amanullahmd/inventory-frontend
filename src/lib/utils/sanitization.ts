/**
 * Frontend input sanitization utilities
 * Provides XSS prevention and HTML escaping
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (!text) return '';

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Sanitize user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove script tags and event handlers
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Escape HTML
  sanitized = escapeHtml(sanitized);

  return sanitized;
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return '';
  }

  return url;
}

/**
 * Sanitize JSON string to prevent injection
 */
export function sanitizeJson(json: string): string {
  if (!json) return '';

  try {
    // Parse and re-stringify to ensure valid JSON
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed);
  } catch {
    return '';
  }
}

/**
 * Remove null bytes and other control characters
 */
export function removeControlCharacters(input: string): string {
  if (!input) return '';

  // Remove null bytes and control characters
  return input.replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  // Remove control characters
  let sanitized = removeControlCharacters(email);

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized.toLowerCase();
}

/**
 * Sanitize file name to prevent directory traversal
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return '';

  // Remove path traversal attempts
  let sanitized = fileName
    .replace(/\.\./g, '')
    .replace(/[\/\\]/g, '')
    .replace(/[<>:"|?*]/g, '');

  // Remove control characters
  sanitized = removeControlCharacters(sanitized);

  return sanitized;
}

/**
 * Create a safe text node (prevents XSS)
 */
export function createSafeTextNode(text: string): Text {
  return document.createTextNode(text);
}

/**
 * Set text content safely (prevents XSS)
 */
export function setTextContent(element: HTMLElement, text: string): void {
  element.textContent = text;
}

/**
 * Sanitize object properties recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj } as Record<string, any>;

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key] as string);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }

  return sanitized as T;
}
