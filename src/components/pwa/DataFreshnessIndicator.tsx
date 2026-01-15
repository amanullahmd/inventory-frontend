'use client';

import { formatLastUpdated } from '@/hooks/useCachedData';
import { RefreshCw, WifiOff, Clock, AlertCircle } from 'lucide-react';

interface DataFreshnessIndicatorProps {
  lastUpdated: Date | null;
  isStale: boolean;
  isOffline: boolean;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function DataFreshnessIndicator({
  lastUpdated,
  isStale,
  isOffline,
  isLoading = false,
  onRefresh,
  className = '',
}: DataFreshnessIndicatorProps) {
  const getStatusColor = () => {
    if (isOffline) return 'text-warning';
    if (isStale) return 'text-muted-foreground';
    return 'text-success';
  };

  const getStatusIcon = () => {
    if (isOffline) return WifiOff;
    if (isStale) return AlertCircle;
    return Clock;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <StatusIcon size={14} className={getStatusColor()} />
      
      <span className={getStatusColor()}>
        {isOffline ? (
          'Offline - showing cached data'
        ) : isStale ? (
          'Data may be outdated'
        ) : (
          `Updated ${formatLastUpdated(lastUpdated)}`
        )}
      </span>

      {onRefresh && !isOffline && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-1 rounded hover:bg-accent transition-colors disabled:opacity-50"
          title="Refresh data"
        >
          <RefreshCw 
            size={14} 
            className={`text-muted-foreground hover:text-foreground ${isLoading ? 'animate-spin' : ''}`} 
          />
        </button>
      )}
    </div>
  );
}
