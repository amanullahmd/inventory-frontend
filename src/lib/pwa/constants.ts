// PWA Constants
export const PWA_CONFIG = {
  // Cache names with versions for proper invalidation
  CACHE_VERSION: 'v1',
  STATIC_CACHE_NAME: 'inventory-static-v1',
  DYNAMIC_CACHE_NAME: 'inventory-dynamic-v1',
  API_CACHE_NAME: 'inventory-api-v1',
  IMAGE_CACHE_NAME: 'inventory-images-v1',
  
  // Cache limits
  MAX_DYNAMIC_CACHE_SIZE: 50,
  MAX_API_CACHE_SIZE: 100,
  MAX_IMAGE_CACHE_SIZE: 60,
  
  // Cache expiration (in seconds)
  API_CACHE_MAX_AGE: 3600, // 1 hour
  STATIC_CACHE_MAX_AGE: 86400 * 30, // 30 days
  IMAGE_CACHE_MAX_AGE: 86400 * 7, // 7 days
  
  // Network timeout (in seconds)
  NETWORK_TIMEOUT: 10,
  
  // Install prompt settings
  INSTALL_PROMPT_DELAY_MS: 30000, // 30 seconds
  INSTALL_PROMPT_DISMISS_DAYS: 7,
  
  // Offline queue settings
  OFFLINE_QUEUE_DB_NAME: 'inventory-offline-queue',
  OFFLINE_QUEUE_STORE_NAME: 'requests',
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY_MS: 1000,
} as const;

// API endpoints and their caching strategies
export const API_CACHE_RULES = {
  // Read-heavy endpoints - Stale While Revalidate
  '/api/items': { strategy: 'StaleWhileRevalidate', maxAge: 300 },
  '/api/categories': { strategy: 'StaleWhileRevalidate', maxAge: 600 },
  '/api/suppliers': { strategy: 'StaleWhileRevalidate', maxAge: 600 },
  '/api/warehouses': { strategy: 'StaleWhileRevalidate', maxAge: 600 },
  '/api/employees': { strategy: 'StaleWhileRevalidate', maxAge: 600 },
  '/api/grades': { strategy: 'StaleWhileRevalidate', maxAge: 3600 },
  
  // Transaction endpoints - Network First
  '/api/stock': { strategy: 'NetworkFirst', maxAge: 60 },
  '/api/stock-movements': { strategy: 'NetworkFirst', maxAge: 60 },
  '/api/transfers': { strategy: 'NetworkFirst', maxAge: 60 },
  '/api/demands': { strategy: 'NetworkFirst', maxAge: 60 },
  '/api/purchase-orders': { strategy: 'NetworkFirst', maxAge: 60 },
  '/api/sales-orders': { strategy: 'NetworkFirst', maxAge: 60 },
  
  // Reports - Cache First
  '/api/reports': { strategy: 'CacheFirst', maxAge: 1800 },
  
  // Auth endpoints - Never cache
  '/api/auth': { strategy: 'NetworkOnly', maxAge: 0 },
  
  // User management - Network First
  '/api/users': { strategy: 'NetworkFirst', maxAge: 300 },
} as const;

// Precache URLs for app shell
export const PRECACHE_URLS = [
  '/',
  '/items',
  '/stock-in',
  '/stock-out',
  '/categories',
  '/suppliers',
  '/warehouses',
  '/offline',
] as const;

// Routes that should never be cached
export const NO_CACHE_ROUTES = [
  '/api/auth',
  '/auth/signin',
  '/auth/signup',
] as const;
