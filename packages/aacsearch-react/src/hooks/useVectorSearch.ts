/**
 * useVectorSearch - Semantic/Vector search hook
 */

import { useState, useCallback } from 'react';
import { useSearchContext } from '../components/SearchProvider';
import { AACSearchClientExtended } from '../client/AACSearchClientExtended';
import type { VectorSearchParams } from '../client/AACSearchClientExtended';
import type { SearchResult, AACSearchError } from '../types';

export interface UseVectorSearchOptions {
  collection: string;
  k?: number;
  onSuccess?: (results: SearchResult) => void;
  onError?: (error: AACSearchError) => void;
}

export interface UseVectorSearchResult<T = any> {
  results: SearchResult<T> | null;
  loading: boolean;
  error: AACSearchError | null;
  searchByText: (text: string, filter?: string) => Promise<void>;
  searchByVector: (vector: number[], filter?: string) => Promise<void>;
  reset: () => void;
}

export const useVectorSearch = <T = any>(
  options: UseVectorSearchOptions
): UseVectorSearchResult<T> => {
  const { client: baseClient } = useSearchContext();
  const client = baseClient as unknown as AACSearchClientExtended;

  const [results, setResults] = useState<SearchResult<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AACSearchError | null>(null);

  const performVectorSearch = useCallback(
    async (params: VectorSearchParams) => {
      setLoading(true);
      setError(null);

      try {
        const searchResults = await client.vectorSearch<T>(params);
        setResults(searchResults);

        if (options.onSuccess) {
          options.onSuccess(searchResults);
        }
      } catch (err: any) {
        const searchError: AACSearchError = {
          message: err.message || 'Vector search failed',
          code: err.code,
          statusCode: err.statusCode,
        };

        setError(searchError);

        if (options.onError) {
          options.onError(searchError);
        }
      } finally {
        setLoading(false);
      }
    },
    [client, options]
  );

  const searchByText = useCallback(
    async (text: string, filter?: string) => {
      await performVectorSearch({
        query_text: text,
        collection: options.collection,
        k: options.k || 10,
        filter,
      });
    },
    [performVectorSearch, options]
  );

  const searchByVector = useCallback(
    async (vector: number[], filter?: string) => {
      await performVectorSearch({
        query_vector: vector,
        collection: options.collection,
        k: options.k || 10,
        filter,
      });
    },
    [performVectorSearch, options]
  );

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    results,
    loading,
    error,
    searchByText,
    searchByVector,
    reset,
  };
};

export default useVectorSearch;
