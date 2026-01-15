'use client';

import { Workbox, messageSW } from 'workbox-window';

export interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

let wb: Workbox | null = null;

export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function shouldRegisterServiceWorker(): boolean {
  // Register in production or when explicitly enabled
  const forceEnable = process.env.NEXT_PUBLIC_ENABLE_SW === 'true';
  return isServiceWorkerSupported() && (isProduction() || forceEnable);
}

export async function registerServiceWorker(
  config: ServiceWorkerConfig = {}
): Promise<ServiceWorkerRegistration | null> {
  if (!shouldRegisterServiceWorker()) {
    console.log('[PWA] Service worker registration skipped (not supported or not production)');
    return null;
  }

  try {
    wb = new Workbox('/sw.js');

    // Handle waiting service worker (update available)
    wb.addEventListener('waiting', () => {
      console.log('[PWA] New service worker waiting to activate');
      
      // Get the registration and notify about update
      wb?.getSW().then((sw) => {
        if (sw && config.onUpdate) {
          navigator.serviceWorker.ready.then((registration) => {
            config.onUpdate?.(registration);
          });
        }
      });
    });

    // Handle successful activation
    wb.addEventListener('activated', (event) => {
      console.log('[PWA] Service worker activated');
      if (!event.isUpdate && config.onSuccess) {
        navigator.serviceWorker.ready.then((registration) => {
          config.onSuccess?.(registration);
        });
      }
    });

    // Handle controller change (new SW took over)
    wb.addEventListener('controlling', () => {
      console.log('[PWA] Service worker is now controlling the page');
    });

    // Register the service worker
    const registration = await wb.register();
    console.log('[PWA] Service worker registered successfully');
    
    return registration ?? null;
  } catch (error) {
    console.error('[PWA] Service worker registration failed:', error);
    config.onError?.(error as Error);
    return null;
  }
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const result = await registration.unregister();
    console.log('[PWA] Service worker unregistered:', result);
    return result;
  } catch (error) {
    console.error('[PWA] Failed to unregister service worker:', error);
    return false;
  }
}

export async function skipWaiting(): Promise<void> {
  if (wb) {
    const sw = await wb.getSW();
    if (sw) {
      messageSW(sw, { type: 'SKIP_WAITING' });
    }
  }
}

export async function checkForUpdates(): Promise<void> {
  if (!isServiceWorkerSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    console.log('[PWA] Checked for service worker updates');
  } catch (error) {
    console.error('[PWA] Failed to check for updates:', error);
  }
}

export function getWorkbox(): Workbox | null {
  return wb;
}
