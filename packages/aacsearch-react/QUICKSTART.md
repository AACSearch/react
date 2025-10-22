# Quick Start Guide

Get started with @aacsearch/react in 5 minutes!

## Installation

```bash
npm install @aacsearch/react
```

## Step 1: Get Your API Key

1. Sign up at https://aacsearch.com
2. Create a new project
3. Generate an API key from the dashboard

## Step 2: Wrap Your App

```tsx
import { SearchProvider } from '@aacsearch/react';

function App() {
  return (
    <SearchProvider
      config={{
        apiKey: 'your-api-key-here',
      }}
    >
      <YourApp />
    </SearchProvider>
  );
}
```

## Step 3: Use Search Hooks

### Basic Search

```tsx
import { useSearch } from '@aacsearch/react';

function SearchComponent() {
  const { results, loading, search } = useSearch({
    collection: 'products',
  });

  return (
    <div>
      <input
        onChange={(e) => search({ q: e.target.value })}
        placeholder="Search..."
      />

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

### Instant Search (All-in-One)

```tsx
import { InstantSearch } from '@aacsearch/react';

function App() {
  return (
    <InstantSearch
      collection="products"
      searchFields={['name', 'description']}
      displayFields={{
        title: 'name',
        description: 'description',
      }}
      filters={[
        { field: 'category', label: 'Category', type: 'checkbox' }
      ]}
    />
  );
}
```

## Step 4: Advanced Usage

### Filters and Facets

```tsx
import { useInstantSearch } from '@aacsearch/react';

function AdvancedSearch() {
  const {
    query,
    setQuery,
    results,
    filters,
    addFilter,
    removeFilter,
  } = useInstantSearch({
    collection: 'products',
    searchFields: ['name', 'description'],
    facetFields: ['category', 'brand'],
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Facets */}
      {results?.facet_counts?.map((facet) => (
        <div key={facet.field_name}>
          <h3>{facet.field_name}</h3>
          {facet.counts.map((count) => (
            <label key={count.value}>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    addFilter(facet.field_name, count.value);
                  } else {
                    removeFilter(facet.field_name, count.value);
                  }
                }}
              />
              {count.value} ({count.count})
            </label>
          ))}
        </div>
      ))}

      {/* Results */}
      {results?.hits.map((hit) => (
        <div key={hit.document.id}>{hit.document.name}</div>
      ))}
    </div>
  );
}
```

### Using SDK Directly

```tsx
import { useClient } from '@aacsearch/react';

function ImportButton() {
  const client = useClient();

  const handleImport = async () => {
    await client.importDocuments({
      collection: 'products',
      documents: [
        { id: '1', name: 'Product 1', price: 99 },
        { id: '2', name: 'Product 2', price: 149 },
      ],
    });
  };

  return <button onClick={handleImport}>Import Data</button>;
}
```

## Common Patterns

### E-commerce Search

```tsx
import { InstantSearch } from '@aacsearch/react';

function ProductSearch() {
  return (
    <InstantSearch
      collection="products"
      searchFields={['name', 'description', 'brand']}
      displayFields={{
        title: 'name',
        description: 'description',
        image: 'image_url',
      }}
      filters={[
        { field: 'category', label: 'Category', type: 'checkbox' },
        { field: 'brand', label: 'Brand', type: 'checkbox' },
        { field: 'price', label: 'Price', type: 'range' },
      ]}
      sorting={[
        { field: 'price', label: 'Price: Low to High', order: 'asc' },
        { field: 'price', label: 'Price: High to Low', order: 'desc' },
        { field: 'rating', label: 'Best Rated', order: 'desc' },
      ]}
      resultsPerPage={20}
      onHitClick={(hit) => {
        window.location.href = `/products/${hit.document.slug}`;
      }}
    />
  );
}
```

### Blog Search

```tsx
import { useSearch, SearchBox, SearchResults } from '@aacsearch/react';

function BlogSearch() {
  const { results, loading, search } = useSearch({
    collection: 'articles',
  });

  return (
    <div>
      <SearchBox
        collection="articles"
        placeholder="Search articles..."
        onSearch={(query, results) => console.log(query, results)}
      />

      <SearchResults
        results={results}
        loading={loading}
        renderHit={(hit) => (
          <article>
            <h2>{hit.document.title}</h2>
            <p>{hit.document.excerpt}</p>
            <time>{hit.document.published_at}</time>
          </article>
        )}
      />
    </div>
  );
}
```

### Multi-Collection Search

```tsx
import { useClient } from '@aacsearch/react';
import { useEffect, useState } from 'react';

function MultiSearch() {
  const client = useClient();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const search = async () => {
      const multiResults = await client.multiSearch([
        { collection: 'products', q: 'laptop', query_by: 'name' },
        { collection: 'articles', q: 'laptop', query_by: 'title,content' },
      ]);
      setResults(multiResults);
    };

    search();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {results[0]?.hits.map((hit) => (
        <div key={hit.document.id}>{hit.document.name}</div>
      ))}

      <h2>Articles</h2>
      {results[1]?.hits.map((hit) => (
        <div key={hit.document.id}>{hit.document.title}</div>
      ))}
    </div>
  );
}
```

## Next Steps

- Read the [full documentation](./README.md)
- Check out [examples](./examples)
- Explore [API reference](./README.md#api-reference)
- Join our [Discord community](https://discord.gg/aacsearch)

## Need Help?

- Documentation: https://docs.aacsearch.com
- Issues: https://github.com/aacsearch/react/issues
- Email: support@aacsearch.com

Happy searching! 🔍
