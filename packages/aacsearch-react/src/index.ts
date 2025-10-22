/**
 * AACSearch React Library
 * Main entry point - Data & Logic Layer (No UI Components)
 */

// Clients
export { AACSearchClient } from './client/AACSearchClient';
export { AACSearchClientExtended } from './client/AACSearchClientExtended';
export type { AACSearchConfig } from './types';
export type {
  ConversationalSearchParams,
  ConversationalSearchResult,
  VectorSearchParams,
  RecommendationParams,
  BatchOperationParams,
  StreamingOptions,
} from './client/AACSearchClientExtended';

// Context & Provider
export { SearchProvider, useSearchContext } from './components/SearchProvider';

// Basic Hooks
export { useSearch } from './hooks/useSearch';
export { useCollections } from './hooks/useCollections';
export { useAnalytics } from './hooks/useAnalytics';
export { useApiKeys } from './hooks/useApiKeys';
export { useInstantSearch } from './hooks/useInstantSearch';
export { useClient } from './hooks/useClient';

// Advanced Hooks
export { useConversationalSearch } from './hooks/useConversationalSearch';
export { useRecommendations } from './hooks/useRecommendations';
export { useVectorSearch } from './hooks/useVectorSearch';
export { useRealtime } from './hooks/useRealtime';
export { useAutoSuggest } from './hooks/useAutoSuggest';

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

  // Context Types
  SearchContextValue,
  SearchProviderProps,
} from './types';

// Advanced Hook Types
export type {
  UseConversationalSearchOptions,
  UseConversationalSearchResult,
} from './hooks/useConversationalSearch';

export type {
  UseRecommendationsOptions,
  UseRecommendationsResult,
} from './hooks/useRecommendations';

export type {
  UseVectorSearchOptions,
  UseVectorSearchResult,
} from './hooks/useVectorSearch';

export type {
  UseRealtimeOptions,
  UseRealtimeResult,
  RealtimeUpdate,
} from './hooks/useRealtime';

export type {
  UseAutoSuggestOptions,
  UseAutoSuggestResult,
  Suggestion,
} from './hooks/useAutoSuggest';
