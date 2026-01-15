'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseOnlineStatusReturn {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnlineTime: Date | null;
}

export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial state
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        setLastOnlineTime(new Date());
      }
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
      // Keep wasOffline true for a short period to show "back online" message
      setTimeout(() => setWasOffline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    wasOffline,
    lastOnlineTime,
  };
}
