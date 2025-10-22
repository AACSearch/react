/**
 * AACSearch Client SDK
 * Main client for interacting with AACSearch API
 */

import type {
  AACSearchConfig,
  AACSearchError,
  SearchParams,
  SearchResult,
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput,
  ImportDocumentsParams,
  ImportResponse,
  DeleteDocumentParams,
  UpsertDocumentParams,
  Document,
  ApiKey,
  CreateApiKeyInput,
  AnalyticsParams,
  AnalyticsData,
  Tenant,
  QueueStatus,
  WidgetConfig,
} from '../types';

export class AACSearchClient {
  private apiKey: string;
  private endpoint: string;
  private tenant?: string;
  private timeout: number;

  constructor(config: AACSearchConfig) {
    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint || 'https://api.aacsearch.com';
    this.tenant = config.tenant;
    this.timeout = config.timeout || 30000;
  }

  // ==================== Private Methods ====================

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.endpoint}${path}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...options.headers,
    };

    if (this.tenant) {
      headers['X-Tenant-ID'] = this.tenant;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: AACSearchError = {
          message: `API request failed: ${response.statusText}`,
          statusCode: response.status,
        };

        try {
          const errorData = await response.json();
          error.message = errorData.message || error.message;
          error.code = errorData.code;
          error.details = errorData.details;
        } catch {
          // If response is not JSON, keep the default error message
        }

        throw error;
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          code: 'TIMEOUT',
        } as AACSearchError;
      }

      throw error;
    }
  }

  // ==================== Search Methods ====================

  /**
   * Perform a search query
   */
  async search<T = any>(params: SearchParams): Promise<SearchResult<T>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    return this.request<SearchResult<T>>(
      `/api/v1/search?${queryParams.toString()}`,
      { method: 'POST' }
    );
  }

  /**
   * Perform a multi-search query (multiple searches in one request)
   */
  async multiSearch<T = any>(
    searches: SearchParams[]
  ): Promise<Array<SearchResult<T>>> {
    return this.request<Array<SearchResult<T>>>('/api/v1/multi-search', {
      method: 'POST',
      body: JSON.stringify({ searches }),
    });
  }

  // ==================== Collection Methods ====================

  /**
   * Get all collections
   */
  async getCollections(): Promise<Collection[]> {
    return this.request<Collection[]>('/api/v1/admin/collections', {
      method: 'GET',
    });
  }

  /**
   * Get a single collection by name
   */
  async getCollection(name: string): Promise<Collection> {
    return this.request<Collection>(`/api/v1/admin/collections/${name}`, {
      method: 'GET',
    });
  }

  /**
   * Create a new collection
   */
  async createCollection(data: CreateCollectionInput): Promise<Collection> {
    return this.request<Collection>('/api/v1/admin/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a collection
   */
  async updateCollection(
    name: string,
    data: UpdateCollectionInput
  ): Promise<Collection> {
    return this.request<Collection>(`/api/v1/admin/collections/${name}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a collection
   */
  async deleteCollection(name: string): Promise<void> {
    return this.request<void>(`/api/v1/admin/collections/${name}`, {
      method: 'DELETE',
    });
  }

  // ==================== Document Methods ====================

  /**
   * Import multiple documents into a collection
   */
  async importDocuments(params: ImportDocumentsParams): Promise<ImportResponse> {
    const { collection, documents, ...options } = params;

    return this.request<ImportResponse>(
      `/api/v1/collections/${collection}/documents/import`,
      {
        method: 'POST',
        body: JSON.stringify({ documents, ...options }),
      }
    );
  }

  /**
   * Index a single document
   */
  async indexDocument(collection: string, document: Document): Promise<Document> {
    return this.request<Document>(
      `/api/v1/collections/${collection}/documents`,
      {
        method: 'POST',
        body: JSON.stringify(document),
      }
    );
  }

  /**
   * Upsert a document (update if exists, create if not)
   */
  async upsertDocument(params: UpsertDocumentParams): Promise<Document> {
    const { collection, document } = params;

    return this.request<Document>(
      `/api/v1/collections/${collection}/documents`,
      {
        method: 'PUT',
        body: JSON.stringify(document),
      }
    );
  }

  /**
   * Get a document by ID
   */
  async getDocument(collection: string, id: string): Promise<Document> {
    return this.request<Document>(
      `/api/v1/collections/${collection}/documents/${id}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Update a document
   */
  async updateDocument(
    collection: string,
    id: string,
    document: Partial<Document>
  ): Promise<Document> {
    return this.request<Document>(
      `/api/v1/collections/${collection}/documents/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(document),
      }
    );
  }

  /**
   * Delete a document
   */
  async deleteDocument(params: DeleteDocumentParams): Promise<void> {
    const { collection, id } = params;

    return this.request<void>(
      `/api/v1/collections/${collection}/documents/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  /**
   * Delete documents by query
   */
  async deleteDocumentsByQuery(
    collection: string,
    filter_by: string
  ): Promise<{ num_deleted: number }> {
    return this.request<{ num_deleted: number }>(
      `/api/v1/collections/${collection}/documents`,
      {
        method: 'DELETE',
        body: JSON.stringify({ filter_by }),
      }
    );
  }

  // ==================== API Key Methods ====================

  /**
   * Get all API keys
   */
  async getApiKeys(): Promise<ApiKey[]> {
    return this.request<ApiKey[]>('/api/v1/admin/api-keys', {
      method: 'GET',
    });
  }

  /**
   * Create a new API key
   */
  async createApiKey(data: CreateApiKeyInput): Promise<ApiKey> {
    return this.request<ApiKey>('/api/v1/admin/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete an API key
   */
  async deleteApiKey(id: string): Promise<void> {
    return this.request<void>(`/api/v1/admin/api-keys/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Revoke an API key
   */
  async revokeApiKey(id: string): Promise<void> {
    return this.request<void>(`/api/v1/admin/api-keys/${id}/revoke`, {
      method: 'POST',
    });
  }

  // ==================== Analytics Methods ====================

  /**
   * Get analytics data
   */
  async getAnalytics(params?: AnalyticsParams): Promise<AnalyticsData> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const query = queryParams.toString();
    const path = query
      ? `/api/v1/admin/analytics?${query}`
      : '/api/v1/admin/analytics';

    return this.request<AnalyticsData>(path, {
      method: 'GET',
    });
  }

  /**
   * Get search analytics for a specific collection
   */
  async getCollectionAnalytics(
    collection: string,
    params?: AnalyticsParams
  ): Promise<AnalyticsData> {
    return this.getAnalytics({ ...params, collection });
  }

  /**
   * Track a custom event
   */
  async trackEvent(event: {
    type: string;
    collection?: string;
    query?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    return this.request<void>('/api/v1/analytics/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  // ==================== Tenant Methods ====================

  /**
   * Get current tenant information
   */
  async getTenant(): Promise<Tenant> {
    return this.request<Tenant>('/api/v1/admin/tenant', {
      method: 'GET',
    });
  }

  /**
   * Update tenant settings
   */
  async updateTenant(data: Partial<Tenant>): Promise<Tenant> {
    return this.request<Tenant>('/api/v1/admin/tenant', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ==================== Queue Methods ====================

  /**
   * Get queue status
   */
  async getQueueStatus(queueName: string): Promise<QueueStatus> {
    return this.request<QueueStatus>(`/api/v1/admin/queues/${queueName}`, {
      method: 'GET',
    });
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: string): Promise<void> {
    return this.request<void>(`/api/v1/admin/queues/${queueName}/pause`, {
      method: 'POST',
    });
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName: string): Promise<void> {
    return this.request<void>(`/api/v1/admin/queues/${queueName}/resume`, {
      method: 'POST',
    });
  }

  /**
   * Retry a failed job
   */
  async retryJob(queueName: string, jobId: string): Promise<void> {
    return this.request<void>(
      `/api/v1/admin/queues/${queueName}/jobs/${jobId}/retry`,
      {
        method: 'POST',
      }
    );
  }

  // ==================== Widget Methods ====================

  /**
   * Get all widgets
   */
  async getWidgets(): Promise<WidgetConfig[]> {
    return this.request<WidgetConfig[]>('/api/v1/admin/widgets', {
      method: 'GET',
    });
  }

  /**
   * Create a new widget
   */
  async createWidget(data: WidgetConfig): Promise<WidgetConfig> {
    return this.request<WidgetConfig>('/api/v1/admin/widgets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a widget
   */
  async updateWidget(id: string, data: Partial<WidgetConfig>): Promise<WidgetConfig> {
    return this.request<WidgetConfig>(`/api/v1/admin/widgets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a widget
   */
  async deleteWidget(id: string): Promise<void> {
    return this.request<void>(`/api/v1/admin/widgets/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== Health Check ====================

  /**
   * Check API health
   */
  async healthCheck(): Promise<{ status: string; version?: string }> {
    return this.request<{ status: string; version?: string }>('/api/health', {
      method: 'GET',
    });
  }
}

export default AACSearchClient;
