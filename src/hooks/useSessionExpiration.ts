'use client';

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

interface UseSessionExpirationOptions {
  checkInterval?: number; // in milliseconds
  warningThreshold?: number; // in milliseconds before expiry to show warning
  onExpired?: () => void;
  onWarning?: (timeLeft: number) => void;
}

export const useSessionExpiration = (options: UseSessionExpirationOptions = {}) => {
  const { data: session, status } = useSession();
  const {
    checkInterval = 60000, // Check every minute
    warningThreshold = 300000, // Warn 5 minutes before expiry
    onExpired,
    onWarning,
  } = options;

  const checkSessionExpiration = useCallback(() => {
    if (!session?.expires) return;

    const now = new Date().getTime();
    const expiryTime = new Date(session.expires).getTime();
    const timeLeft = expiryTime - now;

    // Session has expired
    if (timeLeft <= 0) {
      console.log('Session expired, signing out...');
      if (onExpired) {
        onExpired();
      } else {
        // Default behavior: sign out and redirect to login
        signOut({ callbackUrl: '/auth/signin' });
      }
      return;
    }

    // Session is about to expire
    if (timeLeft <= warningThreshold && onWarning) {
      onWarning(timeLeft);
    }
  }, [session, warningThreshold, onExpired, onWarning]);

  useEffect(() => {
    if (status !== 'authenticated' || !session) {
      return;
    }

    // Initial check
    checkSessionExpiration();

    // Set up interval to check session expiration
    const interval = setInterval(checkSessionExpiration, checkInterval);

    return () => {
      clearInterval(interval);
    };
  }, [session, status, checkInterval, checkSessionExpiration]);

  // Utility function to get time left until expiration
  const getTimeUntilExpiration = useCallback(() => {
    if (!session?.expires) return null;
    
    const now = new Date().getTime();
    const expiryTime = new Date(session.expires).getTime();
    return Math.max(0, expiryTime - now);
  }, [session]);

  // Utility function to check if session is about to expire
  const isSessionNearExpiry = useCallback(() => {
    const timeLeft = getTimeUntilExpiration();
    return timeLeft !== null && timeLeft <= warningThreshold;
  }, [getTimeUntilExpiration, warningThreshold]);

  return {
    isSessionNearExpiry: isSessionNearExpiry(),
    timeUntilExpiration: getTimeUntilExpiration(),
    checkSessionExpiration,
  };
};

export default useSessionExpiration;