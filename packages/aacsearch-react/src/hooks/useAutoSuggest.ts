/**
 * useAutoSuggest - Autocomplete/suggestions hook
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchContext } from '../components/SearchProvider';
import { AACSearchClientExtended } from '../client/AACSearchClientExtended';

export interface UseAutoSuggestOptions {
  collection: string;
  debounceMs?: number;
  minChars?: number;
  limit?: number;
  fields?: string[];
  onSelect?: (suggestion: string) => void;
}

export interface Suggestion {
  value: string;
  highlighted: string;
  count?: number;
}

export interface UseAutoSuggestResult {
  suggestions: Suggestion[];
  loading: boolean;
  getSuggestions: (query: string) => Promise<void>;
  selectSuggestion: (suggestion: string) => void;
  clear: () => void;
}

export const useAutoSuggest = (
  options: UseAutoSuggestOptions
): UseAutoSuggestResult => {
  const { client: baseClient } = useSearchContext();
  const client = baseClient as unknown as AACSearchClientExtended;

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const getSuggestions = useCallback(
    async (query: string) => {
      if (query.length < (options.minChars || 2)) {
        setSuggestions([]);
        return;
      }

      // Debounce
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        setLoading(true);

        try {
          const result = await client.autoSuggest(query, options.collection, {
            limit: options.limit || 5,
            fields: options.fields,
          });

          setSuggestions(result.suggestions);
        } catch (error) {
          console.error('Auto-suggest error:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, options.debounceMs || 150);
    },
    [client, options]
  );

  const selectSuggestion = useCallback(
    (suggestion: string) => {
      if (options.onSelect) {
        options.onSelect(suggestion);
      }
      setSuggestions([]);
    },
    [options]
  );

  const clear = useCallback(() => {
    setSuggestions([]);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    suggestions,
    loading,
    getSuggestions,
    selectSuggestion,
    clear,
  };
};

export default useAutoSuggest;
