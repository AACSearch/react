/**
 * InstantSearch - Complete instant search UI component
 */

import React from 'react';
import { useInstantSearch } from '../hooks/useInstantSearch';
import { SearchResults } from './SearchResults';
import { Pagination } from './Pagination';
import { Facets } from './Facets';
import type { InstantSearchProps } from '../types';

export const InstantSearch: React.FC<InstantSearchProps> = ({
  collection,
  searchFields,
  displayFields,
  placeholder = 'Search...',
  filters,
  sorting,
  resultsPerPage = 10,
  onHitClick,
  className = '',
}) => {
  const facetFields = filters?.map((f) => f.field);

  const {
    query,
    setQuery,
    results,
    loading,
    error,
    page,
    setPage,
    filters: selectedFilters,
    addFilter,
    removeFilter,
    clearFilters,
    sortBy,
    setSortBy,
    totalPages,
  } = useInstantSearch({
    collection,
    searchFields,
    facetFields,
    resultsPerPage,
  });

  const handleFacetChange = (field: string, value: string, checked: boolean) => {
    if (checked) {
      addFilter(field, value);
    } else {
      removeFilter(field, value);
    }
  };

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <div className={`aacsearch-instant-search ${className}`}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .aacsearch-instant-search {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .aacsearch-instant-search-content {
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 24px;
          }
        }
      `}</style>

      {/* Search Header */}
      <div className="aacsearch-instant-search-header">
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="aacsearch-search-input"
            style={{
              flex: 1,
              padding: '12px 16px',
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

          {sorting && sorting.length > 0 && (
            <select
              value={sortBy || ''}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '12px 16px',
                fontSize: '14px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="">Sort by...</option>
              {sorting.map((sort) => (
                <option
                  key={`${sort.field}:${sort.order}`}
                  value={`${sort.field}:${sort.order}`}
                >
                  {sort.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {hasActiveFilters && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              marginTop: '12px',
            }}
          >
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Active filters:
            </span>
            {Object.entries(selectedFilters).map(([field, values]) =>
              values.map((value) => (
                <button
                  key={`${field}-${value}`}
                  onClick={() => removeFilter(field, value)}
                  style={{
                    padding: '4px 12px',
                    fontSize: '14px',
                    backgroundColor: '#eff6ff',
                    color: '#1e40af',
                    border: '1px solid #bfdbfe',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {value}
                  <span style={{ fontSize: '16px' }}>×</span>
                </button>
              ))
            )}
            <button
              onClick={clearFilters}
              style={{
                padding: '4px 12px',
                fontSize: '14px',
                backgroundColor: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                borderRadius: '16px',
                cursor: 'pointer',
              }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          {error.message}
        </div>
      )}

      {/* Content Grid */}
      <div className="aacsearch-instant-search-content">
        {/* Sidebar with Facets */}
        {filters && filters.length > 0 && (
          <aside className="aacsearch-instant-search-sidebar">
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '16px',
                color: '#374151',
              }}
            >
              Filters
            </h3>
            <Facets
              facetCounts={results?.facet_counts}
              selectedFacets={selectedFilters}
              onFacetChange={handleFacetChange}
            />
          </aside>
        )}

        {/* Main Results */}
        <main className="aacsearch-instant-search-main">
          <SearchResults
            results={results}
            loading={loading}
            onHitClick={onHitClick}
            renderHit={(hit) => (
              <div
                key={(hit.document as any).id || Math.random()}
                className="aacsearch-result-item"
                onClick={() => onHitClick && onHitClick(hit)}
                style={{
                  padding: '16px',
                  marginBottom: '12px',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: onHitClick ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (onHitClick) {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow =
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (onHitClick) {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Title */}
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    marginBottom: '8px',
                    color: '#111827',
                  }}
                >
                  {(hit.document as any)[displayFields.title] || 'Untitled'}
                </h3>

                {/* Description */}
                {displayFields.description && (
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '8px',
                    }}
                  >
                    {(hit.document as any)[displayFields.description]}
                  </p>
                )}

                {/* Image */}
                {displayFields.image && (hit.document as any)[displayFields.image] && (
                  <img
                    src={(hit.document as any)[displayFields.image]}
                    alt={(hit.document as any)[displayFields.title]}
                    style={{
                      maxWidth: '200px',
                      borderRadius: '6px',
                      marginTop: '8px',
                    }}
                  />
                )}

                {/* Score */}
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#9ca3af',
                  }}
                >
                  Relevance: {hit.text_match.toFixed(2)}
                </div>
              </div>
            )}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default InstantSearch;
