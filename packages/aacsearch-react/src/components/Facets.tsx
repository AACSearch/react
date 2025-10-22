/**
 * Facets - React component for faceted navigation/filtering
 */

import React, { useState } from 'react';
import type { FacetsProps } from '../types';

export const Facets: React.FC<FacetsProps> = ({
  facetCounts,
  selectedFacets,
  onFacetChange,
  className = '',
}) => {
  const [expandedFacets, setExpandedFacets] = useState<Set<string>>(new Set());

  if (!facetCounts || facetCounts.length === 0) {
    return null;
  }

  const toggleFacet = (fieldName: string) => {
    setExpandedFacets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldName)) {
        newSet.delete(fieldName);
      } else {
        newSet.add(fieldName);
      }
      return newSet;
    });
  };

  const formatFieldName = (fieldName: string) => {
    return fieldName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={`aacsearch-facets ${className}`}>
      {facetCounts.map((facet) => {
        const isExpanded = expandedFacets.has(facet.field_name);
        const selectedValues = selectedFacets[facet.field_name] || [];

        return (
          <div
            key={facet.field_name}
            className="aacsearch-facet"
            style={{
              marginBottom: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => toggleFacet(facet.field_name)}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
              }}
            >
              <span>{formatFieldName(facet.field_name)}</span>
              <span
                style={{
                  transition: 'transform 0.2s',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ▼
              </span>
            </button>

            {isExpanded && (
              <div
                className="aacsearch-facet-values"
                style={{
                  padding: '8px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}
              >
                {facet.counts.map((count) => {
                  const isSelected = selectedValues.includes(count.value);

                  return (
                    <label
                      key={count.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          onFacetChange(
                            facet.field_name,
                            count.value,
                            e.target.checked
                          )
                        }
                        style={{
                          width: '16px',
                          height: '16px',
                          marginRight: '8px',
                          cursor: 'pointer',
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontSize: '14px',
                          color: '#374151',
                        }}
                      >
                        {count.value}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          backgroundColor: '#f3f4f6',
                          padding: '2px 8px',
                          borderRadius: '12px',
                        }}
                      >
                        {count.count}
                      </span>
                    </label>
                  );
                })}

                {facet.stats && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    <div>Min: {facet.stats.min}</div>
                    <div>Max: {facet.stats.max}</div>
                    <div>Avg: {facet.stats.avg?.toFixed(2)}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Facets;
