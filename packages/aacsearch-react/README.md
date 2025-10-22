# @aacsearch/react

Official React library for **AACSearch** - Powerful search-as-a-service platform with AI capabilities.

> **Important:** This library provides **data fetching hooks and SDK client only** (no UI components). For pre-built UI components, use `@aacsearch/ui` or build your own with these hooks!

## Features

### Core
- ✅ **TypeScript SDK** - Fully typed client for all API operations
- ✅ **React Hooks** - Modern hooks for data fetching
- ✅ **Zero UI Dependencies** - Pure logic layer
- ✅ **Tree-shakeable** - Import only what you need

### Advanced
- 🤖 **AI-Powered Search** - Conversational search with streaming
- 🔍 **Vector Search** - Semantic similarity search
- 🎯 **Recommendations** - Personalized suggestions
- ⚡ **Real-time** - WebSocket live updates
- 💡 **Auto-suggest** - Intelligent autocomplete
- 📊 **Analytics** - Performance tracking & A/B testing

## Installation

```bash
npm install @aacsearch/react
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
      }}
    >
      <YourApp />
    </SearchProvider>
  );
}
```

### 2. Use hooks in your components

```tsx
import { useSearch } from '@aacsearch/react';

function SearchComponent() {
  const { results, loading, search } = useSearch({
    collection: 'products',
  });

  return (
    <div>
      <input onChange={(e) => search({ q: e.target.value })} />

      {loading && <p>Loading...</p>}

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

## Available Hooks

### Basic Hooks

- **`useSearch`** - Perform search queries
- **`useInstantSearch`** - Advanced search with filters, facets, pagination
- **`useCollections`** - Manage search collections
- **`useAnalytics`** - Get analytics data
- **`useApiKeys`** - Manage API keys
- **`useClient`** - Direct access to SDK client

### Advanced Hooks

- **`useConversationalSearch`** - AI-powered conversational search with streaming
- **`useVectorSearch`** - Semantic/vector search
- **`useRecommendations`** - Personalized recommendations
- **`useRealtime`** - WebSocket real-time updates
- **`useAutoSuggest`** - Autocomplete suggestions

## Basic Usage Examples

### Search with Filters

```tsx
import { useInstantSearch } from '@aacsearch/react';

function FilteredSearch() {
  const {
    query,
    setQuery,
    results,
    filters,
    addFilter,
    removeFilter,
    page,
    setPage,
  } = useInstantSearch({
    collection: 'products',
    searchFields: ['name', 'description'],
    facetFields: ['category', 'brand'],
  });

  return (
    <div>
      {/* Your UI here */}
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {/* Render results, filters, pagination */}
    </div>
  );
}
```

### Get Recommendations

```tsx
import { useRecommendations } from '@aacsearch/react';

function Recommendations({ userId }) {
  const { recommendations, loading } = useRecommendations({
    collection: 'products',
    userId,
    limit: 10,
    algorithm: 'hybrid',
  });

  return (
    <div>
      {recommendations?.hits.map((hit) => (
        <div key={hit.document.id}>{hit.document.name}</div>
      ))}
    </div>
  );
}
```

### AI Chat Search

```tsx
import { useConversationalSearch } from '@aacsearch/react';

function ChatSearch() {
  const { messages, sendMessage, isStreaming } = useConversationalSearch({
    collection: 'products',
    streaming: true,
  });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id} className={msg.role}>
          {msg.content}
        </div>
      ))}

      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
        disabled={isStreaming}
      />
    </div>
  );
}
```

### Real-time Updates

```tsx
import { useRealtime } from '@aacsearch/react';

function LiveData() {
  const { connected, updates, subscribe } = useRealtime({
    autoConnect: true,
  });

  useEffect(() => {
    if (connected) {
      subscribe('products');
    }
  }, [connected]);

  return (
    <div>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
      <div>Latest updates: {updates.length}</div>
    </div>
  );
}
```

## SDK Client Usage (Without React)

```typescript
import { AACSearchClientExtended } from '@aacsearch/react';

const client = new AACSearchClientExtended({
  apiKey: 'your-api-key',
  endpoint: 'https://api.aacsearch.com',
});

// Search
const results = await client.search({
  q: 'laptop',
  collection: 'products',
  filter_by: 'price:<1000',
});

// Conversational search
const answer = await client.conversationalSearch({
  message: 'Find me a good laptop under $1000',
  collection: 'products',
});

// Vector search
const similar = await client.vectorSearch({
  query_text: 'MacBook Pro',
  collection: 'products',
  k: 10,
});

// Recommendations
const recs = await client.getRecommendations({
  user_id: 'user-123',
  collection: 'products',
  limit: 10,
});

// Auto-suggest
const suggestions = await client.autoSuggest('lapt', 'products');

// Batch operations
await client.batchOperations({
  collection: 'products',
  operations: [
    { action: 'index', document: { id: '1', name: 'Product 1' } },
    { action: 'update', id: '2', document: { price: 99 } },
    { action: 'delete', id: '3' },
  ],
});
```

## Advanced Features

See [README_EXTENDED.md](./README_EXTENDED.md) for comprehensive documentation on:

- AI-Powered Conversational Search with streaming
- Vector/Semantic Search
- Smart Recommendations
- Real-time WebSocket updates
- Auto-suggest/Autocomplete
- Performance Analytics
- A/B Testing
- Batch Operations
- User Event Tracking

## TypeScript Support

Fully typed with TypeScript:

```typescript
import type {
  SearchResult,
  SearchHit,
  Collection,
  ConversationalSearchResult,
  RecommendationParams,
} from '@aacsearch/react';

// Generic type support
const { results } = useSearch<MyProductType>({
  collection: 'products',
});

// results is typed as SearchResult<MyProductType>
```

## API Reference

### Hook Options

All hooks support common options:

```typescript
interface CommonOptions {
  collection: string;
  autoFetch?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: AACSearchError) => void;
}
```

### useSearch Options

```typescript
interface UseSearchOptions {
  collection: string;
  initialQuery?: string;
  autoSearch?: boolean;
  onSuccess?: (results: SearchResult) => void;
  onError?: (error: AACSearchError) => void;
}
```

### useInstantSearch Options

```typescript
interface UseInstantSearchOptions {
  collection: string;
  searchFields: string[];
  facetFields?: string[];
  debounceMs?: number;
  resultsPerPage?: number;
  defaultFilters?: Record<string, string[]>;
  defaultSortBy?: string;
}
```

## Examples

Check the [examples](./examples) directory:

- `basic-search.tsx` - Simple search
- `instant-search.tsx` - Advanced search with filters
- `nextjs-example.tsx` - Next.js integration
- `sdk-usage.ts` - SDK without React

## Framework Support

- React 16.8+ (Hooks)
- Next.js (App Router & Pages Router)
- Remix
- Vite
- Create React App

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT - See [LICENSE](./LICENSE)

## Links

- [Documentation](https://docs.aacsearch.com)
- [Extended Features Guide](./README_EXTENDED.md)
- [Examples](./examples)
- [Changelog](./CHANGELOG.md)
- [Discord Community](https://discord.gg/aacsearch)

## Support

- Email: support@aacsearch.com
- Issues: https://github.com/aacsearch/react/issues
- Documentation: https://docs.aacsearch.com
