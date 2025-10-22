# @aacsearch/react

Official React library for **AACSearch** - A powerful, scalable search-as-a-service platform built on Typesense.

## Features

- **TypeScript Support** - Fully typed for the best developer experience
- **React Hooks** - Modern React hooks API for seamless integration
- **Instant Search** - Real-time search with debouncing and auto-complete
- **Faceted Navigation** - Advanced filtering with facets
- **Analytics** - Track search behavior and performance
- **Multi-tenant** - Built-in support for multi-tenant architectures
- **Lightweight** - Tree-shakeable with no unnecessary dependencies
- **Framework Agnostic SDK** - Use the core SDK without React

## Installation

```bash
npm install @aacsearch/react
```

or with yarn:

```bash
yarn add @aacsearch/react
```

or with pnpm:

```bash
pnpm add @aacsearch/react
```

## Quick Start

### 1. Wrap your app with SearchProvider

```tsx
import { SearchProvider } from '@aacsearch/react';

function App() {
  return (
    <SearchProvider
      config={{
        apiKey: 'your-api-key',
        endpoint: 'https://api.aacsearch.com',
        tenant: 'your-tenant-id', // optional
      }}
    >
      <YourApp />
    </SearchProvider>
  );
}
```

### 2. Use the search hooks

```tsx
import { useSearch } from '@aacsearch/react';

function SearchComponent() {
  const { results, loading, error, search } = useSearch({
    collection: 'products',
  });

  const handleSearch = (query: string) => {
    search({ q: query });
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search products..."
      />

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {results?.hits.map((hit) => (
        <div key={hit.document.id}>
          <h3>{hit.document.name}</h3>
          <p>{hit.document.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## API Reference

### SearchProvider

The root component that provides the AACSearch client to all child components.

```tsx
<SearchProvider
  config={{
    apiKey: string;
    endpoint?: string;
    tenant?: string;
    timeout?: number;
  }}
>
  {children}
</SearchProvider>
```

### Hooks

#### useSearch

Hook for performing searches.

```tsx
const { results, loading, error, search, reset } = useSearch({
  collection: 'products',
  initialQuery?: 'laptop',
  autoSearch?: true,
  onSuccess?: (results) => console.log(results),
  onError?: (error) => console.error(error),
});

// Perform a search
search({
  q: 'laptop',
  filter_by: 'price:<1000',
  sort_by: 'price:asc',
  per_page: 20,
});
```

#### useInstantSearch

Advanced hook for instant search with filters, facets, and pagination.

```tsx
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
  sortBy,
  setSortBy,
  totalPages,
} = useInstantSearch({
  collection: 'products',
  searchFields: ['name', 'description'],
  facetFields: ['category', 'brand'],
  resultsPerPage: 10,
});
```

#### useCollections

Hook for managing collections.

```tsx
const { collections, loading, error, createCollection, deleteCollection, refresh } =
  useCollections({
    autoFetch: true,
  });

// Create a new collection
await createCollection({
  name: 'products',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'price', type: 'float' },
    { name: 'category', type: 'string', facet: true },
  ],
});
```

#### useAnalytics

Hook for fetching analytics data.

```tsx
const { analytics, loading, error, fetchAnalytics } = useAnalytics({
  initialParams: {
    start_date: '2024-01-01',
    end_date: '2024-12-31',
  },
  autoFetch: true,
  refreshInterval: 60000, // Refresh every minute
});
```

#### useApiKeys

Hook for managing API keys.

```tsx
const { apiKeys, loading, error, createApiKey, deleteApiKey, refresh } = useApiKeys({
  autoFetch: true,
});

// Create a new API key
await createApiKey({
  name: 'Frontend Key',
  permissions: ['read_only'],
  collections: ['products', 'articles'],
  expires_at: '2025-12-31',
});
```

### React Components

#### SearchBox

Pre-built search input component.

```tsx
import { SearchBox } from '@aacsearch/react';

<SearchBox
  collection="products"
  placeholder="Search products..."
  onSearch={(query, results) => console.log(query, results)}
  debounceMs={300}
  minChars={2}
  showSearchButton={false}
/>
```

#### SearchResults

Pre-built results display component.

```tsx
import { SearchResults } from '@aacsearch/react';

<SearchResults
  results={results}
  loading={loading}
  renderHit={(hit) => (
    <div>
      <h3>{hit.document.name}</h3>
      <p>{hit.document.description}</p>
    </div>
  )}
  onHitClick={(hit) => console.log('Clicked:', hit)}
/>
```

#### InstantSearch

Complete instant search UI.

```tsx
import { InstantSearch } from '@aacsearch/react';

<InstantSearch
  collection="products"
  searchFields={['name', 'description']}
  displayFields={{
    title: 'name',
    description: 'description',
    image: 'image_url',
  }}
  filters={[
    { field: 'category', label: 'Category', type: 'checkbox' },
    { field: 'brand', label: 'Brand', type: 'checkbox' },
  ]}
  sorting={[
    { field: 'price', label: 'Price: Low to High', order: 'asc' },
    { field: 'price', label: 'Price: High to Low', order: 'desc' },
  ]}
  resultsPerPage={20}
  onHitClick={(hit) => router.push(`/products/${hit.document.id}`)}
/>
```

#### Facets

Faceted navigation component.

```tsx
import { Facets } from '@aacsearch/react';

<Facets
  facetCounts={results?.facet_counts}
  selectedFacets={selectedFacets}
  onFacetChange={(field, value, checked) => {
    if (checked) {
      addFilter(field, value);
    } else {
      removeFilter(field, value);
    }
  }}
/>
```

#### Pagination

Pagination component.

```tsx
import { Pagination } from '@aacsearch/react';

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

### SDK Client (Without React)

You can also use the core SDK without React:

```typescript
import { AACSearchClient } from '@aacsearch/react';

const client = new AACSearchClient({
  apiKey: 'your-api-key',
  endpoint: 'https://api.aacsearch.com',
});

// Search
const results = await client.search({
  q: 'laptop',
  collection: 'products',
  query_by: 'name,description',
  filter_by: 'price:<1000',
  sort_by: 'price:asc',
});

// Create collection
const collection = await client.createCollection({
  name: 'products',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'price', type: 'float' },
  ],
});

// Import documents
await client.importDocuments({
  collection: 'products',
  documents: [
    { id: '1', name: 'Laptop', price: 999 },
    { id: '2', name: 'Mouse', price: 29 },
  ],
});

// Get analytics
const analytics = await client.getAnalytics({
  start_date: '2024-01-01',
  end_date: '2024-12-31',
});
```

## Advanced Usage

### Custom Search Parameters

```tsx
const { search } = useSearch({ collection: 'products' });

search({
  q: 'laptop',
  query_by: 'name,description',
  filter_by: 'price:[500..1500] && category:=Electronics',
  sort_by: 'price:asc,_text_match:desc',
  facet_by: 'category,brand',
  max_facet_values: 10,
  per_page: 20,
  page: 1,
  typo_tolerance: true,
  prefix: true,
  highlight_fields: 'name,description',
});
```

### Multi-Search

```typescript
const results = await client.multiSearch([
  {
    collection: 'products',
    q: 'laptop',
    query_by: 'name',
  },
  {
    collection: 'articles',
    q: 'laptop review',
    query_by: 'title,content',
  },
]);
```

### Document Management

```typescript
// Index a document
await client.indexDocument('products', {
  id: '123',
  name: 'MacBook Pro',
  price: 1999,
  category: 'Electronics',
});

// Update a document
await client.updateDocument('products', '123', {
  price: 1799,
});

// Delete a document
await client.deleteDocument({
  collection: 'products',
  id: '123',
});

// Delete by query
await client.deleteDocumentsByQuery('products', 'price:<100');
```

### Analytics Tracking

```typescript
// Track custom event
await client.trackEvent({
  type: 'product_view',
  collection: 'products',
  query: 'laptop',
  metadata: {
    product_id: '123',
    user_id: 'user-456',
  },
});
```

## TypeScript Support

The library is fully typed. Import types as needed:

```typescript
import type {
  SearchParams,
  SearchResult,
  SearchHit,
  Collection,
  CollectionField,
  AnalyticsData,
  ApiKey,
  AACSearchConfig,
} from '@aacsearch/react';
```

## Examples

Check out the [examples](./examples) directory for complete working examples:

- Basic Search
- Instant Search with Filters
- E-commerce Product Search
- Blog Search
- Multi-tenant Application

## Framework Support

- React 16.8+ (Hooks)
- Next.js (App Router & Pages Router)
- Remix
- Vite
- Create React App

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- Documentation: https://docs.aacsearch.com
- Issues: https://github.com/aacsearch/react/issues
- Email: support@aacsearch.com
- Discord: https://discord.gg/aacsearch

## Credits

Built with by the AACSearch team.
