'use client';

import { useState, useEffect, useCallback } from 'react';
import { PWA_CONFIG } from '@/lib/pwa/constants';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UseInstallPromptReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  isDismissed: boolean;
  canShowPrompt: boolean;
  promptInstall: () => Promise<'accepted' | 'dismissed' | null>;
  dismissPrompt: () => void;
}

const DISMISS_STORAGE_KEY = 'pwa-install-dismissed';

export function useInstallPrompt(): UseInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if app is already installed
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check display mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // Check iOS standalone
    const isIOSStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    
    setIsInstalled(isStandalone || isIOSStandalone);

    // Check if user dismissed recently
    const dismissedAt = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const daysSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      setIsDismissed(daysSinceDismissal < PWA_CONFIG.INSTALL_PROMPT_DISMISS_DAYS);
    }
  }, []);

  // Capture beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Prompt install
  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | null> => {
    if (!deferredPrompt) {
      return null;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      return outcome;
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error);
      return null;
    }
  }, [deferredPrompt]);

  // Dismiss prompt
  const dismissPrompt = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
  }, []);

  const isInstallable = deferredPrompt !== null;
  const canShowPrompt = isInstallable && !isInstalled && !isDismissed;

  return {
    isInstallable,
    isInstalled,
    isDismissed,
    canShowPrompt,
    promptInstall,
    dismissPrompt,
  };
}
