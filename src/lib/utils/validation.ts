/**
 * Frontend validation utilities
 * Provides common validation functions for forms and inputs
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }

  return null;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): string | null {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }

  return null;
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }

  return null;
}

/**
 * Validate minimum length
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): string | null {
  if (!value || value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }

  return null;
}

/**
 * Validate maximum length
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }

  return null;
}

/**
 * Validate number range
 */
export function validateRange(value: number, min: number, max: number, fieldName: string): string | null {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }

  return null;
}

/**
 * Validate positive number
 */
export function validatePositive(value: number, fieldName: string): string | null {
  if (value <= 0) {
    return `${fieldName} must be greater than 0`;
  }

  return null;
}

/**
 * Validate SKU format
 */
export function validateSku(sku: string): string | null {
  if (!sku || sku.trim() === '') {
    return 'SKU is required';
  }

  const skuRegex = /^[A-Z0-9-]{3,50}$/;
  if (!skuRegex.test(sku)) {
    return 'SKU must be 3-50 characters, uppercase letters, numbers, and hyphens only';
  }

  return null;
}

/**
 * Validate item name
 */
export function validateItemName(name: string): string | null {
  if (!name || name.trim() === '') {
    return 'Item name is required';
  }

  if (name.length < 3) {
    return 'Item name must be at least 3 characters';
  }

  if (name.length > 255) {
    return 'Item name must not exceed 255 characters';
  }

  return null;
}

/**
 * Validate unit cost
 */
export function validateUnitCost(cost: number): string | null {
  if (cost === null || cost === undefined) {
    return 'Unit cost is required';
  }

  if (cost < 0) {
    return 'Unit cost cannot be negative';
  }

  return null;
}

/**
 * Validate quantity
 */
export function validateQuantity(quantity: number): string | null {
  if (quantity === null || quantity === undefined) {
    return 'Quantity is required';
  }

  if (!Number.isInteger(quantity)) {
    return 'Quantity must be a whole number';
  }

  if (quantity <= 0) {
    return 'Quantity must be greater than 0';
  }

  return null;
}

/**
 * Validate form object
 */
export function validateForm(values: Record<string, any>, schema: Record<string, (value: any) => string | null>): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [field, validator] of Object.entries(schema)) {
    const error = validator(values[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  }

  return errors;
}
