/**
 * Unit tests for Dashboard Offline Behavior
 * Feature: pwa-implementation
 * Validates: Requirements 12.1-12.4
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCachedData, formatLastUpdated } from '@/hooks/useCachedData';
import { DataFreshnessIndicator } from '@/components/pwa/DataFreshnessIndicator';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] || null,
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test component that uses useCachedData
function TestComponent({ fetchFn }: { fetchFn: () => Promise<{ value: number }> }) {
  const { data, isLoading, lastUpdated, isStale, isOffline, refetch } = useCachedData({
    cacheKey: 'test-data',
    fetchFn,
    staleTime: 1000,
  });

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="data">{data?.value ?? 'no-data'}</div>
      <div data-testid="stale">{isStale ? 'stale' : 'fresh'}</div>
      <div data-testid="offline">{isOffline ? 'offline' : 'online'}</div>
      <div data-testid="last-updated">{lastUpdated?.toISOString() ?? 'never'}</div>
      <button onClick={refetch} data-testid="refetch">Refetch</button>
    </div>
  );
}

describe('Dashboard Offline Behavior', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Requirement 12.1: Cache dashboard statistics', () => {
    it('should cache fetched data in localStorage', async () => {
      const fetchFn = jest.fn().mockResolvedValue({ value: 42 });
      
      render(<TestComponent fetchFn={fetchFn} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('data').textContent).toBe('42');
      });

      // Check localStorage has cached data
      const cached = localStorageMock.getItem('cached-data-test-data');
      expect(cached).toBeTruthy();
      
      const parsed = JSON.parse(cached!);
      expect(parsed.data.value).toBe(42);
      expect(parsed.timestamp).toBeDefined();
    });

    it('should return cached data on subsequent loads', async () => {
      // Pre-populate cache
      localStorageMock.setItem('cached-data-test-data', JSON.stringify({
        data: { value: 100 },
        timestamp: Date.now(),
      }));

      const fetchFn = jest.fn().mockResolvedValue({ value: 200 });
      
      render(<TestComponent fetchFn={fetchFn} />);
      
      // Should immediately show cached data
      await waitFor(() => {
        expect(screen.getByTestId('data').textContent).toBe('100');
      });
    });
  });

  describe('Requirement 12.2: Include timestamp with cached data', () => {
    it('should store timestamp with cached data', async () => {
      const fetchFn = jest.fn().mockResolvedValue({ value: 42 });
      
      render(<TestComponent fetchFn={fetchFn} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('data').textContent).toBe('42');
      });

      const cached = JSON.parse(localStorageMock.getItem('cached-data-test-data')!);
      expect(cached.timestamp).toBeGreaterThan(0);
    });

    it('should track lastUpdated date', async () => {
      const fetchFn = jest.fn().mockResolvedValue({ value: 42 });
      
      render(<TestComponent fetchFn={fetchFn} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('last-updated').textContent).not.toBe('never');
      });
    });
  });

  describe('Requirement 12.3: Show data may be outdated when offline', () => {
    it('should mark data as stale when older than staleTime', async () => {
      // Pre-populate cache with old data
      localStorageMock.setItem('cached-data-test-data', JSON.stringify({
        data: { value: 100 },
        timestamp: Date.now() - 5000, // 5 seconds ago (staleTime is 1000ms)
      }));

      const fetchFn = jest.fn().mockRejectedValue(new Error('Network error'));
      
      render(<TestComponent fetchFn={fetchFn} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('stale').textContent).toBe('stale');
      });
    });
  });
});

describe('DataFreshnessIndicator', () => {
  it('should show offline message when offline', () => {
    render(
      <DataFreshnessIndicator
        lastUpdated={new Date()}
        isStale={false}
        isOffline={true}
        onRefresh={() => {}}
      />
    );

    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });

  it('should show stale message when data is stale', () => {
    render(
      <DataFreshnessIndicator
        lastUpdated={new Date()}
        isStale={true}
        isOffline={false}
        onRefresh={() => {}}
      />
    );

    expect(screen.getByText(/outdated/i)).toBeInTheDocument();
  });

  it('should show last updated time when fresh', () => {
    render(
      <DataFreshnessIndicator
        lastUpdated={new Date()}
        isStale={false}
        isOffline={false}
        onRefresh={() => {}}
      />
    );

    expect(screen.getByText(/updated/i)).toBeInTheDocument();
  });

  it('should call onRefresh when refresh button clicked', async () => {
    const onRefresh = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(
      <DataFreshnessIndicator
        lastUpdated={new Date()}
        isStale={false}
        isOffline={false}
        onRefresh={onRefresh}
      />
    );

    const refreshButton = screen.getByTitle('Refresh data');
    await user.click(refreshButton);

    expect(onRefresh).toHaveBeenCalled();
  });

  it('should not show refresh button when offline', () => {
    render(
      <DataFreshnessIndicator
        lastUpdated={new Date()}
        isStale={false}
        isOffline={true}
        onRefresh={() => {}}
      />
    );

    expect(screen.queryByTitle('Refresh data')).not.toBeInTheDocument();
  });
});

describe('formatLastUpdated', () => {
  it('should return "Never" for null date', () => {
    expect(formatLastUpdated(null)).toBe('Never');
  });

  it('should return "Just now" for recent dates', () => {
    const now = new Date();
    expect(formatLastUpdated(now)).toBe('Just now');
  });

  it('should return minutes ago for dates within an hour', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatLastUpdated(fiveMinutesAgo)).toBe('5 minutes ago');
  });

  it('should return hours ago for dates within a day', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatLastUpdated(twoHoursAgo)).toBe('2 hours ago');
  });
});
