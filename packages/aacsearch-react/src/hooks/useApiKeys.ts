/**
 * useApiKeys - React hook for managing API keys
 */

import { useState, useCallback, useEffect } from 'react';
import { useSearchContext } from '../components/SearchProvider';
import type {
  ApiKey,
  CreateApiKeyInput,
  AACSearchError,
  UseApiKeysResult,
} from '../types';

export interface UseApiKeysOptions {
  autoFetch?: boolean;
  onSuccess?: (apiKeys: ApiKey[]) => void;
  onError?: (error: AACSearchError) => void;
}

export const useApiKeys = (
  options: UseApiKeysOptions = {}
): UseApiKeysResult => {
  const { client } = useSearchContext();
  const { autoFetch = true, onSuccess, onError } = options;

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AACSearchError | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedKeys = await client.getApiKeys();
      setApiKeys(fetchedKeys);

      if (onSuccess) {
        onSuccess(fetchedKeys);
      }
    } catch (err: any) {
      const apiKeyError: AACSearchError = {
        message: err.message || 'Failed to fetch API keys',
        code: err.code,
        statusCode: err.statusCode,
        details: err.details,
      };

      setError(apiKeyError);

      if (onError) {
        onError(apiKeyError);
      }
    } finally {
      setLoading(false);
    }
  }, [client, onSuccess, onError]);

  const createApiKey = useCallback(
    async (data: CreateApiKeyInput): Promise<ApiKey> => {
      setLoading(true);
      setError(null);

      try {
        const newKey = await client.createApiKey(data);
        setApiKeys((prev) => [...prev, newKey]);
        return newKey;
      } catch (err: any) {
        const apiKeyError: AACSearchError = {
          message: err.message || 'Failed to create API key',
          code: err.code,
          statusCode: err.statusCode,
          details: err.details,
        };

        setError(apiKeyError);

        if (onError) {
          onError(apiKeyError);
        }

        throw apiKeyError;
      } finally {
        setLoading(false);
      }
    },
    [client, onError]
  );

  const deleteApiKey = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await client.deleteApiKey(id);
        setApiKeys((prev) => prev.filter((key) => key.id !== id));
      } catch (err: any) {
        const apiKeyError: AACSearchError = {
          message: err.message || 'Failed to delete API key',
          code: err.code,
          statusCode: err.statusCode,
          details: err.details,
        };

        setError(apiKeyError);

        if (onError) {
          onError(apiKeyError);
        }

        throw apiKeyError;
      } finally {
        setLoading(false);
      }
    },
    [client, onError]
  );

  // Auto-fetch API keys on mount
  useEffect(() => {
    if (autoFetch) {
      refresh();
    }
  }, [autoFetch, refresh]);

  return {
    apiKeys,
    loading,
    error,
    createApiKey,
    deleteApiKey,
    refresh,
  };
};

export default useApiKeys;
