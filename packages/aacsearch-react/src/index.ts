/**
 * AACSearch React Library
 * Main entry point
 */

// Client
export { AACSearchClient } from './client/AACSearchClient';
export type { AACSearchConfig } from './types';

// Context & Provider
export { SearchProvider, useSearchContext } from './components/SearchProvider';

// Hooks
export { useSearch } from './hooks/useSearch';
export { useCollections } from './hooks/useCollections';
export { useAnalytics } from './hooks/useAnalytics';
export { useApiKeys } from './hooks/useApiKeys';
export { useInstantSearch } from './hooks/useInstantSearch';
export { useClient } from './hooks/useClient';

// Components
export { SearchBox } from './components/SearchBox';
export { SearchResults } from './components/SearchResults';
export { InstantSearch } from './components/InstantSearch';
export { Facets } from './components/Facets';
export { Pagination } from './components/Pagination';

// Types
export type {
  // Search Types
  SearchParams,
  SearchResult,
  SearchHit,
  Highlight,
  TextMatchInfo,
  FacetCount,
  RequestParams,

  // Collection Types
  Collection,
  CollectionField,
  FieldType,
  CreateCollectionInput,
  UpdateCollectionInput,

  // Document Types
  Document,
  ImportDocumentsParams,
  ImportResponse,
  ImportError,
  DeleteDocumentParams,
  UpsertDocumentParams,

  // API Key Types
  ApiKey,
  ApiKeyPermission,
  CreateApiKeyInput,

  // Analytics Types
  AnalyticsParams,
  AnalyticsData,
  TopQuery,
  TimeSeriesData,
  PerformanceMetrics,
  CollectionStats,

  // Tenant Types
  Tenant,
  TenantPlan,
  TenantSettings,

  // Queue Types
  QueueJob,
  QueueStatus,

  // Widget Types
  WidgetConfig,
  WidgetType,
  WidgetConfiguration,
  WidgetFilter,
  WidgetSorting,
  WidgetStyling,

  // Error Types
  AACSearchError,

  // Hook Return Types
  UseSearchResult,
  UseCollectionsResult,
  UseAnalyticsResult,
  UseApiKeysResult,

  // Component Props Types
  SearchBoxProps,
  SearchResultsProps,
  InstantSearchProps,
  FiltersProps,
  FacetsProps,
  PaginationProps,
  SearchProviderProps,

  // Context Types
  SearchContextValue,
} from './types';
