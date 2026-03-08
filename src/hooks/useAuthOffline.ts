"use client";

import { useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";

// Clear user-specific cache on logout
export function clearUserCache(): void {
  if (typeof window === "undefined") return;

  // Clear localStorage cached data
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("cached-data-")) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  // Notify service worker to clear user cache
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CLEAR_USER_CACHE",
    });
  }
}

// Hook for handling auth state with offline support
export function useAuthOffline() {
  const { data: session, status } = useSession();

  // Check if session is valid (not expired)
  const isSessionValid = useCallback((): boolean => {
    if (!session) return false;

    // Check if session has expires field
    const expires = (session as { expires?: string }).expires;
    if (expires) {
      const expiresDate = new Date(expires);
      return expiresDate > new Date();
    }

    return true;
  }, [session]);

  // Handle logout with cache clearing
  const handleLogout = useCallback(async () => {
    clearUserCache();
    await signOut({ callbackUrl: `${window.location.origin}/auth/signin` });
  }, []);

  // Check session validity periodically
  useEffect(() => {
    if (status !== "authenticated") return;

    const checkSession = () => {
      if (!isSessionValid()) {
        console.log("[Auth] Session expired");
        // Don't auto-logout, just mark as needing re-auth
      }
    };

    // Check every minute
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [status, isSessionValid]);

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isSessionValid: isSessionValid(),
    logout: handleLogout,
  };
}

// Hook to check if user can access cached data while offline
export function useOfflineAccess() {
  const { data: session, status } = useSession();
  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

  // User can access cached data if:
  // 1. They are authenticated (have a valid session)
  // 2. OR they were previously authenticated (session in loading state but have cached data)
  const canAccessCachedData =
    status === "authenticated" || (status === "loading" && !isOnline);

  return {
    canAccessCachedData,
    isOnline,
    requiresReauth: !isOnline && status === "unauthenticated",
  };
}
