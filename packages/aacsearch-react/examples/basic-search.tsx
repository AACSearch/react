/**
 * Basic Search Example
 * Demonstrates simple search functionality
 */

import React, { useState } from 'react';
import { SearchProvider, useSearch } from '@aacsearch/react';
import type { SearchHit } from '@aacsearch/react';

// Product type
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

function BasicSearchComponent() {
  const [query, setQuery] = useState('');

  const { results, loading, error, search } = useSearch<Product>({
    collection: 'products',
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      search({
        q: value,
        query_by: 'name,description',
        per_page: 10,
      });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Product Search</h1>

      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for products..."
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      />

      {loading && <p>Searching...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {results && (
        <div>
          <p style={{ margin: '20px 0', color: '#666' }}>
            Found {results.found} results in {results.search_time_ms}ms
          </p>

          <div style={{ display: 'grid', gap: '16px' }}>
            {results.hits.map((hit: SearchHit<Product>) => (
              <div
                key={hit.document.id}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                }}
              >
                <h3>{hit.document.name}</h3>
                <p style={{ color: '#666' }}>{hit.document.description}</p>
                <p style={{ fontWeight: 'bold', color: '#2563eb' }}>
                  ${hit.document.price}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  Category: {hit.document.category}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  Relevance Score: {hit.text_match.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// App wrapper with SearchProvider
export default function BasicSearchExample() {
  return (
    <SearchProvider
      config={{
        apiKey: 'your-api-key',
        endpoint: 'https://api.aacsearch.com',
      }}
    >
      <BasicSearchComponent />
    </SearchProvider>
  );
}
