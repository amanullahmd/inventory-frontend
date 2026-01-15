/**
 * Property-Based Tests for Caching Strategies
 * Feature: pwa-implementation
 * 
 * Properties 3, 4, 5: Caching Strategy Selection, Offline Content Serving, Cache Size Limiting
 * Validates: Requirements 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8
 */

import * as fc from 'fast-check';

// Types for testing
type CachingStrategy = 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate' | 'NetworkOnly';

interface RequestInfo {
  url: string;
  destination: 'image' | 'script' | 'style' | 'document' | 'font' | 'other';
  mode: 'navigate' | 'cors' | 'no-cors' | 'same-origin';
}

// Strategy selection logic (mirrors sw.js)
function selectCachingStrategy(request: RequestInfo): CachingStrategy {
  const url = new URL(request.url, 'https://example.com');
  
  // Auth requests - Network Only
  if (url.pathname.startsWith('/api/auth')) {
    return 'NetworkOnly';
  }
  
  // API requests - Network First
  if (url.pathname.startsWith('/api/')) {
    return 'NetworkFirst';
  }
  
  // Images and icons - Cache First
  if (request.destination === 'image' || url.pathname.includes('/icons/')) {
    return 'CacheFirst';
  }
  
  // Static assets (fonts, scripts, styles) - Cache First
  if (['font', 'script', 'style'].includes(request.destination)) {
    return 'CacheFirst';
  }
  
  // Navigation - Network First (with offline fallback)
  if (request.mode === 'navigate') {
    return 'NetworkFirst';
  }
  
  // Everything else - Stale While Revalidate
  return 'StaleWhileRevalidate';
}

// Cache size limiter logic
function limitCacheSize<T>(cache: T[], maxSize: number): T[] {
  if (cache.length <= maxSize) {
    return cache;
  }
  // LRU eviction - remove oldest entries
  return cache.slice(cache.length - maxSize);
}

describe('Caching Strategy Properties', () => {
  /**
   * Property 3: Caching Strategy Selection
   * 
   * For any network request intercepted by the service worker, the correct 
   * caching strategy SHALL be applied based on request type.
   * 
   * Validates: Requirements 3.2, 3.3, 3.4
   */
  describe('Property 3: Caching Strategy Selection', () => {
    // Arbitraries for generating test data
    const apiPathArb = fc.constantFrom(
      '/api/items',
      '/api/categories',
      '/api/suppliers',
      '/api/stock',
      '/api/users',
      '/api/reports'
    );

    const authPathArb = fc.constantFrom(
      '/api/auth/login',
      '/api/auth/logout',
      '/api/auth/refresh'
    );

    const staticPathArb = fc.constantFrom(
      '/icons/icon-192x192.svg',
      '/icons/icon-512x512.svg',
      '/images/logo.png',
      '/_next/static/chunks/main.js',
      '/_next/static/css/styles.css'
    );

    it('should select NetworkOnly for auth requests', () => {
      fc.assert(
        fc.property(authPathArb, (path) => {
          const request: RequestInfo = {
            url: `https://example.com${path}`,
            destination: 'other',
            mode: 'cors',
          };
          
          const strategy = selectCachingStrategy(request);
          expect(strategy).toBe('NetworkOnly');
        }),
        { numRuns: 100 }
      );
    });

    it('should select NetworkFirst for API requests (non-auth)', () => {
      fc.assert(
        fc.property(apiPathArb, (path) => {
          const request: RequestInfo = {
            url: `https://example.com${path}`,
            destination: 'other',
            mode: 'cors',
          };
          
          const strategy = selectCachingStrategy(request);
          expect(strategy).toBe('NetworkFirst');
        }),
        { numRuns: 100 }
      );
    });

    it('should select CacheFirst for image requests', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/images/photo.jpg', '/icons/icon.svg', '/assets/bg.png'),
          (path) => {
            const request: RequestInfo = {
              url: `https://example.com${path}`,
              destination: 'image',
              mode: 'no-cors',
            };
            
            const strategy = selectCachingStrategy(request);
            expect(strategy).toBe('CacheFirst');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should select CacheFirst for font requests', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/fonts/roboto.woff2', '/fonts/inter.ttf'),
          (path) => {
            const request: RequestInfo = {
              url: `https://example.com${path}`,
              destination: 'font',
              mode: 'cors',
            };
            
            const strategy = selectCachingStrategy(request);
            expect(strategy).toBe('CacheFirst');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should select NetworkFirst for navigation requests', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/', '/items', '/stock-in', '/categories'),
          (path) => {
            const request: RequestInfo = {
              url: `https://example.com${path}`,
              destination: 'document',
              mode: 'navigate',
            };
            
            const strategy = selectCachingStrategy(request);
            expect(strategy).toBe('NetworkFirst');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 4: Offline Content Serving
   * 
   * For any previously cached resource, when the device is offline, the service 
   * worker SHALL return the cached response.
   * 
   * Validates: Requirements 3.5, 3.6
   */
  describe('Property 4: Offline Content Serving', () => {
    // Simulate cache behavior
    interface CacheEntry {
      url: string;
      response: string;
    }

    function getCachedResponse(
      cache: CacheEntry[],
      url: string,
      isOffline: boolean
    ): string | null {
      const entry = cache.find((e) => e.url === url);
      
      if (isOffline) {
        // When offline, return cached response or null
        return entry?.response || null;
      }
      
      // When online, we'd normally try network first
      // For this test, we simulate the cache fallback behavior
      return entry?.response || null;
    }

    it('should return cached response when offline and cache exists', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              url: fc.webUrl(),
              response: fc.string({ minLength: 1 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          fc.nat({ max: 9 }),
          (cache, index) => {
            const safeIndex = index % cache.length;
            const targetUrl = cache[safeIndex].url;
            
            const response = getCachedResponse(cache, targetUrl, true);
            
            // Property: Cached response should be returned when offline
            expect(response).toBe(cache[safeIndex].response);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return null when offline and no cache exists', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              url: fc.webUrl(),
              response: fc.string({ minLength: 1 }),
            }),
            { minLength: 0, maxLength: 5 }
          ),
          (cache) => {
            const uncachedUrl = 'https://example.com/uncached-resource';
            
            // Ensure URL is not in cache
            const filteredCache = cache.filter((e) => e.url !== uncachedUrl);
            
            const response = getCachedResponse(filteredCache, uncachedUrl, true);
            
            // Property: Should return null for uncached resources when offline
            expect(response).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 5: Cache Size Limiting
   * 
   * For any cache storage, the number of entries SHALL never exceed the 
   * configured maximum (maxEntries).
   * 
   * Validates: Requirements 3.7, 3.8
   */
  describe('Property 5: Cache Size Limiting', () => {
    it('should never exceed max cache size', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 0, maxLength: 200 }),
          fc.integer({ min: 1, max: 100 }),
          (entries, maxSize) => {
            const limitedCache = limitCacheSize(entries, maxSize);
            
            // Property: Cache size should never exceed maxSize
            expect(limitedCache.length).toBeLessThanOrEqual(maxSize);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve most recent entries when limiting', () => {
      fc.assert(
        fc.property(
          fc.array(fc.nat(), { minLength: 10, maxLength: 50 }),
          fc.integer({ min: 1, max: 9 }),
          (entries, maxSize) => {
            const limitedCache = limitCacheSize(entries, maxSize);
            
            // Property: Most recent entries (last ones) should be preserved
            const expectedEntries = entries.slice(entries.length - maxSize);
            expect(limitedCache).toEqual(expectedEntries);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not modify cache if under limit', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 0, maxLength: 10 }),
          fc.integer({ min: 11, max: 100 }),
          (entries, maxSize) => {
            const limitedCache = limitCacheSize(entries, maxSize);
            
            // Property: Cache should be unchanged if under limit
            expect(limitedCache).toEqual(entries);
            expect(limitedCache.length).toBe(entries.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
