/**
 * useRecommendations - Personalized recommendations hook
 */

import { useState, useCallback, useEffect } from 'react';
import { useSearchContext } from '../components/SearchProvider';
import { AACSearchClientExtended } from '../client/AACSearchClientExtended';
import type { RecommendationParams } from '../client/AACSearchClientExtended';
import type { SearchResult, AACSearchError } from '../types';

export interface UseRecommendationsOptions {
  collection: string;
  itemId?: string;
  userId?: string;
  limit?: number;
  algorithm?: 'collaborative' | 'content-based' | 'hybrid';
  autoFetch?: boolean;
  refreshInterval?: number;
}

export interface UseRecommendationsResult<T = any> {
  recommendations: SearchResult<T> | null;
  loading: boolean;
  error: AACSearchError | null;
  fetchRecommendations: (params?: Partial<RecommendationParams>) => Promise<void>;
  refresh: () => void;
}

export const useRecommendations = <T = any>(
  options: UseRecommendationsOptions
): UseRecommendationsResult<T> => {
  const { client: baseClient } = useSearchContext();
  const client = baseClient as unknown as AACSearchClientExtended;

  const [recommendations, setRecommendations] = useState<SearchResult<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AACSearchError | null>(null);

  const fetchRecommendations = useCallback(
    async (customParams?: Partial<RecommendationParams>) => {
      setLoading(true);
      setError(null);

      try {
        const params: RecommendationParams = {
          collection: options.collection,
          item_id: customParams?.item_id || options.itemId,
          user_id: customParams?.user_id || options.userId,
          limit: customParams?.limit || options.limit || 10,
          algorithm: customParams?.algorithm || options.algorithm || 'hybrid',
        };

        const results = await client.getRecommendations<T>(params);
        setRecommendations(results);
      } catch (err: any) {
        const recError: AACSearchError = {
          message: err.message || 'Failed to fetch recommendations',
          code: err.code,
          statusCode: err.statusCode,
        };

        setError(recError);
      } finally {
        setLoading(false);
      }
    },
    [client, options]
  );

  const refresh = useCallback(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (options.autoFetch !== false && (options.itemId || options.userId)) {
      fetchRecommendations();
    }
  }, [options.autoFetch, options.itemId, options.userId, fetchRecommendations]);

  // Auto-refresh at interval if specified
  useEffect(() => {
    if (options.refreshInterval && options.refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchRecommendations();
      }, options.refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [options.refreshInterval, fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    refresh,
  };
};

export default useRecommendations;
