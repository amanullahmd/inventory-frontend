'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPendingCount, processQueue, retryFailedItems, getQueuedItems, OfflineQueueItem } from '@/lib/pwa/offline-queue';

interface SyncStatusProps {
  isOffline: boolean;
  className?: string;
}

export function SyncStatus({ isOffline, className = '' }: SyncStatusProps) {
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{ success: number; failed: number } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Refresh counts
  const refreshCounts = useCallback(async () => {
    try {
      const items = await getQueuedItems();
      setPendingCount(items.filter((i: OfflineQueueItem) => i.status === 'pending').length);
      setFailedCount(items.filter((i: OfflineQueueItem) => i.status === 'failed').length);
    } catch (error) {
      console.error('[SyncStatus] Failed to get counts:', error);
    }
  }, []);

  // Initial load and periodic refresh
  useEffect(() => {
    refreshCounts();
    const interval = setInterval(refreshCounts, 5000);
    return () => clearInterval(interval);
  }, [refreshCounts]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOffline && pendingCount > 0) {
      handleSync();
    }
  }, [isOffline, pendingCount]);

  // Manual sync trigger
  const handleSync = async () => {
    if (isSyncing || isOffline) return;

    setIsSyncing(true);
    try {
      const result = await processQueue();
      setLastSyncResult({ success: result.success, failed: result.failed });
      await refreshCounts();

      // Clear result after 3 seconds
      setTimeout(() => setLastSyncResult(null), 3000);
    } catch (error) {
      console.error('[SyncStatus] Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Retry failed items
  const handleRetry = async () => {
    await retryFailedItems();
    await refreshCounts();
    handleSync();
  };

  // Don't show if nothing to sync
  if (pendingCount === 0 && failedCount === 0 && !lastSyncResult) {
    return null;
  }

  return (
    <div className={`fixed bottom-20 right-4 z-40 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[200px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sync Status
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={showDetails ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
        </div>

        {/* Status indicators */}
        <div className="space-y-1">
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-gray-600 dark:text-gray-400">
                {pendingCount} pending
              </span>
            </div>
          )}

          {failedCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-red-600 dark:text-red-400">
                {failedCount} failed
              </span>
            </div>
          )}

          {isSyncing && (
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 animate-spin text-primary-foreground" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-primary-foreground">Syncing...</span>
            </div>
          )}

          {lastSyncResult && (
            <div className="text-sm text-green-600 dark:text-green-400">
              ✓ Synced {lastSyncResult.success} item(s)
              {lastSyncResult.failed > 0 && `, ${lastSyncResult.failed} failed`}
            </div>
          )}
        </div>

        {/* Actions */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <button
              onClick={handleSync}
              disabled={isSyncing || isOffline || pendingCount === 0}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sync Now
            </button>
            {failedCount > 0 && (
              <button
                onClick={handleRetry}
                disabled={isSyncing || isOffline}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-orange-600 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Retry Failed
              </button>
            )}
          </div>
        )}

        {isOffline && pendingCount > 0 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Will sync when online
          </div>
        )}
      </div>
    </div>
  );
}
