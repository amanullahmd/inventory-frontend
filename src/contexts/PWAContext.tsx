'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface PWAContextValue {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
  isUpdateAvailable: boolean;
  installApp: () => Promise<void>;
  updateApp: () => void;
  dismissInstallPrompt: () => void;
  pendingSyncCount: number;
  lastSyncTime: Date | null;
  triggerSync: () => Promise<void>;
}

const defaultValue: PWAContextValue = {
  isInstalled: false,
  isInstallable: false,
  isOffline: false,
  isUpdateAvailable: false,
  installApp: async () => {},
  updateApp: () => {},
  dismissInstallPrompt: () => {},
  pendingSyncCount: 0,
  lastSyncTime: null,
  triggerSync: async () => {},
};

export const PWAContext = createContext<PWAContextValue>(defaultValue);

export function usePWA(): PWAContextValue {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}

export interface PWAProviderProps {
  children: ReactNode;
}
