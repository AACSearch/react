# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-20

### Added

- Initial release of @aacsearch/react
- Core SDK client for interacting with AACSearch API
- React hooks:
  - `useSearch` - Basic search functionality
  - `useInstantSearch` - Advanced instant search with filters and facets
  - `useCollections` - Collection management
  - `useAnalytics` - Analytics data
  - `useApiKeys` - API key management
- React components:
  - `SearchProvider` - Context provider
  - `SearchBox` - Search input component
  - `SearchResults` - Results display component
  - `InstantSearch` - Complete instant search UI
  - `Facets` - Faceted navigation component
  - `Pagination` - Pagination component
- TypeScript type definitions
- Comprehensive documentation
- Usage examples
- Support for ESM and CommonJS
- Tree-shakeable exports

### Features

- Multi-tenant architecture support
- Real-time search with debouncing
- Faceted navigation and filtering
- Advanced search parameters (filters, sorting, typo tolerance, etc.)
- Analytics tracking
- Document management (CRUD operations)
- API key management
- Queue management integration
- Widget configuration support
- Full TypeScript support
- Framework agnostic SDK

### Documentation

- Complete README with API reference
- Basic search example
- Instant search example
- Next.js integration example
- SDK usage example

## [Unreleased]

### Planned

- Server-side rendering support
- Custom analytics dashboard component
- Advanced widget builder UI
- Voice search integration
- Search suggestions component
- Saved searches functionality
- Export/import utilities
- Performance monitoring dashboard
