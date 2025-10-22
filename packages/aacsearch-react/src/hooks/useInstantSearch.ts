/**
 * useInstantSearch - React hook for instant search with filters, pagination, and facets
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchContext } from '../components/SearchProvider';
import type {
  SearchParams,
  SearchResult,
  AACSearchError,
} from '../types';

export interface UseInstantSearchOptions {
  collection: string;
  searchFields: string[];
  facetFields?: string[];
  debounceMs?: number;
  resultsPerPage?: number;
  defaultFilters?: Record<string, string[]>;
  defaultSortBy?: string;
  onSearch?: (query: string, results: SearchResult) => void;
  onError?: (error: AACSearchError) => void;
}

export interface UseInstantSearchResult<T = any> {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult<T> | null;
  loading: boolean;
  error: AACSearchError | null;
  page: number;
  setPage: (page: number) => void;
  filters: Record<string, string[]>;
  setFilters: (filters: Record<string, string[]>) => void;
  addFilter: (field: string, value: string) => void;
  removeFilter: (field: string, value: string) => void;
  clearFilters: () => void;
  sortBy: string | undefined;
  setSortBy: (sortBy: string) => void;
  totalPages: number;
  refresh: () => void;
  reset: () => void;
}

export const useInstantSearch = <T = any>(
  options: UseInstantSearchOptions
): UseInstantSearchResult<T> => {
  const { client } = useSearchContext();
  const {
    collection,
    searchFields,
    facetFields,
    debounceMs = 300,
    resultsPerPage = 10,
    defaultFilters = {},
    defaultSortBy,
    onSearch,
    onError,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AACSearchError | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string[]>>(defaultFilters);
  const [sortBy, setSortBy] = useState<string | undefined>(defaultSortBy);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(
    async (searchQuery: string, currentPage: number) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        // Build filter string
        const filterParts: string[] = [];
        Object.entries(filters).forEach(([field, values]) => {
          if (values.length > 0) {
            const filterValues = values.map((v) => `${field}:=${v}`).join(' || ');
            filterParts.push(`(${filterValues})`);
          }
        });
        const filter_by = filterParts.length > 0 ? filterParts.join(' && ') : undefined;

        const searchParams: SearchParams = {
          q: searchQuery || '*',
          collection,
          query_by: searchFields.join(','),
          filter_by,
          facet_by: facetFields?.join(','),
          sort_by: sortBy,
          page: currentPage,
          per_page: resultsPerPage,
        };

        const searchResults = await client.search<T>(searchParams);
        setResults(searchResults);

        if (onSearch && searchQuery) {
          onSearch(searchQuery, searchResults);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
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
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [
      client,
      collection,
      searchFields,
      facetFields,
      filters,
      sortBy,
      resultsPerPage,
      onSearch,
      onError,
    ]
  );

  // Debounced search effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(query, page);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, page, filters, sortBy, performSearch, debounceMs]);

  const addFilter = useCallback((field: string, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[field] || [];
      if (!currentValues.includes(value)) {
        return {
          ...prev,
          [field]: [...currentValues, value],
        };
      }
      return prev;
    });
    setPage(1); // Reset to first page when filter changes
  }, []);

  const removeFilter = useCallback((field: string, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.filter((v) => v !== value);

      if (newValues.length === 0) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [field]: newValues,
      };
    });
    setPage(1); // Reset to first page when filter changes
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    performSearch(query, page);
  }, [performSearch, query, page]);

  const reset = useCallback(() => {
    setQuery('');
    setResults(null);
    setError(null);
    setLoading(false);
    setPage(1);
    setFilters(defaultFilters);
    setSortBy(defaultSortBy);
  }, [defaultFilters, defaultSortBy]);

  const totalPages = results
    ? Math.ceil(results.found / resultsPerPage)
    : 0;

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    page,
    setPage,
    filters,
    setFilters,
    addFilter,
    removeFilter,
    clearFilters,
    sortBy,
    setSortBy,
    totalPages,
    refresh,
    reset,
  };
};

export default useInstantSearch;
