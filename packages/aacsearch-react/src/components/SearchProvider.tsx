/**
 * SearchProvider - Context Provider for AACSearch
 */

import React, { createContext, useContext, useMemo } from 'react';
import { AACSearchClient } from '../client/AACSearchClient';
import type { AACSearchConfig, SearchContextValue } from '../types';

const SearchContext = createContext<SearchContextValue | null>(null);

export interface SearchProviderProps {
  config: AACSearchConfig;
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({
  config,
  children,
}) => {
  const client = useMemo(() => new AACSearchClient(config), [
    config.apiKey,
    config.endpoint,
    config.tenant,
    config.timeout,
  ]);

  const value: SearchContextValue = {
    client,
    config,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = (): SearchContextValue => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error('useSearchContext must be used within SearchProvider');
  }

  return context;
};

export default SearchProvider;
