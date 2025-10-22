/**
 * SearchResults - React component for displaying search results
 */

import React from 'react';
import type { SearchResultsProps, SearchHit } from '../types';

export const SearchResults = <T = any,>({
  results,
  loading = false,
  renderHit,
  onHitClick,
  className = '',
  emptyMessage = 'No results found',
  loadingMessage = 'Searching...',
}: SearchResultsProps<T>): React.ReactElement => {
  if (loading) {
    return (
      <div
        className={`aacsearch-results-loading ${className}`}
        style={{
          padding: '32px',
          textAlign: 'center',
          color: '#6b7280',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e0e0e0',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.6s linear infinite',
          }}
        />
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (!results || results.hits.length === 0) {
    return (
      <div
        className={`aacsearch-results-empty ${className}`}
        style={{
          padding: '32px',
          textAlign: 'center',
          color: '#6b7280',
        }}
      >
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const defaultRenderHit = (hit: SearchHit<T>) => (
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
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (onHitClick) {
          e.currentTarget.style.borderColor = '#e0e0e0';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {hit.highlights && hit.highlights.length > 0 ? (
        <div>
          {hit.highlights.map((highlight, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <strong style={{ fontSize: '14px', color: '#374151' }}>
                {highlight.field}:
              </strong>
              <div
                dangerouslySetInnerHTML={{ __html: highlight.snippet }}
                style={{
                  marginTop: '4px',
                  fontSize: '16px',
                  color: '#111827',
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <pre
          style={{
            margin: 0,
            fontSize: '14px',
            color: '#374151',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        >
          {JSON.stringify(hit.document, null, 2)}
        </pre>
      )}

      <div
        style={{
          marginTop: '8px',
          fontSize: '12px',
          color: '#9ca3af',
        }}
      >
        Score: {hit.text_match.toFixed(2)}
      </div>
    </div>
  );

  return (
    <div className={`aacsearch-results ${className}`}>
      <div
        className="aacsearch-results-meta"
        style={{
          marginBottom: '16px',
          fontSize: '14px',
          color: '#6b7280',
        }}
      >
        Found {results.found.toLocaleString()} results in{' '}
        {results.search_time_ms}ms
      </div>

      <div className="aacsearch-results-list">
        {results.hits.map((hit) =>
          renderHit ? renderHit(hit) : defaultRenderHit(hit)
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
