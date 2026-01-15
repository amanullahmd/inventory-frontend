'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface CachedDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  isStale: boolean;
  isOffline: boolean;
}

interface UseCachedDataOptions<T> {
  cacheKey: string;
  fetchFn: () => Promise<T>;
  staleTime?: number; // milliseconds before data is considered stale
  enabled?: boolean;
}

const CACHE_PREFIX = 'cached-data-';

// Get cached data from localStorage
function getCachedData<T>(key: string): { data: T; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('[useCachedData] Failed to read cache:', error);
  }
  return null;
}

// Set cached data in localStorage
function setCachedData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch (error) {
    console.error('[useCachedData] Failed to write cache:', error);
  }
}

export function useCachedData<T>({
  cacheKey,
  fetchFn,
  staleTime = 5 * 60 * 1000, // 5 minutes default
  enabled = true,
}: UseCachedDataOptions<T>): CachedDataState<T> & {
  refetch: () => Promise<void>;
} {
  const [state, setState] = useState<CachedDataState<T>>({
    data: null,
    isLoading: true,
    error: null,
    lastUpdated: null,
    isStale: false,
    isOffline: false,
  });
  
  const mountedRef = useRef(true);

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      if (mountedRef.current) {
        setState((prev) => ({ ...prev, isOffline: false }));
      }
    };
    
    const handleOffline = () => {
      if (mountedRef.current) {
        setState((prev) => ({ ...prev, isOffline: true }));
      }
    };

    setState((prev) => ({ ...prev, isOffline: !navigator.onLine }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch data with caching
  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Try to get cached data first
    const cached = getCachedData<T>(cacheKey);
    if (cached) {
      const isStale = Date.now() - cached.timestamp > staleTime;
      setState((prev) => ({
        ...prev,
        data: cached.data,
        lastUpdated: new Date(cached.timestamp),
        isStale,
        isLoading: !isStale, // Keep loading if stale (will fetch fresh)
      }));
      
      // If not stale and we have data, we're done
      if (!isStale) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }
    }

    // Fetch fresh data
    try {
      const freshData = await fetchFn();
      
      if (mountedRef.current) {
        setCachedData(cacheKey, freshData);
        setState({
          data: freshData,
          isLoading: false,
          error: null,
          lastUpdated: new Date(),
          isStale: false,
          isOffline: !navigator.onLine,
        });
      }
    } catch (error) {
      if (mountedRef.current) {
        // If we have cached data, use it even if fetch failed
        if (cached) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isStale: true,
            error: error instanceof Error ? error : new Error('Fetch failed'),
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Fetch failed'),
          }));
        }
      }
    }
  }, [cacheKey, fetchFn, staleTime, enabled]);

  // Initial fetch
  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  // Auto-refresh when coming back online
  useEffect(() => {
    if (!state.isOffline && state.isStale) {
      fetchData();
    }
  }, [state.isOffline, state.isStale, fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Format relative time for "last updated" display
export function formatLastUpdated(date: Date | null): string {
  if (!date) return 'Never';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  
  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}
