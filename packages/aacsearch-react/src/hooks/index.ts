/**
 * React Hooks for AACSearch
 */

// Basic Hooks
export { useSearch } from './useSearch';
export { useCollections } from './useCollections';
export { useAnalytics } from './useAnalytics';
export { useApiKeys } from './useApiKeys';
export { useInstantSearch } from './useInstantSearch';
export { useClient } from './useClient';

// Advanced Hooks
export { useConversationalSearch } from './useConversationalSearch';
export { useRecommendations } from './useRecommendations';
export { useVectorSearch } from './useVectorSearch';
export { useRealtime } from './useRealtime';
export { useAutoSuggest } from './useAutoSuggest';

// Types
export type { UseSearchOptions } from './useSearch';
export type { UseCollectionsOptions } from './useCollections';
export type { UseAnalyticsOptions } from './useAnalytics';
export type { UseApiKeysOptions } from './useApiKeys';
export type { UseInstantSearchOptions, UseInstantSearchResult } from './useInstantSearch';
export type { UseConversationalSearchOptions, UseConversationalSearchResult } from './useConversationalSearch';
export type { UseRecommendationsOptions, UseRecommendationsResult } from './useRecommendations';
export type { UseVectorSearchOptions, UseVectorSearchResult } from './useVectorSearch';
export type { UseRealtimeOptions, UseRealtimeResult, RealtimeUpdate } from './useRealtime';
export type { UseAutoSuggestOptions, UseAutoSuggestResult, Suggestion } from './useAutoSuggest';
