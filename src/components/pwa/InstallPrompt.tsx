'use client';

import { Download, X } from 'lucide-react';

interface InstallPromptProps {
  isVisible: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallPrompt({ isVisible, onInstall, onDismiss }: InstallPromptProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-lg bg-white p-4 shadow-xl border border-gray-200 md:left-auto md:right-4 md:w-80"
      role="dialog"
      aria-labelledby="install-prompt-title"
      aria-describedby="install-prompt-description"
    >
      <button
        onClick={onDismiss}
        className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="Dismiss install prompt"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
          <Download className="h-5 w-5 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <h3 id="install-prompt-title" className="font-semibold text-gray-900">
            Install App
          </h3>
          <p id="install-prompt-description" className="mt-1 text-sm text-gray-500">
            Install DPE Store Management for quick access and offline support.
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onDismiss}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Not now
        </button>
        <button
          onClick={onInstall}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Install
        </button>
      </div>
    </div>
  );
}
