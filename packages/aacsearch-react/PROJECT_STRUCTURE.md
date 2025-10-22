# Project Structure

Complete overview of the @aacsearch/react library structure.

## Directory Structure

```
packages/aacsearch-react/
├── src/                          # Source code
│   ├── client/                   # SDK Client
│   │   └── AACSearchClient.ts    # Main API client class
│   ├── hooks/                    # React Hooks
│   │   ├── useSearch.ts          # Basic search hook
│   │   ├── useInstantSearch.ts   # Advanced instant search hook
│   │   ├── useCollections.ts     # Collection management hook
│   │   ├── useAnalytics.ts       # Analytics data hook
│   │   ├── useApiKeys.ts         # API keys management hook
│   │   ├── useClient.ts          # Direct client access hook
│   │   └── index.ts              # Hooks exports
│   ├── components/               # React Components
│   │   ├── SearchProvider.tsx    # Context provider component
│   │   ├── SearchBox.tsx         # Search input component
│   │   ├── SearchResults.tsx     # Results display component
│   │   ├── InstantSearch.tsx     # Complete instant search UI
│   │   ├── Facets.tsx            # Faceted navigation component
│   │   ├── Pagination.tsx        # Pagination component
│   │   └── index.ts              # Components exports
│   ├── types/                    # TypeScript Types
│   │   └── index.ts              # All type definitions
│   └── index.ts                  # Main entry point
├── examples/                     # Usage Examples
│   ├── basic-search.tsx          # Basic search example
│   ├── instant-search.tsx        # Instant search example
│   ├── nextjs-example.tsx        # Next.js integration
│   └── sdk-usage.ts              # SDK usage without React
├── dist/                         # Build output (generated)
│   ├── index.js                  # CommonJS build
│   ├── index.mjs                 # ES Module build
│   ├── index.d.ts                # TypeScript declarations
│   └── ...
├── node_modules/                 # Dependencies (generated)
├── package.json                  # Package configuration
├── tsconfig.json                 # TypeScript configuration
├── tsup.config.ts                # Build configuration
├── .gitignore                    # Git ignore rules
├── .npmignore                    # npm ignore rules
├── LICENSE                       # MIT License
├── README.md                     # Main documentation
├── QUICKSTART.md                 # Quick start guide
├── CONTRIBUTING.md               # Contribution guidelines
├── PUBLISHING.md                 # Publishing guide
├── CHANGELOG.md                  # Version history
└── PROJECT_STRUCTURE.md          # This file
```

## Source Code Organization

### Client (`src/client/`)

**AACSearchClient.ts** - Core SDK client for API interactions

- REST API client using native `fetch`
- Full TypeScript support
- Timeout handling
- Error handling
- Multi-tenant support

**Key Methods:**
- Search operations: `search()`, `multiSearch()`
- Collection management: `getCollections()`, `createCollection()`, `deleteCollection()`
- Document operations: `importDocuments()`, `indexDocument()`, `updateDocument()`, `deleteDocument()`
- API key management: `getApiKeys()`, `createApiKey()`, `deleteApiKey()`
- Analytics: `getAnalytics()`, `trackEvent()`
- Tenant operations: `getTenant()`, `updateTenant()`
- Queue management: `getQueueStatus()`, `pauseQueue()`, `resumeQueue()`

### Hooks (`src/hooks/`)

**useSearch** - Basic search functionality
```tsx
const { results, loading, error, search, reset } = useSearch({
  collection: 'products',
  initialQuery: 'laptop',
  autoSearch: true,
});
```

**useInstantSearch** - Advanced instant search with filters, facets, pagination
```tsx
const {
  query, setQuery,
  results, loading, error,
  page, setPage,
  filters, addFilter, removeFilter,
  sortBy, setSortBy,
  totalPages
} = useInstantSearch({
  collection: 'products',
  searchFields: ['name', 'description'],
  facetFields: ['category', 'brand'],
});
```

**useCollections** - Collection management
```tsx
const {
  collections, loading, error,
  createCollection, deleteCollection, refresh
} = useCollections({ autoFetch: true });
```

**useAnalytics** - Analytics data
```tsx
const { analytics, loading, error, fetchAnalytics } = useAnalytics({
  initialParams: { start_date: '2024-01-01' },
  autoFetch: true,
  refreshInterval: 60000,
});
```

**useApiKeys** - API keys management
```tsx
const {
  apiKeys, loading, error,
  createApiKey, deleteApiKey, refresh
} = useApiKeys({ autoFetch: true });
```

**useClient** - Direct SDK client access
```tsx
const client = useClient();
await client.importDocuments({ collection: 'products', documents: [...] });
```

### Components (`src/components/`)

**SearchProvider** - Context provider
```tsx
<SearchProvider config={{ apiKey: 'xxx', endpoint: 'https://api.aacsearch.com' }}>
  <App />
</SearchProvider>
```

**SearchBox** - Search input with debouncing
```tsx
<SearchBox
  collection="products"
  placeholder="Search..."
  onSearch={(query, results) => console.log(results)}
  debounceMs={300}
/>
```

**SearchResults** - Results display
```tsx
<SearchResults
  results={results}
  loading={loading}
  renderHit={(hit) => <div>{hit.document.name}</div>}
  onHitClick={(hit) => navigate(`/products/${hit.document.id}`)}
/>
```

**InstantSearch** - Complete instant search UI
```tsx
<InstantSearch
  collection="products"
  searchFields={['name', 'description']}
  displayFields={{ title: 'name', description: 'description' }}
  filters={[{ field: 'category', label: 'Category', type: 'checkbox' }]}
  sorting={[{ field: 'price', label: 'Price', order: 'asc' }]}
/>
```

**Facets** - Faceted navigation
```tsx
<Facets
  facetCounts={results?.facet_counts}
  selectedFacets={selectedFacets}
  onFacetChange={(field, value, checked) => {...}}
/>
```

**Pagination** - Page navigation
```tsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

### Types (`src/types/`)

Complete TypeScript type definitions:

**Configuration Types:**
- `AACSearchConfig` - Client configuration
- `SearchContextValue` - Context value type

**Search Types:**
- `SearchParams` - Search parameters
- `SearchResult` - Search results
- `SearchHit` - Individual result hit
- `FacetCount` - Facet counts
- `Highlight` - Highlight information

**Collection Types:**
- `Collection` - Collection schema
- `CollectionField` - Field definition
- `FieldType` - Field data types
- `CreateCollectionInput` - Collection creation input
- `UpdateCollectionInput` - Collection update input

**Document Types:**
- `Document` - Document structure
- `ImportDocumentsParams` - Bulk import params
- `ImportResponse` - Import response
- `UpsertDocumentParams` - Upsert params

**API Key Types:**
- `ApiKey` - API key structure
- `ApiKeyPermission` - Permission types
- `CreateApiKeyInput` - API key creation input

**Analytics Types:**
- `AnalyticsData` - Analytics data structure
- `AnalyticsParams` - Analytics query params
- `TopQuery` - Top queries data
- `PerformanceMetrics` - Performance stats

**Other Types:**
- `Tenant` - Tenant information
- `TenantPlan` - Subscription plan
- `QueueStatus` - Queue status
- `WidgetConfig` - Widget configuration
- `AACSearchError` - Error structure

## Build Output (`dist/`)

Generated during build (`npm run build`):

- `index.js` - CommonJS build (for Node.js)
- `index.mjs` - ES Module build (for modern bundlers)
- `index.d.ts` - TypeScript type declarations
- `*.map` - Source maps for debugging

## Configuration Files

### package.json
Package metadata, dependencies, scripts, and exports configuration.

**Key fields:**
- `main`: CommonJS entry point
- `module`: ESM entry point
- `types`: TypeScript declarations
- `exports`: Package exports map
- `sideEffects`: false (tree-shakeable)

### tsconfig.json
TypeScript compiler configuration.

**Key settings:**
- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Strict mode enabled
- Declaration generation

### tsup.config.ts
Build tool configuration.

**Features:**
- Dual format output (CJS + ESM)
- Type declaration generation
- Source maps
- Minification
- Tree shaking
- React external

## Documentation Files

### README.md
Main documentation with:
- Installation instructions
- Quick start guide
- API reference
- Examples
- TypeScript support

### QUICKSTART.md
5-minute quick start guide with common patterns.

### CONTRIBUTING.md
Guidelines for contributors:
- Code of conduct
- Development setup
- Coding standards
- Testing guidelines
- PR process

### PUBLISHING.md
Publishing guide for maintainers:
- Pre-publish checklist
- Version management
- Publishing process
- CI/CD setup

### CHANGELOG.md
Version history and release notes.

### PROJECT_STRUCTURE.md
This file - complete project overview.

## Example Files

### basic-search.tsx
Simple search implementation example.

### instant-search.tsx
Advanced instant search with filters example.

### nextjs-example.tsx
Next.js App Router integration example.

### sdk-usage.ts
SDK usage without React (vanilla JS/TS).

## Key Features

### TypeScript Support
- Full type coverage
- Strict type checking
- Type inference
- Generic types for custom data

### Tree Shaking
- ES Module support
- Side-effect free
- Optimized imports
- Minimal bundle size

### Framework Support
- React 16.8+ (Hooks)
- Next.js (Pages & App Router)
- Remix
- Vite
- Create React App

### Build System
- tsup for fast builds
- Dual CJS/ESM output
- Source maps
- Type declarations
- Minification

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Consistent code style

## Dependencies

### Peer Dependencies
- `react` >= 16.8.0
- `react-dom` >= 16.8.0

### Dev Dependencies
- `typescript` - TypeScript compiler
- `tsup` - Build tool
- `vitest` - Testing framework
- `eslint` - Linting
- `@types/*` - Type definitions

### Runtime Dependencies
None! Zero runtime dependencies for minimal bundle size.

## Scripts

```json
{
  "build": "tsup",                    // Build for production
  "dev": "tsup --watch",              // Development mode
  "type-check": "tsc --noEmit",       // Type checking
  "lint": "eslint src --ext .ts,.tsx", // Linting
  "test": "vitest",                   // Run tests
  "prepublishOnly": "npm run build"   // Pre-publish hook
}
```

## Usage Patterns

### Direct Import (Recommended)
```tsx
import { SearchProvider, useSearch } from '@aacsearch/react';
```

### Named Imports
```tsx
import { AACSearchClient } from '@aacsearch/react/client';
import { useSearch } from '@aacsearch/react/hooks';
import { SearchBox } from '@aacsearch/react/components';
```

### Type Imports
```tsx
import type { SearchResult, SearchHit } from '@aacsearch/react';
```

## Package Size

Optimized for minimal bundle size:
- Minified: ~15KB
- Gzipped: ~5KB
- Tree-shakeable: Import only what you need

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Node.js 18+

## License

MIT License - See LICENSE file for details.
