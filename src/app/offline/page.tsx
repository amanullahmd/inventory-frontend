'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

export default function OfflinePage() {
  // Auto-reload when back online
  useEffect(() => {
    const handleOnline = () => {
      window.location.href = '/';
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <WifiOff className="h-10 w-10 text-amber-500" />
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900">You&apos;re Offline</h1>

        <p className="mb-6 text-gray-600">
          It looks like you&apos;ve lost your internet connection. Some features may not be
          available until you&apos;re back online.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          <RefreshCw className="h-5 w-5" />
          Try Again
        </button>

        <div className="mt-8 border-t border-gray-200 pt-6 text-left">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            While you&apos;re offline
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-primary-foreground">•</span>
              Previously viewed pages may still be available
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-foreground">•</span>
              Changes you make will sync when you&apos;re back online
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-foreground">•</span>
              Check your Wi-Fi or mobile data connection
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
