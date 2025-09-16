# AACSearch React

React components and hooks for AACSearch - Build search interfaces faster.

## 🚀 Features

- **Ready-to-Use Components**: Pre-built search UI components
- **Custom Hooks**: Powerful React hooks for search functionality
- **TypeScript Support**: Full type safety with TypeScript
- **Customizable**: Highly customizable with CSS-in-JS and CSS variables
- **Performance Optimized**: Built with React best practices and optimizations
- **Accessibility**: WCAG compliant components

## 📦 Installation

```bash
npm install @aacsearch/react @aacsearch/sdk
# or
yarn add @aacsearch/react @aacsearch/sdk
# or
pnpm add @aacsearch/react @aacsearch/sdk
```

## 🛠 Quick Start

```tsx
import { AACSearchProvider, SearchBox, SearchResults } from '@aacsearch/react';

function App() {
  return (
    <AACSearchProvider
      apiKey="your-api-key"
      organizationId="your-org-id"
    >
      <div className="search-app">
        <SearchBox placeholder="Search anything..." />
        <SearchResults />
      </div>
    </AACSearchProvider>
  );
}
```

## 🧩 Components

### SearchBox

```tsx
import { SearchBox } from '@aacsearch/react';

<SearchBox
  placeholder="Type your search query..."
  autoFocus={true}
  showSuggestions={true}
  onSearch={(query) => console.log(query)}
  className="custom-search-box"
/>
```

### SearchResults

```tsx
import { SearchResults } from '@aacsearch/react';

<SearchResults
  showLoadingState={true}
  showEmptyState={true}
  renderResult={(result) => (
    <div>
      <h3>{result.title}</h3>
      <p>{result.snippet}</p>
    </div>
  )}
  onResultClick={(result) => console.log('Clicked:', result)}
/>
```

### SearchFilters

```tsx
import { SearchFilters } from '@aacsearch/react';

<SearchFilters
  filters={[
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { value: 'tech', label: 'Technology' },
        { value: 'business', label: 'Business' }
      ]
    },
    {
      name: 'date',
      type: 'daterange',
      label: 'Date Range'
    }
  ]}
/>
```

### Pagination

```tsx
import { Pagination } from '@aacsearch/react';

<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log('Page:', page)}
  showQuickJumper={true}
/>
```

### SearchStats

```tsx
import { SearchStats } from '@aacsearch/react';

<SearchStats
  showResultCount={true}
  showSearchTime={true}
  format="Found {count} results in {time}ms"
/>
```

## 🪝 Hooks

### useSearch

```tsx
import { useSearch } from '@aacsearch/react';

function CustomSearch() {
  const {
    query,
    results,
    loading,
    error,
    search,
    filters,
    setFilters
  } = useSearch({
    initialQuery: '',
    autoSearch: true,
    debounceMs: 300
  });

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => search(e.target.value)}
      />
      {loading && <div>Loading...</div>}
      {results?.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}
```

### useSearchSuggestions

```tsx
import { useSearchSuggestions } from '@aacsearch/react';

function SearchWithSuggestions() {
  const {
    suggestions,
    loading,
    getSuggestions
  } = useSearchSuggestions();

  return (
    <div>
      <input onChange={(e) => getSuggestions(e.target.value)} />
      {suggestions.map(suggestion => (
        <div key={suggestion}>{suggestion}</div>
      ))}
    </div>
  );
}
```

### useSearchHistory

```tsx
import { useSearchHistory } from '@aacsearch/react';

function SearchHistory() {
  const {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory
  } = useSearchHistory({ maxItems: 10 });

  return (
    <div>
      <h3>Recent Searches</h3>
      {history.map(item => (
        <div key={item.id}>
          {item.query} 
          <button onClick={() => removeFromHistory(item.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
```

## 🎨 Styling & Theming

### CSS Variables

```css
:root {
  --aacsearch-primary-color: #3b82f6;
  --aacsearch-border-radius: 8px;
  --aacsearch-font-size: 16px;
  --aacsearch-spacing: 16px;
}
```

### Custom Theme

```tsx
import { AACSearchProvider, defaultTheme } from '@aacsearch/react';

const customTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#ff6b6b',
    secondary: '#4ecdc4'
  }
};

<AACSearchProvider theme={customTheme}>
  <YourApp />
</AACSearchProvider>
```

### Styled Components

```tsx
import styled from 'styled-components';
import { SearchBox } from '@aacsearch/react';

const StyledSearchBox = styled(SearchBox)`
  .aacsearch-search-input {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
`;
```

## 🔧 Advanced Usage

### Custom Search Provider

```tsx
import { createSearchProvider } from '@aacsearch/react';

const CustomProvider = createSearchProvider({
  apiKey: process.env.REACT_APP_AACSEARCH_KEY,
  baseUrl: 'https://custom-api.example.com',
  defaultFilters: { language: 'en' },
  transformResults: (results) => 
    results.map(r => ({ ...r, customField: 'value' }))
});

function App() {
  return (
    <CustomProvider>
      <YourSearchInterface />
    </CustomProvider>
  );
}
```

### Server-Side Rendering (SSR)

```tsx
// pages/_app.tsx (Next.js)
import { AACSearchProvider } from '@aacsearch/react';

function MyApp({ Component, pageProps }) {
  return (
    <AACSearchProvider 
      apiKey={process.env.AACSEARCH_API_KEY}
      ssrMode={true}
    >
      <Component {...pageProps} />
    </AACSearchProvider>
  );
}
```

### Error Handling

```tsx
import { ErrorBoundary } from '@aacsearch/react';

<ErrorBoundary
  fallback={({ error }) => <div>Search Error: {error.message}</div>}
  onError={(error, errorInfo) => console.error(error)}
>
  <SearchComponents />
</ErrorBoundary>
```

## 📱 Responsive Design

All components are mobile-first and responsive:

```tsx
<SearchBox
  responsive={{
    mobile: { placeholder: "Search...", compact: true },
    tablet: { showSuggestions: true },
    desktop: { showAdvancedFilters: true }
  }}
/>
```

## ♿ Accessibility Features

- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatible
- Focus management
- High contrast support

## 🔗 Links

- [📚 Documentation](https://docs.aacsearch.com/react)
- [🎮 Playground](https://playground.aacsearch.com/react)
- [🌐 AACSearch Platform](https://aacsearch.com)
- [🐛 Issues](https://github.com/AACSearch/react/issues)

## 📄 License

MIT © [AACSearch](https://github.com/AACSearch)