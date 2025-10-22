/**
 * Extended AACSearch Client with Advanced Features
 * AI-powered search, recommendations, vector search, real-time features
 */

import { AACSearchClient } from './AACSearchClient';
import type { SearchParams, SearchResult, Document } from '../types';

export interface ConversationalSearchParams {
  conversation_id?: string;
  message: string;
  collection: string;
  context?: string[];
  streaming?: boolean;
}

export interface ConversationalSearchResult {
  conversation_id: string;
  answer: string;
  sources: SearchResult;
  suggested_questions: string[];
}

export interface VectorSearchParams {
  query_vector?: number[];
  query_text?: string;
  collection: string;
  k?: number;
  filter?: string;
  include_metadata?: boolean;
}

export interface RecommendationParams {
  item_id?: string;
  user_id?: string;
  collection: string;
  limit?: number;
  algorithm?: 'collaborative' | 'content-based' | 'hybrid';
  exclude_viewed?: boolean;
}

export interface BatchOperationParams {
  collection: string;
  operations: Array<{
    action: 'index' | 'update' | 'delete';
    document?: Document;
    id?: string;
  }>;
}

export interface StreamingOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export class AACSearchClientExtended extends AACSearchClient {
  private ws: WebSocket | null = null;
  private wsReconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Conversational/AI Search
   * Natural language search with context awareness
   */
  async conversationalSearch(
    params: ConversationalSearchParams,
    streamingOptions?: StreamingOptions
  ): Promise<ConversationalSearchResult> {
    if (params.streaming && streamingOptions) {
      return this.streamConversationalSearch(params, streamingOptions);
    }

    const response = await this.request<ConversationalSearchResult>(
      '/api/v1/search/conversational',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );

    return response;
  }

  /**
   * Stream conversational search responses
   */
  private async streamConversationalSearch(
    params: ConversationalSearchParams,
    options: StreamingOptions
  ): Promise<ConversationalSearchResult> {
    const response = await fetch(`${this.endpoint}/api/v1/search/conversational/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(params),
    });

    if (!response.body) {
      throw new Error('Streaming not supported');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullAnswer = '';
    let result: Partial<ConversationalSearchResult> = {};

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'token') {
              fullAnswer += data.content;
              options.onChunk?.(data.content);
            } else if (data.type === 'result') {
              result = data.data;
            }
          }
        }
      }

      options.onComplete?.();

      return {
        conversation_id: result.conversation_id || '',
        answer: fullAnswer,
        sources: result.sources || { hits: [], found: 0 } as any,
        suggested_questions: result.suggested_questions || [],
      };
    } catch (error) {
      options.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Vector Search
   * Semantic search using embeddings
   */
  async vectorSearch<T = any>(
    params: VectorSearchParams
  ): Promise<SearchResult<T>> {
    return this.request<SearchResult<T>>('/api/v1/search/vector', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Hybrid Search
   * Combines keyword and vector search
   */
  async hybridSearch<T = any>(
    params: SearchParams & { query_vector?: number[] }
  ): Promise<SearchResult<T>> {
    return this.request<SearchResult<T>>('/api/v1/search/hybrid', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get Recommendations
   * Personalized item recommendations
   */
  async getRecommendations<T = any>(
    params: RecommendationParams
  ): Promise<SearchResult<T>> {
    return this.request<SearchResult<T>>('/api/v1/recommendations', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Similar Items
   * Find similar items based on content
   */
  async getSimilarItems<T = any>(
    collection: string,
    itemId: string,
    limit = 10
  ): Promise<SearchResult<T>> {
    return this.request<SearchResult<T>>(
      `/api/v1/collections/${collection}/documents/${itemId}/similar?limit=${limit}`,
      { method: 'GET' }
    );
  }

  /**
   * Batch Operations
   * Perform multiple operations in one request
   */
  async batchOperations(params: BatchOperationParams): Promise<{
    success: number;
    failed: number;
    errors: any[];
  }> {
    return this.request('/api/v1/batch', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Generate Embeddings
   * Create vector embeddings for text
   */
  async generateEmbeddings(text: string | string[]): Promise<{
    embeddings: number[][];
    model: string;
  }> {
    return this.request('/api/v1/embeddings', {
      method: 'POST',
      body: JSON.stringify({
        input: Array.isArray(text) ? text : [text],
      }),
    });
  }

  /**
   * Auto-suggest / Autocomplete
   * Get search suggestions as user types
   */
  async autoSuggest(
    query: string,
    collection: string,
    options?: {
      limit?: number;
      fields?: string[];
    }
  ): Promise<{
    suggestions: Array<{
      value: string;
      highlighted: string;
      count?: number;
    }>;
  }> {
    const queryParams = new URLSearchParams({
      q: query,
      collection,
      limit: String(options?.limit || 10),
      ...(options?.fields && { fields: options.fields.join(',') }),
    });

    return this.request(`/api/v1/suggest?${queryParams}`, {
      method: 'GET',
    });
  }

  /**
   * Semantic Search
   * Natural language understanding search
   */
  async semanticSearch<T = any>(
    query: string,
    collection: string,
    options?: Partial<SearchParams>
  ): Promise<SearchResult<T>> {
    return this.request<SearchResult<T>>('/api/v1/search/semantic', {
      method: 'POST',
      body: JSON.stringify({
        q: query,
        collection,
        ...options,
      }),
    });
  }

  /**
   * Spell Check and Auto-correct
   */
  async spellCheck(query: string, collection: string): Promise<{
    original: string;
    corrected: string;
    suggestions: string[];
  }> {
    return this.request('/api/v1/search/spellcheck', {
      method: 'POST',
      body: JSON.stringify({ q: query, collection }),
    });
  }

  /**
   * Get Popular Searches
   */
  async getPopularSearches(
    collection: string,
    timeframe: 'hour' | 'day' | 'week' | 'month' = 'day',
    limit = 10
  ): Promise<Array<{ query: string; count: number }>> {
    return this.request(
      `/api/v1/analytics/popular-searches?collection=${collection}&timeframe=${timeframe}&limit=${limit}`,
      { method: 'GET' }
    );
  }

  /**
   * Get Trending Items
   */
  async getTrendingItems<T = any>(
    collection: string,
    timeframe: 'hour' | 'day' | 'week' = 'day',
    limit = 20
  ): Promise<SearchResult<T>> {
    return this.request<SearchResult<T>>(
      `/api/v1/analytics/trending?collection=${collection}&timeframe=${timeframe}&limit=${limit}`,
      { method: 'GET' }
    );
  }

  /**
   * Track User Event
   */
  async trackUserEvent(event: {
    type: 'search' | 'click' | 'conversion' | 'view' | 'add_to_cart' | 'purchase';
    user_id?: string;
    session_id?: string;
    query?: string;
    item_id?: string;
    collection?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.request('/api/v1/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  /**
   * AB Test Variants
   */
  async getABTestVariant(
    test_id: string,
    user_id: string
  ): Promise<{
    variant: string;
    config: Record<string, any>;
  }> {
    return this.request(
      `/api/v1/ab-tests/${test_id}/variant?user_id=${user_id}`,
      { method: 'GET' }
    );
  }

  /**
   * WebSocket Connection for Real-time Updates
   */
  connectWebSocket(
    onMessage: (data: any) => void,
    onError?: (error: Event) => void
  ): void {
    const wsUrl = this.endpoint.replace('http', 'ws') + '/ws';

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.wsReconnectAttempts = 0;

      // Authenticate
      this.ws?.send(JSON.stringify({
        type: 'auth',
        api_key: this.apiKey,
      }));
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError?.(error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');

      // Auto-reconnect
      if (this.wsReconnectAttempts < this.maxReconnectAttempts) {
        this.wsReconnectAttempts++;
        setTimeout(() => {
          this.connectWebSocket(onMessage, onError);
        }, Math.min(1000 * Math.pow(2, this.wsReconnectAttempts), 30000));
      }
    };
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Subscribe to Collection Updates
   */
  subscribeToCollection(
    collection: string,
    callback: (update: {
      type: 'create' | 'update' | 'delete';
      document: Document;
    }) => void
  ): void {
    if (!this.ws) {
      throw new Error('WebSocket not connected. Call connectWebSocket() first.');
    }

    this.ws.send(JSON.stringify({
      type: 'subscribe',
      collection,
    }));

    // Store callback for this collection
    const handler = (data: any) => {
      if (data.collection === collection) {
        callback(data);
      }
    };

    // Note: In real implementation, you'd manage multiple callbacks
  }

  /**
   * Personalization Profile
   */
  async updateUserProfile(
    user_id: string,
    profile: {
      interests?: string[];
      preferences?: Record<string, any>;
      demographics?: Record<string, any>;
    }
  ): Promise<void> {
    await this.request(`/api/v1/users/${user_id}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  /**
   * Get User Profile
   */
  async getUserProfile(user_id: string): Promise<{
    interests: string[];
    preferences: Record<string, any>;
    search_history: Array<{ query: string; timestamp: string }>;
    recommendations: any[];
  }> {
    return this.request(`/api/v1/users/${user_id}/profile`, {
      method: 'GET',
    });
  }

  /**
   * Export Search Results
   */
  async exportResults(
    params: SearchParams,
    format: 'csv' | 'json' | 'xml' = 'json'
  ): Promise<Blob> {
    const response = await fetch(`${this.endpoint}/api/v1/search/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify({ ...params, format }),
    });

    return response.blob();
  }

  /**
   * Get Search Performance Metrics
   */
  async getSearchPerformance(collection: string, timeframe: string): Promise<{
    avg_response_time: number;
    p50_response_time: number;
    p95_response_time: number;
    p99_response_time: number;
    total_searches: number;
    cache_hit_rate: number;
  }> {
    return this.request(
      `/api/v1/analytics/performance?collection=${collection}&timeframe=${timeframe}`,
      { method: 'GET' }
    );
  }

  /**
   * A/B Test Results
   */
  async getABTestResults(test_id: string): Promise<{
    variants: Array<{
      name: string;
      traffic_percent: number;
      conversions: number;
      conversion_rate: number;
      confidence: number;
    }>;
    winner?: string;
    status: 'running' | 'completed' | 'stopped';
  }> {
    return this.request(`/api/v1/ab-tests/${test_id}/results`, {
      method: 'GET',
    });
  }
}

export default AACSearchClientExtended;
