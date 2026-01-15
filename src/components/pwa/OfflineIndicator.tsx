'use client';

import { WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
  isOffline: boolean;
  className?: string;
}

export function OfflineIndicator({ isOffline, className = '' }: OfflineIndicatorProps) {
  if (!isOffline) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-white shadow-lg ${className}`}
      role="status"
      aria-live="polite"
    >
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">You are offline</span>
    </div>
  );
}
