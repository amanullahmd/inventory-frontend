'use client';

import { get, set, del, keys } from 'idb-keyval';
import { PWA_CONFIG } from './constants';

export interface OfflineQueueItem {
  id: string;
  timestamp: number;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  body: unknown;
  headers: Record<string, string>;
  retryCount: number;
  maxRetries: number;
  feature: 'items' | 'stock-in' | 'stock-out' | 'transfers' | 'demands' | 'orders' | 'categories' | 'suppliers';
  status: 'pending' | 'syncing' | 'failed' | 'completed';
}

const QUEUE_PREFIX = 'offline-queue-';

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// Add item to offline queue
export async function addToQueue(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body: unknown,
  headers: Record<string, string>,
  feature: OfflineQueueItem['feature']
): Promise<string> {
  const id = generateId();
  const item: OfflineQueueItem = {
    id,
    timestamp: Date.now(),
    endpoint,
    method,
    body,
    headers,
    retryCount: 0,
    maxRetries: PWA_CONFIG.MAX_RETRY_COUNT,
    feature,
    status: 'pending',
  };

  await set(`${QUEUE_PREFIX}${id}`, item);
  console.log('[OfflineQueue] Added item:', id);
  
  return id;
}

// Get all queued items
export async function getQueuedItems(): Promise<OfflineQueueItem[]> {
  const allKeys = await keys();
  const queueKeys = allKeys.filter((key) => 
    typeof key === 'string' && key.startsWith(QUEUE_PREFIX)
  );

  const items: OfflineQueueItem[] = [];
  for (const key of queueKeys) {
    const item = await get<OfflineQueueItem>(key);
    if (item) {
      items.push(item);
    }
  }

  // Sort by timestamp (oldest first)
  return items.sort((a, b) => a.timestamp - b.timestamp);
}

// Get pending items count
export async function getPendingCount(): Promise<number> {
  const items = await getQueuedItems();
  return items.filter((item) => item.status === 'pending').length;
}

// Update item status
export async function updateItemStatus(
  id: string,
  status: OfflineQueueItem['status'],
  retryCount?: number
): Promise<void> {
  const item = await get<OfflineQueueItem>(`${QUEUE_PREFIX}${id}`);
  if (item) {
    item.status = status;
    if (retryCount !== undefined) {
      item.retryCount = retryCount;
    }
    await set(`${QUEUE_PREFIX}${id}`, item);
  }
}

// Remove item from queue
export async function removeFromQueue(id: string): Promise<void> {
  await del(`${QUEUE_PREFIX}${id}`);
  console.log('[OfflineQueue] Removed item:', id);
}

// Clear all queued items
export async function clearQueue(): Promise<void> {
  const allKeys = await keys();
  const queueKeys = allKeys.filter((key) => 
    typeof key === 'string' && key.startsWith(QUEUE_PREFIX)
  );

  for (const key of queueKeys) {
    await del(key);
  }
  console.log('[OfflineQueue] Cleared all items');
}

// Process the offline queue
export async function processQueue(): Promise<{
  success: number;
  failed: number;
  remaining: number;
}> {
  const items = await getQueuedItems();
  const pendingItems = items.filter((item) => item.status === 'pending');
  
  let success = 0;
  let failed = 0;

  for (const item of pendingItems) {
    try {
      await updateItemStatus(item.id, 'syncing');
      
      const response = await fetch(item.endpoint, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
          ...item.headers,
        },
        body: item.body ? JSON.stringify(item.body) : undefined,
      });

      if (response.ok) {
        await removeFromQueue(item.id);
        success++;
        console.log('[OfflineQueue] Synced item:', item.id);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('[OfflineQueue] Failed to sync item:', item.id, error);
      
      const newRetryCount = item.retryCount + 1;
      
      if (newRetryCount >= item.maxRetries) {
        await updateItemStatus(item.id, 'failed', newRetryCount);
        failed++;
      } else {
        await updateItemStatus(item.id, 'pending', newRetryCount);
      }
    }
  }

  const remaining = (await getQueuedItems()).filter(
    (item) => item.status === 'pending'
  ).length;

  return { success, failed, remaining };
}

// Retry failed items
export async function retryFailedItems(): Promise<void> {
  const items = await getQueuedItems();
  const failedItems = items.filter((item) => item.status === 'failed');

  for (const item of failedItems) {
    await updateItemStatus(item.id, 'pending', 0);
  }
}

// Get items by feature
export async function getItemsByFeature(
  feature: OfflineQueueItem['feature']
): Promise<OfflineQueueItem[]> {
  const items = await getQueuedItems();
  return items.filter((item) => item.feature === feature);
}
