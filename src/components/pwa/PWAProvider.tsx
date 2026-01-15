'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { PWAContext, PWAContextValue } from '@/contexts/PWAContext';
import { 
  registerServiceWorker, 
  skipWaiting, 
  shouldRegisterServiceWorker 
} from '@/lib/pwa/register-sw';
import { PWA_CONFIG } from '@/lib/pwa/constants';
import { OfflineIndicator } from './OfflineIndicator';
import { InstallPrompt } from './InstallPrompt';
import { UpdateNotification } from './UpdateNotification';
import { SyncStatus } from './SyncStatus';
import { getPendingCount, processQueue } from '@/lib/pwa/offline-queue';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAProviderProps {
  children: ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  // State
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Check if app is already installed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check display mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Check iOS standalone
      const isIOSStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
      
      setIsInstalled(isStandalone || isIOSStandalone);
      setIsOffline(!navigator.onLine);
    }
  }, []);

  // Register service worker
  useEffect(() => {
    if (shouldRegisterServiceWorker()) {
      registerServiceWorker({
        onUpdate: () => {
          console.log('[PWA] Update available');
          setIsUpdateAvailable(true);
        },
        onSuccess: () => {
          console.log('[PWA] Service worker registered successfully');
        },
        onError: (error) => {
          console.error('[PWA] Service worker registration failed:', error);
        },
      });
    }
  }, []);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log('[PWA] Install prompt captured');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      console.log('[PWA] App installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      console.log('[PWA] Back online');
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('[PWA] Gone offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track user interaction for smart install prompt timing
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };

    // Track meaningful interactions
    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, [hasInteracted]);

  // Show install prompt after delay and interaction
  useEffect(() => {
    if (!isInstallable || isInstalled || !hasInteracted) return;

    // Check if user dismissed recently
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const daysSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissal < PWA_CONFIG.INSTALL_PROMPT_DISMISS_DAYS) {
        return;
      }
    }

    // Show prompt after delay
    const timer = setTimeout(() => {
      setShowInstallPrompt(true);
    }, PWA_CONFIG.INSTALL_PROMPT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, hasInteracted]);

  // Install app
  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('[PWA] No deferred prompt available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('[PWA] Install prompt outcome:', outcome);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('[PWA] Install failed:', error);
    }
  }, [deferredPrompt]);

  // Update app
  const updateApp = useCallback(() => {
    skipWaiting();
    setIsUpdateAvailable(false);
    window.location.reload();
  }, []);

  // Dismiss install prompt
  const dismissInstallPrompt = useCallback(() => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  }, []);

  // Trigger manual sync
  const triggerSync = useCallback(async () => {
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register('sync-offline-queue');
        console.log('[PWA] Sync triggered');
      } catch (error) {
        console.error('[PWA] Sync trigger failed:', error);
      }
    }
  }, []);

  // Listen for sync messages from service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'SYNC_COMPLETED') {
          setLastSyncTime(new Date());
          setPendingSyncCount(0);
        } else if (event.data.type === 'SYNC_STARTED') {
          console.log('[PWA] Sync started');
        } else if (event.data.type === 'SYNC_FAILED') {
          console.error('[PWA] Sync failed:', event.data.error);
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  // Update pending sync count periodically
  useEffect(() => {
    const updatePendingCount = async () => {
      try {
        const count = await getPendingCount();
        setPendingSyncCount(count);
      } catch (error) {
        console.error('[PWA] Failed to get pending count:', error);
      }
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOffline && pendingSyncCount > 0) {
      processQueue().then((result) => {
        console.log('[PWA] Auto-sync result:', result);
        setLastSyncTime(new Date());
      }).catch((error) => {
        console.error('[PWA] Auto-sync failed:', error);
      });
    }
  }, [isOffline, pendingSyncCount]);

  const contextValue: PWAContextValue = {
    isInstalled,
    isInstallable,
    isOffline,
    isUpdateAvailable,
    installApp,
    updateApp,
    dismissInstallPrompt,
    pendingSyncCount,
    lastSyncTime,
    triggerSync,
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
      
      {/* PWA UI Components */}
      <OfflineIndicator isOffline={isOffline} />
      
      <InstallPrompt
        isVisible={showInstallPrompt && !isInstalled}
        onInstall={installApp}
        onDismiss={dismissInstallPrompt}
      />
      
      <UpdateNotification
        isVisible={isUpdateAvailable}
        onUpdate={updateApp}
        onDismiss={() => setIsUpdateAvailable(false)}
      />
      
      <SyncStatus isOffline={isOffline} />
    </PWAContext.Provider>
  );
}
