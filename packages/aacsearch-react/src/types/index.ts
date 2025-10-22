/**
 * AACSearch React Library - TypeScript Types
 * Complete type definitions for AACSearch SaaS platform
 */

// ==================== Configuration Types ====================

export interface AACSearchConfig {
  apiKey: string;
  endpoint?: string;
  tenant?: string;
  timeout?: number;
}

// ==================== Search Types ====================

export interface SearchParams {
  q: string;
  collection: string;
  query_by?: string;
  filter_by?: string;
  sort_by?: string;
  facet_by?: string;
  max_facet_values?: number;
  page?: number;
  per_page?: number;
  typo_tolerance?: boolean | number;
  prefix?: boolean;
  num_typos?: number;
  min_len_1typo?: number;
  min_len_2typo?: number;
  split_join_tokens?: 'off' | 'fallback' | 'always';
  exhaustive_search?: boolean;
  drop_tokens_threshold?: number;
  limit_hits?: number;
  highlight_fields?: string;
  highlight_full_fields?: string;
  snippet_threshold?: number;
  pre_segmented_query?: boolean;
  enable_overrides?: boolean;
  prioritize_exact_match?: boolean;
  search_cutoff_ms?: number;
  use_cache?: boolean;
  max_candidates?: number;
  offset?: number;
  group_by?: string;
  group_limit?: number;
}

export interface SearchResult<T = any> {
  facet_counts?: FacetCount[];
  found: number;
  hits: SearchHit<T>[];
  out_of: number;
  page: number;
  request_params: RequestParams;
  search_cutoff: boolean;
  search_time_ms: number;
}

export interface SearchHit<T = any> {
  document: T;
  highlights?: Highlight[];
  text_match: number;
  text_match_info?: TextMatchInfo;
}

export interface Highlight {
  field: string;
  matched_tokens: string[];
  snippet: string;
  snippets?: string[];
  indices?: number[];
  value?: string;
}

export interface TextMatchInfo {
  best_field_score: string;
  best_field_weight: number;
  fields_matched: number;
  score: string;
  tokens_matched: number;
}

export interface FacetCount {
  counts: Array<{
    count: number;
    highlighted: string;
    value: string;
  }>;
  field_name: string;
  stats?: {
    avg?: number;
    max?: number;
    min?: number;
    sum?: number;
    total_values?: number;
  };
}

export interface RequestParams {
  collection_name: string;
  per_page: number;
  q: string;
}

// ==================== Collection Types ====================

export interface Collection {
  id: string;
  name: string;
  description?: string;
  tenant: string;
  fields: CollectionField[];
  default_sorting_field?: string;
  token_separators?: string[];
  symbols_to_index?: string[];
  created_at: string;
  updated_at: string;
  num_documents?: number;
  status?: 'active' | 'inactive' | 'error';
}

export interface CollectionField {
  name: string;
  type: FieldType;
  facet?: boolean;
  optional?: boolean;
  index?: boolean;
  sort?: boolean;
  infix?: boolean;
  locale?: string;
  store?: boolean;
}

export type FieldType =
  | 'string'
  | 'int32'
  | 'int64'
  | 'float'
  | 'bool'
  | 'string[]'
  | 'int32[]'
  | 'int64[]'
  | 'float[]'
  | 'bool[]'
  | 'object'
  | 'object[]'
  | 'auto'
  | 'string*'
  | 'geopoint'
  | 'geopoint[]'
  | 'image';

export interface CreateCollectionInput {
  name: string;
  description?: string;
  fields: CollectionField[];
  default_sorting_field?: string;
  token_separators?: string[];
  symbols_to_index?: string[];
}

export interface UpdateCollectionInput {
  fields?: CollectionField[];
  default_sorting_field?: string;
}

// ==================== Document Types ====================

export interface Document {
  id?: string;
  [key: string]: any;
}

export interface ImportDocumentsParams {
  collection: string;
  documents: Document[];
  action?: 'create' | 'update' | 'upsert' | 'emplace';
  batch_size?: number;
  return_id?: boolean;
  return_doc?: boolean;
}

export interface ImportResponse {
  success: boolean;
  num_imported: number;
  import_errors?: ImportError[];
}

export interface ImportError {
  code: number;
  document: string;
  error: string;
}

export interface DeleteDocumentParams {
  collection: string;
  id: string;
}

export interface UpsertDocumentParams {
  collection: string;
  document: Document;
}

// ==================== API Key Types ====================

export interface ApiKey {
  id: string;
  name: string;
  description?: string;
  value?: string;
  value_prefix: string;
  tenant: string;
  collections: string[];
  permissions: ApiKeyPermission[];
  expires_at?: string;
  created_at: string;
  updated_at: string;
  last_used_at?: string;
  usage_count?: number;
}

export type ApiKeyPermission = 'read_only' | 'write_only' | 'read_write' | 'admin';

export interface CreateApiKeyInput {
  name: string;
  description?: string;
  collections: string[];
  permissions: ApiKeyPermission[];
  expires_at?: string;
}

// ==================== Analytics Types ====================

export interface AnalyticsParams {
  start_date?: string;
  end_date?: string;
  collection?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
}

export interface AnalyticsData {
  total_searches: number;
  unique_users: number;
  avg_response_time: number;
  total_documents: number;
  top_queries: TopQuery[];
  no_results_queries: TopQuery[];
  search_volume: TimeSeriesData[];
  performance_metrics: PerformanceMetrics;
  collection_stats?: CollectionStats[];
}

export interface TopQuery {
  query: string;
  count: number;
  avg_response_time?: number;
  no_results_rate?: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface PerformanceMetrics {
  avg_latency: number;
  p50_latency: number;
  p95_latency: number;
  p99_latency: number;
  success_rate: number;
  error_rate: number;
}

export interface CollectionStats {
  collection: string;
  total_searches: number;
  avg_response_time: number;
  total_documents: number;
}

// ==================== Tenant Types ====================

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  slug: string;
  status: 'active' | 'suspended' | 'cancelled';
  plan: TenantPlan;
  settings: TenantSettings;
  created_at: string;
  updated_at: string;
}

export interface TenantPlan {
  name: string;
  limits: {
    collections: number;
    documents: number;
    searches_per_month: number;
    api_keys: number;
  };
  current_usage: {
    collections: number;
    documents: number;
    searches_this_month: number;
    api_keys: number;
  };
}

export interface TenantSettings {
  branding?: {
    logo?: string;
    primary_color?: string;
    secondary_color?: string;
  };
  features?: {
    analytics_enabled: boolean;
    webhooks_enabled: boolean;
    api_access_enabled: boolean;
  };
}

// ==================== Queue Types ====================

export interface QueueJob {
  id: string;
  name: string;
  data: any;
  progress: number;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  attempts: number;
  timestamp: number;
  processedOn?: number;
  finishedOn?: number;
  failedReason?: string;
  returnvalue?: any;
}

export interface QueueStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

// ==================== Widget Types ====================

export interface WidgetConfig {
  id?: string;
  name: string;
  type: WidgetType;
  collection: string;
  configuration: WidgetConfiguration;
  styling?: WidgetStyling;
}

export type WidgetType =
  | 'search-box'
  | 'search-page'
  | 'instant-search'
  | 'autocomplete'
  | 'search-results'
  | 'category-browser';

export interface WidgetConfiguration {
  placeholder?: string;
  search_fields: string[];
  results_per_page?: number;
  typo_tolerance?: boolean;
  display_fields: {
    title: string;
    description?: string;
    image?: string;
    additional?: string[];
  };
  filters?: WidgetFilter[];
  sorting?: WidgetSorting[];
}

export interface WidgetFilter {
  field: string;
  label: string;
  type: 'checkbox' | 'range' | 'select';
}

export interface WidgetSorting {
  field: string;
  label: string;
  order: 'asc' | 'desc';
}

export interface WidgetStyling {
  theme?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  borderRadius?: number;
  fontFamily?: string;
  customCSS?: string;
}

// ==================== Error Types ====================

export interface AACSearchError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

// ==================== Hook Return Types ====================

export interface UseSearchResult<T = any> {
  results: SearchResult<T> | null;
  loading: boolean;
  error: AACSearchError | null;
  search: (params: Omit<SearchParams, 'collection'>) => Promise<void>;
  reset: () => void;
}

export interface UseCollectionsResult {
  collections: Collection[];
  loading: boolean;
  error: AACSearchError | null;
  createCollection: (data: CreateCollectionInput) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export interface UseAnalyticsResult {
  analytics: AnalyticsData | null;
  loading: boolean;
  error: AACSearchError | null;
  fetchAnalytics: (params?: AnalyticsParams) => Promise<void>;
}

export interface UseApiKeysResult {
  apiKeys: ApiKey[];
  loading: boolean;
  error: AACSearchError | null;
  createApiKey: (data: CreateApiKeyInput) => Promise<ApiKey>;
  deleteApiKey: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

// ==================== Component Props Types ====================

export interface SearchBoxProps {
  collection: string;
  placeholder?: string;
  onSearch?: (query: string, results: SearchResult) => void;
  onError?: (error: AACSearchError) => void;
  autoFocus?: boolean;
  debounceMs?: number;
  minChars?: number;
  className?: string;
  showSearchButton?: boolean;
}

export interface SearchResultsProps<T = any> {
  results: SearchResult<T> | null;
  loading?: boolean;
  renderHit?: (hit: SearchHit<T>) => React.ReactNode;
  onHitClick?: (hit: SearchHit<T>) => void;
  className?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

export interface InstantSearchProps {
  collection: string;
  searchFields: string[];
  displayFields: {
    title: string;
    description?: string;
    image?: string;
  };
  placeholder?: string;
  filters?: WidgetFilter[];
  sorting?: WidgetSorting[];
  resultsPerPage?: number;
  onHitClick?: (hit: SearchHit) => void;
  className?: string;
}

export interface FiltersProps {
  facets: FacetCount[] | undefined;
  selectedFilters: Record<string, string[]>;
  onFilterChange: (field: string, values: string[]) => void;
  className?: string;
}

export interface FacetsProps {
  facetCounts: FacetCount[] | undefined;
  selectedFacets: Record<string, string[]>;
  onFacetChange: (field: string, value: string, checked: boolean) => void;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface SearchProviderProps {
  config: AACSearchConfig;
  children: React.ReactNode;
}

// ==================== Context Types ====================

export interface SearchContextValue {
  client: any; // Will be AACSearchClient
  config: AACSearchConfig;
}
