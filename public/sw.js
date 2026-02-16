// Service Worker for Store Management System PWA
// Version: 1.1.0

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `inventory-static-${CACHE_VERSION}`;
const API_CACHE = `inventory-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `inventory-images-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `inventory-dynamic-${CACHE_VERSION}`;

// Resources to precache (app shell)
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
];

// Cache size limits
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_API_CACHE_SIZE = 100;
const MAX_IMAGE_CACHE_SIZE = 60;
const NETWORK_TIMEOUT = 10000;

// API Caching Rules - feature-specific strategies
const API_CACHE_RULES = {
  // Read-heavy endpoints - Stale While Revalidate (fast reads, background updates)
  '/api/items': { strategy: 'staleWhileRevalidate', maxAge: 300 },
  '/api/categories': { strategy: 'staleWhileRevalidate', maxAge: 600 },
  '/api/suppliers': { strategy: 'staleWhileRevalidate', maxAge: 600 },
  '/api/warehouses': { strategy: 'staleWhileRevalidate', maxAge: 600 },
  '/api/employees': { strategy: 'staleWhileRevalidate', maxAge: 600 },
  '/api/grades': { strategy: 'staleWhileRevalidate', maxAge: 3600 },
  
  // Transaction endpoints - Network First (need fresh data, cache fallback)
  '/api/stock': { strategy: 'networkFirst', maxAge: 60 },
  '/api/stock-movements': { strategy: 'networkFirst', maxAge: 60 },
  '/api/transfers': { strategy: 'networkFirst', maxAge: 60 },
  '/api/demands': { strategy: 'networkFirst', maxAge: 60 },
  '/api/purchase-orders': { strategy: 'networkFirst', maxAge: 60 },
  '/api/sales-orders': { strategy: 'networkFirst', maxAge: 60 },
  '/api/statistics': { strategy: 'networkFirst', maxAge: 60 },
  
  // Reports - Cache First (data doesn't change frequently)
  '/api/reports': { strategy: 'cacheFirst', maxAge: 1800 },
  
  // Auth endpoints - Never cache
  '/api/auth': { strategy: 'networkOnly', maxAge: 0 },
  
  // User management - Network First
  '/api/users': { strategy: 'networkFirst', maxAge: 300 },
  
  // Settings - Stale While Revalidate
  '/api/settings': { strategy: 'staleWhileRevalidate', maxAge: 600 },
};

// Installation
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((n) => n.startsWith('inventory-') && !n.includes(CACHE_VERSION))
          .map((n) => caches.delete(n))
      );
    }).then(() => self.clients.claim())
  );
});

// Get caching rule for an API endpoint
function getApiCacheRule(pathname) {
  for (const [pattern, rule] of Object.entries(API_CACHE_RULES)) {
    if (pathname.startsWith(pattern)) {
      return rule;
    }
  }
  return { strategy: 'networkFirst', maxAge: 300 }; // default
}

// Fetch handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GET requests over HTTP(S)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;
  
  // API requests - use feature-specific caching
  if (url.pathname.startsWith('/api/')) {
    const rule = getApiCacheRule(url.pathname);
    
    switch (rule.strategy) {
      case 'networkOnly':
        return; // Let browser handle it
      case 'cacheFirst':
        event.respondWith(cacheFirst(request, API_CACHE));
        break;
      case 'staleWhileRevalidate':
        event.respondWith(staleWhileRevalidate(request, API_CACHE));
        break;
      case 'networkFirst':
      default:
        event.respondWith(networkFirst(request, API_CACHE));
        break;
    }
    return;
  }
  
  // Images and icons - Cache First
  if (request.destination === 'image' || url.pathname.includes('/icons/')) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }
  
  // Navigation requests - with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(navigationHandler(request));
    return;
  }
  
  // Everything else - Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// Cache First strategy - best for static assets
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    throw e;
  }
}

// Network First strategy - best for dynamic data
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), NETWORK_TIMEOUT);
    
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await cache.match(request);
    if (cached) {
      console.log('[SW] Serving from cache:', request.url);
      return cached;
    }
    throw e;
  }
}

// Stale While Revalidate - best for frequently updated content
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Start network fetch in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch((e) => {
    console.log('[SW] Background fetch failed:', e.message);
    return null;
  });
  
  // Return cached immediately if available, otherwise wait for network
  if (cached) {
    return cached;
  }
  
  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }
  
  throw new Error('No cached response and network failed');
}

// Navigation handler with offline fallback
async function navigationHandler(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    // Try to serve cached page
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    
    // Fallback to offline page
    const offlinePage = await caches.match('/offline') || await caches.match('/offline.html');
    if (offlinePage) return offlinePage;
    
    // Last resort - return a basic offline response
    return new Response('You are offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Limit cache size
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxSize) {
    await cache.delete(keys[0]);
    limitCacheSize(cacheName, maxSize);
  }
}

// Message handling
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.filter((n) => n.startsWith('inventory-')).forEach((n) => caches.delete(n));
    });
  }
  
  if (event.data?.type === 'CLEAR_USER_CACHE') {
    // Clear user-specific cached data on logout
    caches.open(API_CACHE).then((cache) => {
      cache.keys().then((keys) => {
        keys.forEach((key) => {
          const url = new URL(key.url);
          // Clear user-specific endpoints
          if (url.pathname.includes('/users/me') || 
              url.pathname.includes('/profile') ||
              url.pathname.includes('/settings')) {
            cache.delete(key);
          }
        });
      });
    });
  }
});

// Background sync for offline queue
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-queue') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((c) => c.postMessage({ type: 'SYNC_STARTED' }));
      }).then(() => {
        // The actual sync is handled by the client-side offline-queue.ts
        // This just notifies clients that sync should happen
        return self.clients.matchAll().then((clients) => {
          clients.forEach((c) => c.postMessage({ type: 'TRIGGER_SYNC' }));
        });
      })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sync-inventory-data') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((c) => c.postMessage({ type: 'PERIODIC_SYNC' }));
      })
    );
  }
});

console.log('[SW] Loaded - version:', CACHE_VERSION);
