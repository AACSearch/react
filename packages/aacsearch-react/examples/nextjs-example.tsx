/**
 * Next.js App Router Example
 * Demonstrates using AACSearch with Next.js 13+ App Router
 */

'use client';

import React from 'react';
import { SearchProvider, useInstantSearch } from '@aacsearch/react';
import { useRouter } from 'next/navigation';

// Product type
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  slug: string;
}

// Search Page Component
function ProductSearchPage() {
  const router = useRouter();

  const {
    query,
    setQuery,
    results,
    loading,
    error,
    page,
    setPage,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    totalPages,
  } = useInstantSearch<Product>({
    collection: 'products',
    searchFields: ['name', 'description'],
    facetFields: ['category'],
    resultsPerPage: 12,
  });

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Search</h1>

      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
          {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          {results?.facet_counts?.map((facet) => (
            <div key={facet.field_name} className="mb-6">
              <h3 className="font-medium mb-2 capitalize">
                {facet.field_name}
              </h3>
              <div className="space-y-2">
                {facet.counts.map((count) => (
                  <label
                    key={count.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        filters[facet.field_name]?.includes(count.value) || false
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          addFilter(facet.field_name, count.value);
                        } else {
                          removeFilter(facet.field_name, count.value);
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      {count.value} ({count.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Clear Filters
            </button>
          )}
        </aside>

        {/* Results Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : results && results.hits.length > 0 ? (
            <>
              <p className="mb-4 text-gray-600">
                Found {results.found.toLocaleString()} results in{' '}
                {results.search_time_ms}ms
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.hits.map((hit) => (
                  <div
                    key={hit.document.id}
                    onClick={() => handleProductClick(hit.document)}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {hit.document.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {hit.document.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">
                        ${hit.document.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {hit.document.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No results found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Root Layout with SearchProvider
export default function SearchLayout() {
  return (
    <SearchProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_AACSEARCH_API_KEY!,
        endpoint: process.env.NEXT_PUBLIC_AACSEARCH_ENDPOINT || 'https://api.aacsearch.com',
      }}
    >
      <ProductSearchPage />
    </SearchProvider>
  );
}

// Environment variables (.env.local):
// NEXT_PUBLIC_AACSEARCH_API_KEY=your-api-key
// NEXT_PUBLIC_AACSEARCH_ENDPOINT=https://api.aacsearch.com
