/**
 * Instant Search Example
 * Demonstrates instant search with filters, facets, and pagination
 */

import React from 'react';
import { SearchProvider, InstantSearch } from '@aacsearch/react';
import type { SearchHit } from '@aacsearch/react';

// Product type
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  in_stock: boolean;
  image_url?: string;
}

function InstantSearchComponent() {
  const handleHitClick = (hit: SearchHit<Product>) => {
    console.log('Product clicked:', hit.document);
    // Navigate to product page
    // window.location.href = `/products/${hit.document.id}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>E-commerce Product Search</h1>

      <InstantSearch<Product>
        collection="products"
        searchFields={['name', 'description', 'brand']}
        displayFields={{
          title: 'name',
          description: 'description',
          image: 'image_url',
        }}
        placeholder="Search for products..."
        filters={[
          { field: 'category', label: 'Category', type: 'checkbox' },
          { field: 'brand', label: 'Brand', type: 'checkbox' },
          { field: 'in_stock', label: 'Availability', type: 'checkbox' },
        ]}
        sorting={[
          { field: 'price', label: 'Price: Low to High', order: 'asc' },
          { field: 'price', label: 'Price: High to Low', order: 'desc' },
          { field: 'rating', label: 'Rating: High to Low', order: 'desc' },
          { field: '_text_match', label: 'Relevance', order: 'desc' },
        ]}
        resultsPerPage={12}
        onHitClick={handleHitClick}
      />
    </div>
  );
}

export default function InstantSearchExample() {
  return (
    <SearchProvider
      config={{
        apiKey: 'your-api-key',
        endpoint: 'https://api.aacsearch.com',
      }}
    >
      <InstantSearchComponent />
    </SearchProvider>
  );
}
