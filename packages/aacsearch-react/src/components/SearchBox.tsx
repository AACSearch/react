/**
 * SearchBox - React component for search input
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearch } from '../hooks/useSearch';
import type { SearchBoxProps } from '../types';

export const SearchBox: React.FC<SearchBoxProps> = ({
  collection,
  placeholder = 'Search...',
  onSearch,
  onError,
  autoFocus = false,
  debounceMs = 300,
  minChars = 1,
  className = '',
  showSearchButton = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { search, results, loading, error } = useSearch({
    collection,
    onSuccess: (searchResults) => {
      if (onSearch) {
        onSearch(inputValue, searchResults);
      }
    },
    onError,
  });

  const handleSearch = useCallback(
    (query: string) => {
      if (query.length >= minChars) {
        search({ q: query });
      }
    },
    [search, minChars]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!showSearchButton) {
      // Debounce search
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        handleSearch(value);
      }, debounceMs);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(inputValue);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={`aacsearch-search-box ${className}`}
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={loading}
        className="aacsearch-search-input"
        style={{
          flex: 1,
          padding: '10px 16px',
          fontSize: '16px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e0e0e0';
        }}
      />

      {showSearchButton && (
        <button
          type="submit"
          disabled={loading || inputValue.length < minChars}
          className="aacsearch-search-button"
          style={{
            padding: '10px 24px',
            fontSize: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || inputValue.length < minChars ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      )}

      {loading && !showSearchButton && (
        <div
          className="aacsearch-loading-spinner"
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid #e0e0e0',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}

      {error && (
        <div
          className="aacsearch-error"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            padding: '8px 12px',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          {error.message}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
};

export default SearchBox;
