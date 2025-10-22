/**
 * useSearch - React hook for search functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { useSearchContext } from '../components/SearchProvider';
import type {
  SearchParams,
  SearchResult,
  AACSearchError,
  UseSearchResult,
} from '../types';

export interface UseSearchOptions {
  collection: string;
  initialQuery?: string;
  autoSearch?: boolean;
  onSuccess?: (results: SearchResult) => void;
  onError?: (error: AACSearchError) => void;
}

export const useSearch = <T = any>(
  options: UseSearchOptions
): UseSearchResult<T> => {
  const { client } = useSearchContext();
  const { collection, initialQuery, autoSearch, onSuccess, onError } = options;

  const [results, setResults] = useState<SearchResult<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AACSearchError | null>(null);

  const search = useCallback(
    async (params: Omit<SearchParams, 'collection'>) => {
      setLoading(true);
      setError(null);

      try {
        const searchResults = await client.search<T>({
          ...params,
          collection,
        });

        setResults(searchResults);

        if (onSuccess) {
          onSuccess(searchResults);
        }
      } catch (err: any) {
        const searchError: AACSearchError = {
          message: err.message || 'Search failed',
          code: err.code,
          statusCode: err.statusCode,
          details: err.details,
        };

        setError(searchError);

        if (onError) {
          onError(searchError);
        }
      } finally {
        setLoading(false);
      }
    },
    [client, collection, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
    setLoading(false);
  }, []);

  // Auto-search on mount if initialQuery is provided
  useEffect(() => {
    if (autoSearch && initialQuery) {
      search({ q: initialQuery });
    }
  }, [autoSearch, initialQuery, search]);

  return {
    results,
    loading,
    error,
    search,
    reset,
  };
};

export default useSearch;
