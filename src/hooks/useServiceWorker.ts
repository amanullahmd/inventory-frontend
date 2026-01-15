'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  registerServiceWorker, 
  unregisterServiceWorker,
  checkForUpdates,
  skipWaiting,
  shouldRegisterServiceWorker 
} from '@/lib/pwa/register-sw';

export interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
  error: Error | null;
}

export interface UseServiceWorkerReturn extends ServiceWorkerState {
  update: () => Promise<void>;
  unregister: () => Promise<boolean>;
  checkForUpdate: () => Promise<void>;
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isUpdateAvailable: false,
    registration: null,
    error: null,
  });

  // Check support on mount
  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator;
    setState((prev) => ({ ...prev, isSupported }));
  }, []);

  // Register service worker
  useEffect(() => {
    if (!shouldRegisterServiceWorker()) {
      return;
    }

    registerServiceWorker({
      onSuccess: (registration) => {
        setState((prev) => ({
          ...prev,
          isRegistered: true,
          registration,
          error: null,
        }));
      },
      onUpdate: (registration) => {
        setState((prev) => ({
          ...prev,
          isUpdateAvailable: true,
          registration,
        }));
      },
      onError: (error) => {
        setState((prev) => ({
          ...prev,
          isRegistered: false,
          error,
        }));
      },
    });
  }, []);

  // Update service worker
  const update = useCallback(async () => {
    await skipWaiting();
    setState((prev) => ({ ...prev, isUpdateAvailable: false }));
    window.location.reload();
  }, []);

  // Unregister service worker
  const unregister = useCallback(async () => {
    const result = await unregisterServiceWorker();
    if (result) {
      setState((prev) => ({
        ...prev,
        isRegistered: false,
        registration: null,
      }));
    }
    return result;
  }, []);

  // Check for updates
  const checkForUpdate = useCallback(async () => {
    await checkForUpdates();
  }, []);

  return {
    ...state,
    update,
    unregister,
    checkForUpdate,
  };
}
