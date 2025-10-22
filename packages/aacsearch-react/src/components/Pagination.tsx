/**
 * Pagination - React component for page navigation
 */

import React from 'react';
import type { PaginationProps } from '../types';

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    margin: '0 4px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6',
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    cursor: 'not-allowed',
    opacity: 0.5,
  };

  return (
    <div
      className={`aacsearch-pagination ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 0',
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = 'white';
          }
        }}
      >
        ← Previous
      </button>

      {pageNumbers.map((page, idx) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${idx}`}
              style={{
                padding: '8px 12px',
                margin: '0 4px',
                color: '#6b7280',
              }}
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            style={isActive ? activeButtonStyle : buttonStyle}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={currentPage === totalPages ? disabledButtonStyle : buttonStyle}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = 'white';
          }
        }}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
