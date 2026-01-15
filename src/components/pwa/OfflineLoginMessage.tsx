'use client';

import { WifiOff } from 'lucide-react';

interface OfflineLoginMessageProps {
  className?: string;
}

export function OfflineLoginMessage({ className = '' }: OfflineLoginMessageProps) {
  return (
    <div className={`rounded-lg border border-warning/50 bg-warning/10 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <WifiOff className="w-5 h-5 text-warning mt-0.5" />
        <div>
          <h3 className="font-medium text-warning">You&apos;re offline</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in requires an internet connection. Please check your network and try again.
          </p>
        </div>
      </div>
    </div>
  );
}
