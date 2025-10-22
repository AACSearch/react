/**
 * useAnalytics - React hook for analytics data
 */

import { useState, useCallback, useEffect } from 'react';
import { useSearchContext } from '../components/SearchProvider';
import type {
  AnalyticsParams,
  AnalyticsData,
  AACSearchError,
  UseAnalyticsResult,
} from '../types';

export interface UseAnalyticsOptions {
  initialParams?: AnalyticsParams;
  autoFetch?: boolean;
  refreshInterval?: number; // in milliseconds
  onSuccess?: (data: AnalyticsData) => void;
  onError?: (error: AACSearchError) => void;
}

export const useAnalytics = (
  options: UseAnalyticsOptions = {}
): UseAnalyticsResult => {
  const { client } = useSearchContext();
  const {
    initialParams,
    autoFetch = true,
    refreshInterval,
    onSuccess,
    onError,
  } = options;

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AACSearchError | null>(null);

  const fetchAnalytics = useCallback(
    async (params?: AnalyticsParams) => {
      setLoading(true);
      setError(null);

      try {
        const data = await client.getAnalytics(params);
        setAnalytics(data);

        if (onSuccess) {
          onSuccess(data);
        }
      } catch (err: any) {
        const analyticsError: AACSearchError = {
          message: err.message || 'Failed to fetch analytics',
          code: err.code,
          statusCode: err.statusCode,
          details: err.details,
        };

        setError(analyticsError);

        if (onError) {
          onError(analyticsError);
        }
      } finally {
        setLoading(false);
      }
    },
    [client, onSuccess, onError]
  );

  // Auto-fetch analytics on mount
  useEffect(() => {
    if (autoFetch) {
      fetchAnalytics(initialParams);
    }
  }, [autoFetch]); // Only run on mount

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchAnalytics(initialParams);
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, fetchAnalytics, initialParams]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
  };
};

export default useAnalytics;
