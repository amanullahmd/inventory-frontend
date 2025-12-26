'use client';

import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
}

interface RetryState {
  isRetrying: boolean;
  retryCount: number;
  error: Error | null;
}

export const useRetry = (options: UseRetryOptions = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
  } = options;

  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    retryCount: 0,
    error: null,
  });

  const executeWithRetry = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      let currentRetryCount = 0;
      let currentDelay = retryDelay;

      const attempt = async (): Promise<T> => {
        try {
          setRetryState(prev => ({
            ...prev,
            isRetrying: currentRetryCount > 0,
            retryCount: currentRetryCount,
            error: null,
          }));

          const result = await operation();
          
          // Reset state on success
          setRetryState({
            isRetrying: false,
            retryCount: 0,
            error: null,
          });

          return result;
        } catch (error) {
          const err = error as Error;
          
          setRetryState(prev => ({
            ...prev,
            error: err,
            retryCount: currentRetryCount,
          }));

          // If we've reached max retries, throw the error
          if (currentRetryCount >= maxRetries) {
            setRetryState(prev => ({
              ...prev,
              isRetrying: false,
            }));
            throw err;
          }

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, currentDelay));
          
          currentRetryCount++;
          currentDelay *= backoffMultiplier;
          
          return attempt();
        }
      };

      return attempt();
    },
    [maxRetries, retryDelay, backoffMultiplier]
  );

  const reset = useCallback(() => {
    setRetryState({
      isRetrying: false,
      retryCount: 0,
      error: null,
    });
  }, []);

  return {
    executeWithRetry,
    reset,
    ...retryState,
  };
};

export default useRetry;