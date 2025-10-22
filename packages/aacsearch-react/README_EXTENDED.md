# @aacsearch/react - Extended Features Documentation

## Advanced Features Overview

@aacsearch/react provides comprehensive search capabilities including:

- **AI-Powered Conversational Search** - Natural language Q&A with streaming responses
- **Vector/Semantic Search** - Find similar content using embeddings
- **Smart Recommendations** - Personalized content recommendations
- **Real-time Updates** - WebSocket integration for live data
- **Auto-suggest** - Intelligent autocomplete
- **Batch Operations** - Bulk data operations
- **Performance Tracking** - A/B testing and analytics

---

## 🤖 AI-Powered Conversational Search

Natural language search with context awareness and streaming responses.

### Hook: useConversationalSearch

```tsx
import { useConversationalSearch } from '@aacsearch/react';

function ChatSearch() {
  const { messages, sendMessage, isLoading, isStreaming } = useConversationalSearch({
    collection: 'products',
    streaming: true, // Enable streaming responses
    onChunk: (chunk) => console.log('Received:', chunk),
  });

  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx} className={msg.role}>
          {msg.content}
          {msg.sources && msg.sources.length > 0 && (
            <div>Sources: {msg.sources.length} items</div>
          )}
        </div>
      ))}

      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
        placeholder="Ask anything..."
        disabled={isLoading}
      />
    </div>
  );
}
```

### Direct SDK Usage

```typescript
const client = new AACSearchClientExtended({ apiKey: 'xxx' });

// Non-streaming
const result = await client.conversationalSearch({
  message: 'Find me affordable laptops',
  collection: 'products',
});

console.log(result.answer); // AI-generated answer
console.log(result.sources); // Relevant products
console.log(result.suggested_questions); // Follow-up questions

// Streaming
await client.conversationalSearch(
  {
    message: 'Tell me about MacBook Pro',
    collection: 'products',
    streaming: true,
  },
  {
    onChunk: (chunk) => process.stdout.write(chunk),
    onComplete: () => console.log('\nDone!'),
  }
);
```

---

## 🔍 Vector/Semantic Search

Find similar content using vector embeddings.

### Hook: useVectorSearch

```tsx
import { useVectorSearch } from '@aacsearch/react';

function SemanticSearch() {
  const { results, loading, searchByText, searchByVector } = useVectorSearch({
    collection: 'articles',
    k: 20,
  });

  const handleSemanticSearch = async (query: string) => {
    // Search by text (will be vectorized automatically)
    await searchByText(query);
  };

  const handleSimilarItems = async () => {
    // Search by vector directly
    const vector = [0.123, 0.456, ...]; // 768-dim vector
    await searchByVector(vector);
  };

  return (
    <div>
      <input onChange={(e) => handleSemanticSearch(e.target.value)} />

      {results?.hits.map((hit) => (
        <div key={hit.document.id}>
          {hit.document.title}
          <span>Similarity: {hit.text_match}</span>
        </div>
      ))}
    </div>
  );
}
```

### Direct SDK Usage

```typescript
// Hybrid search (combines keyword + vector)
const results = await client.hybridSearch({
  q: 'laptop',
  query_vector: embeddings,
  collection: 'products',
  filter_by: 'price:<1000',
});

// Generate embeddings
const { embeddings } = await client.generateEmbeddings([
  'MacBook Pro 16-inch',
  'Dell XPS 15',
]);

// Similar items
const similar = await client.getSimilarItems('products', 'item-123', 10);
```

---

## 🎯 Smart Recommendations

Personalized recommendations using collaborative filtering and content-based algorithms.

### Hook: useRecommendations

```tsx
import { useRecommendations } from '@aacsearch/react';

function RecommendedProducts({ userId }: { userId: string }) {
  const { recommendations, loading, fetchRecommendations } = useRecommendations({
    collection: 'products',
    userId,
    limit: 10,
    algorithm: 'hybrid', // 'collaborative' | 'content-based' | 'hybrid'
    autoFetch: true,
    refreshInterval: 60000, // Refresh every minute
  });

  return (
    <div>
      <h2>Recommended for You</h2>
      {loading && <p>Loading recommendations...</p>}

      {recommendations?.hits.map((hit) => (
        <div key={hit.document.id}>
          {hit.document.name}
          <span>Score: {hit.text_match.toFixed(2)}</span>
        </div>
      ))}

      <button onClick={() => fetchRecommendations({ limit: 20 })}>
        Load More
      </button>
    </div>
  );
}
```

### Direct SDK Usage

```typescript
// Get recommendations for a user
const recs = await client.getRecommendations({
  collection: 'products',
  user_id: 'user-123',
  limit: 10,
  algorithm: 'hybrid',
  exclude_viewed: true,
});

// Get recommendations based on an item
const similar = await client.getRecommendations({
  collection: 'products',
  item_id: 'product-456',
  limit: 10,
  algorithm: 'content-based',
});

// Update user profile for better recommendations
await client.updateUserProfile('user-123', {
  interests: ['technology', 'gaming', 'photography'],
  preferences: {
    price_range: [500, 2000],
    brands: ['Apple', 'Sony'],
  },
});
```

---

## ⚡ Real-time Updates

WebSocket integration for live data updates.

### Hook: useRealtime

```tsx
import { useRealtime } from '@aacsearch/react';

function LiveDashboard() {
  const { connected, updates, subscribe } = useRealtime({
    autoConnect: true,
    onUpdate: (update) => {
      console.log('New update:', update.type, update.document);
    },
  });

  useEffect(() => {
    if (connected) {
      subscribe('products');
      subscribe('orders');
    }
  }, [connected]);

  return (
    <div>
      <div>Status: {connected ? 'Connected' : 'Disconnected'}</div>

      <div>
        <h3>Recent Updates</h3>
        {updates.slice(-10).map((update, idx) => (
          <div key={idx}>
            {update.type} in {update.collection}: {update.document.name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Direct SDK Usage

```typescript
// Connect to WebSocket
client.connectWebSocket(
  (data) => {
    console.log('Message:', data);
  },
  (error) => {
    console.error('WebSocket error:', error);
  }
);

// Subscribe to collection updates
client.subscribeToCollection('products', (update) => {
  if (update.type === 'create') {
    console.log('New product:', update.document);
  }
});

// Disconnect when done
client.disconnectWebSocket();
```

---

## 💡 Auto-suggest / Autocomplete

Intelligent search suggestions as users type.

### Hook: useAutoSuggest

```tsx
import { useAutoSuggest } from '@aacsearch/react';

function SearchWithAutocomplete() {
  const [query, setQuery] = useState('');

  const { suggestions, loading, getSuggestions, selectSuggestion } = useAutoSuggest({
    collection: 'products',
    debounceMs: 150,
    minChars: 2,
    limit: 5,
  });

  const handleInputChange = (value: string) => {
    setQuery(value);
    getSuggestions(value);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search products..."
      />

      {loading && <div>Loading suggestions...</div>}

      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              onClick={() => {
                setQuery(suggestion.value);
                selectSuggestion(suggestion.value);
              }}
              dangerouslySetInnerHTML={{ __html: suggestion.highlighted }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Direct SDK Usage

```typescript
const { suggestions } = await client.autoSuggest('lapt', 'products', {
  limit: 5,
  fields: ['name', 'description'],
});

// Spell check
const { corrected, suggestions: alternates } = await client.spellCheck(
  'mackbook pro',
  'products'
);
console.log('Did you mean:', corrected); // "macbook pro"

// Get popular searches
const popular = await client.getPopularSearches('products', 'day', 10);
console.log(popular); // [{ query: "iphone 15", count: 1234 }, ...]

// Get trending items
const trending = await client.getTrendingItems('products', 'day', 20);
```

---

## 📊 Advanced Analytics & Tracking

Track user behavior and search performance.

### User Event Tracking

```typescript
// Track various events
await client.trackUserEvent({
  type: 'search',
  user_id: 'user-123',
  session_id: 'session-456',
  query: 'macbook pro',
  collection: 'products',
});

await client.trackUserEvent({
  type: 'click',
  user_id: 'user-123',
  item_id: 'product-789',
  collection: 'products',
  metadata: {
    position: 3,
    query: 'macbook pro',
  },
});

await client.trackUserEvent({
  type: 'purchase',
  user_id: 'user-123',
  item_id: 'product-789',
  metadata: {
    price: 2499,
    quantity: 1,
  },
});
```

### Performance Metrics

```typescript
// Get search performance
const metrics = await client.getSearchPerformance('products', 'last_7_days');

console.log(metrics);
// {
//   avg_response_time: 45,
//   p50_response_time: 38,
//   p95_response_time: 120,
//   p99_response_time: 200,
//   total_searches: 15234,
//   cache_hit_rate: 0.78
// }
```

### A/B Testing

```typescript
// Get A/B test variant for user
const { variant, config } = await client.getABTestVariant('search-algo-test', 'user-123');

// Use variant-specific search parameters
const results = await client.search({
  q: query,
  collection: 'products',
  ...config.search_params, // Variant-specific params
});

// Get A/B test results
const testResults = await client.getABTestResults('search-algo-test');

console.log(testResults);
// {
//   variants: [
//     { name: 'control', traffic_percent: 50, conversion_rate: 0.12, confidence: 95 },
//     { name: 'variant_a', traffic_percent: 50, conversion_rate: 0.15, confidence: 95 }
//   ],
//   winner: 'variant_a',
//   status: 'completed'
// }
```

---

## 🔄 Batch Operations

Perform multiple operations efficiently.

```typescript
await client.batchOperations({
  collection: 'products',
  operations: [
    {
      action: 'index',
      document: { id: '1', name: 'Product 1', price: 99 },
    },
    {
      action: 'update',
      id: '2',
      document: { price: 149 },
    },
    {
      action: 'delete',
      id: '3',
    },
  ],
});

// Export search results
const blob = await client.exportResults(
  {
    q: '*',
    collection: 'products',
    filter_by: 'category:=Electronics',
  },
  'csv' // or 'json', 'xml'
);

// Download the file
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'search-results.csv';
a.click();
```

---

## 🚀 Complete Example: E-commerce Search

```tsx
import {
  SearchProvider,
  useInstantSearch,
  useRecommendations,
  useConversationalSearch,
  useAutoSuggest,
  useRealtime,
} from '@aacsearch/react';

function EcommerceSearch() {
  const [query, setQuery] = useState('');

  // Main search
  const {
    results,
    loading,
    filters,
    addFilter,
    page,
    setPage,
  } = useInstantSearch({
    collection: 'products',
    searchFields: ['name', 'description', 'brand'],
    facetFields: ['category', 'brand', 'price_range'],
  });

  // Autocomplete
  const { suggestions, getSuggestions } = useAutoSuggest({
    collection: 'products',
    limit: 5,
  });

  // Recommendations
  const { recommendations } = useRecommendations({
    collection: 'products',
    userId: 'user-123',
    limit: 6,
  });

  // Chat assistant
  const { messages, sendMessage } = useConversationalSearch({
    collection: 'products',
    streaming: true,
  });

  // Real-time inventory updates
  const { updates } = useRealtime({
    collection: 'products',
    autoConnect: true,
  });

  return (
    <div className="ecommerce-search">
      {/* Search Input */}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          getSuggestions(e.target.value);
        }}
        placeholder="Search products..."
      />

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => setQuery(s.value)}>
              {s.value}
            </li>
          ))}
        </ul>
      )}

      {/* Filters */}
      <aside>
        {results?.facet_counts?.map((facet) => (
          <div key={facet.field_name}>
            <h4>{facet.field_name}</h4>
            {facet.counts.map((count) => (
              <label key={count.value}>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked
                      ? addFilter(facet.field_name, count.value)
                      : removeFilter(facet.field_name, count.value)
                  }
                />
                {count.value} ({count.count})
              </label>
            ))}
          </div>
        ))}
      </aside>

      {/* Results */}
      <main>
        {loading && <div>Loading...</div>}

        <div className="products">
          {results?.hits.map((hit) => (
            <div key={hit.document.id} className="product">
              <img src={hit.document.image} alt={hit.document.name} />
              <h3>{hit.document.name}</h3>
              <p>${hit.document.price}</p>
              {updates.some((u) => u.document.id === hit.document.id) && (
                <span className="badge">Just Updated!</span>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </main>

      {/* Recommendations */}
      <section className="recommendations">
        <h2>Recommended for You</h2>
        <div className="products">
          {recommendations?.hits.map((hit) => (
            <div key={hit.document.id} className="product">
              <img src={hit.document.image} alt={hit.document.name} />
              <h3>{hit.document.name}</h3>
              <p>${hit.document.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat Assistant */}
      <div className="chat-assistant">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role}>
              {msg.content}
            </div>
          ))}
        </div>
        <input
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
          placeholder="Ask me anything..."
        />
      </div>
    </div>
  );
}

// App root
function App() {
  return (
    <SearchProvider
      config={{
        apiKey: process.env.REACT_APP_AACSEARCH_API_KEY!,
        endpoint: 'https://api.aacsearch.com',
      }}
    >
      <EcommerceSearch />
    </SearchProvider>
  );
}
```

---

## 🎨 UI Components

**Note:** This library focuses on data and logic. For pre-built UI components, use:

- **@aacsearch/ui** - Complete UI component library with themes
- **@aacsearch/widgets** - Embeddable search widgets
- **Platform integrations** - WordPress, Shopify, Bitrix plugins

---

## 📚 Additional Resources

- [Full API Documentation](https://docs.aacsearch.com)
- [Examples Repository](https://github.com/aacsearch/examples)
- [Community Discord](https://discord.gg/aacsearch)
- [Blog & Tutorials](https://aacsearch.com/blog)

## Support

- Email: support@aacsearch.com
- Documentation: https://docs.aacsearch.com
- Issues: https://github.com/aacsearch/react/issues
