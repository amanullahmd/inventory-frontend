'use client';

import { RefreshCw, X } from 'lucide-react';

interface UpdateNotificationProps {
  isVisible: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export function UpdateNotification({ isVisible, onUpdate, onDismiss }: UpdateNotificationProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-white shadow-lg"
      role="alert"
      aria-live="polite"
    >
      <RefreshCw className="h-5 w-5" />
      
      <div className="flex-1">
        <p className="text-sm font-medium">Update available</p>
        <p className="text-xs text-blue-100">A new version is ready to install.</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onUpdate}
          className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          Update
        </button>
        <button
          onClick={onDismiss}
          className="rounded-full p-1 text-blue-200 hover:bg-blue-500 hover:text-white"
          aria-label="Dismiss update notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
