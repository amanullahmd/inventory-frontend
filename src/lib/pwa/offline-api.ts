'use client';

import { addToQueue, OfflineQueueItem } from './offline-queue';

type FeatureType = OfflineQueueItem['feature'];

// Map API endpoints to features
function getFeatureFromEndpoint(endpoint: string): FeatureType {
  if (endpoint.includes('/items')) return 'items';
  if (endpoint.includes('/stock-in') || endpoint.includes('/stock/in')) return 'stock-in';
  if (endpoint.includes('/stock-out') || endpoint.includes('/stock/out')) return 'stock-out';
  if (endpoint.includes('/transfers')) return 'transfers';
  if (endpoint.includes('/demands')) return 'demands';
  if (endpoint.includes('/orders') || endpoint.includes('/purchase') || endpoint.includes('/sales')) return 'orders';
  if (endpoint.includes('/categories')) return 'categories';
  if (endpoint.includes('/suppliers')) return 'suppliers';
  return 'items'; // default
}

// Check if we're online
function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

// Offline-aware fetch wrapper for write operations
export async function offlineFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = (options.method || 'GET').toUpperCase();
  
  // For GET requests, just use regular fetch
  if (method === 'GET') {
    return fetch(endpoint, options);
  }

  // For write operations, check if online
  if (isOnline()) {
    try {
      const response = await fetch(endpoint, options);
      return response;
    } catch (error) {
      // Network error - queue the request
      if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        return queueRequest(endpoint, method as 'POST' | 'PUT' | 'DELETE', options);
      }
      throw error;
    }
  }

  // Offline - queue the request
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    return queueRequest(endpoint, method, options);
  }

  throw new Error('Network unavailable');
}

// Queue a request for later sync
async function queueRequest(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE',
  options: RequestInit
): Promise<Response> {
  const headers: Record<string, string> = {};
  
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  // Parse body
  let body: unknown = null;
  if (options.body) {
    if (typeof options.body === 'string') {
      try {
        body = JSON.parse(options.body);
      } catch {
        body = options.body;
      }
    } else {
      body = options.body;
    }
  }

  const feature = getFeatureFromEndpoint(endpoint);
  const queueId = await addToQueue(endpoint, method, body, headers, feature);

  // Return a fake successful response indicating the request was queued
  return new Response(
    JSON.stringify({
      queued: true,
      queueId,
      message: 'Request queued for sync when online',
    }),
    {
      status: 202, // Accepted
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Helper to check if a response was queued
export function isQueuedResponse(response: Response): boolean {
  return response.status === 202;
}

// Parse queued response
export async function parseQueuedResponse(response: Response): Promise<{
  queued: boolean;
  queueId: string;
  message: string;
}> {
  return response.json();
}
