/**
 * useConversationalSearch - AI-powered conversational search hook
 */

import { useState, useCallback, useRef } from 'react';
import { useSearchContext } from '../components/SearchProvider';
import { AACSearchClientExtended } from '../client/AACSearchClientExtended';
import type { ConversationalSearchParams, ConversationalSearchResult } from '../client/AACSearchClientExtended';
import type { AACSearchError } from '../types';

export interface UseConversationalSearchOptions {
  collection: string;
  streaming?: boolean;
  onChunk?: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: AACSearchError) => void;
}

export interface UseConversationalSearchResult {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    sources?: any[];
  }>;
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  isStreaming: boolean;
  error: AACSearchError | null;
  conversationId: string | null;
  reset: () => void;
}

export const useConversationalSearch = (
  options: UseConversationalSearchOptions
): UseConversationalSearchResult => {
  const { client: baseClient } = useSearchContext();
  const client = baseClient as unknown as AACSearchClientExtended;

  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    sources?: any[];
  }>>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<AACSearchError | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const streamingContentRef = useRef('');

  const sendMessage = useCallback(
    async (message: string) => {
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: message }]);
      setIsLoading(true);
      setIsStreaming(options.streaming || false);
      setError(null);

      if (options.streaming) {
        streamingContentRef.current = '';
      }

      try {
        const params: ConversationalSearchParams = {
          message,
          collection: options.collection,
          conversation_id: conversationId || undefined,
          streaming: options.streaming,
        };

        const result = await client.conversationalSearch(params, {
          onChunk: (chunk) => {
            streamingContentRef.current += chunk;

            // Update last message with streaming content
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMsg = newMessages[newMessages.length - 1];

              if (lastMsg?.role === 'assistant') {
                lastMsg.content = streamingContentRef.current;
              } else {
                newMessages.push({
                  role: 'assistant',
                  content: streamingContentRef.current,
                });
              }

              return newMessages;
            });

            options.onChunk?.(chunk);
          },
          onComplete: () => {
            setIsStreaming(false);
            options.onComplete?.();
          },
          onError: (err) => {
            const searchError: AACSearchError = {
              message: err.message,
            };
            setError(searchError);
            options.onError?.(searchError);
          },
        });

        if (!options.streaming) {
          // Add assistant response
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: result.answer,
              sources: result.sources?.hits || [],
            },
          ]);
        }

        setConversationId(result.conversation_id);
      } catch (err: any) {
        const searchError: AACSearchError = {
          message: err.message || 'Conversational search failed',
          code: err.code,
          statusCode: err.statusCode,
        };

        setError(searchError);

        if (options.onError) {
          options.onError(searchError);
        }
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [client, options, conversationId]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    isStreaming,
    error,
    conversationId,
    reset,
  };
};

export default useConversationalSearch;
