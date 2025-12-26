/**
 * Frontend error handling utilities
 * Provides consistent error handling and user-friendly messages
 */

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string>;
  timestamp?: string;
}

/**
 * Parse API error response
 */
export function parseApiError(error: any): ApiError {
  // Handle fetch errors
  if (error instanceof TypeError) {
    return {
      status: 0,
      message: 'Network error. Please check your connection.',
    };
  }

  // Handle JSON response errors
  if (error.response) {
    const data = error.response.data || error.response;
    return {
      status: error.response.status,
      message: data.message || data.error || 'An error occurred',
      details: data.details || data.fieldErrors,
      timestamp: data.timestamp,
    };
  }

  // Handle error objects
  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message || 'An unexpected error occurred',
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      status: 500,
      message: error,
    };
  }

  return {
    status: 500,
    message: 'An unexpected error occurred',
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: ApiError): string {
  switch (error.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This resource already exists.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 500:
      return 'Server error. Please try again later.';
    case 0:
      return 'Network error. Please check your connection.';
    default:
      return error.message || 'An unexpected error occurred';
  }
}

/**
 * Log error for debugging
 */
export function logError(error: any, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';

  console.error(`[${timestamp}]${contextStr}`, error);

  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTrackingService(error, context);
  }
}

/**
 * Handle async operation with error handling
 */
export async function handleAsync<T>(
  promise: Promise<T>,
  context?: string
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    const apiError = parseApiError(error);
    logError(apiError, context);
    return { data: null, error: apiError };
  }
}

/**
 * Retry async operation with exponential backoff
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (i < maxRetries - 1) {
        const delay = delayMs * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Validate error response structure
 */
export function isApiError(error: any): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof error.status === 'number' &&
    typeof error.message === 'string'
  );
}

/**
 * Get field-specific error message
 */
export function getFieldError(error: ApiError, fieldName: string): string | null {
  if (!error.details || !error.details[fieldName]) {
    return null;
  }

  return error.details[fieldName];
}
