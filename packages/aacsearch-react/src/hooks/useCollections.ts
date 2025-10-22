/**
 * useCollections - React hook for managing collections
 */

import { useState, useCallback, useEffect } from 'react';
import { useSearchContext } from '../components/SearchProvider';
import type {
  Collection,
  CreateCollectionInput,
  AACSearchError,
  UseCollectionsResult,
} from '../types';

export interface UseCollectionsOptions {
  autoFetch?: boolean;
  onSuccess?: (collections: Collection[]) => void;
  onError?: (error: AACSearchError) => void;
}

export const useCollections = (
  options: UseCollectionsOptions = {}
): UseCollectionsResult => {
  const { client } = useSearchContext();
  const { autoFetch = true, onSuccess, onError } = options;

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AACSearchError | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedCollections = await client.getCollections();
      setCollections(fetchedCollections);

      if (onSuccess) {
        onSuccess(fetchedCollections);
      }
    } catch (err: any) {
      const collectionError: AACSearchError = {
        message: err.message || 'Failed to fetch collections',
        code: err.code,
        statusCode: err.statusCode,
        details: err.details,
      };

      setError(collectionError);

      if (onError) {
        onError(collectionError);
      }
    } finally {
      setLoading(false);
    }
  }, [client, onSuccess, onError]);

  const createCollection = useCallback(
    async (data: CreateCollectionInput): Promise<Collection> => {
      setLoading(true);
      setError(null);

      try {
        const newCollection = await client.createCollection(data);
        setCollections((prev) => [...prev, newCollection]);
        return newCollection;
      } catch (err: any) {
        const collectionError: AACSearchError = {
          message: err.message || 'Failed to create collection',
          code: err.code,
          statusCode: err.statusCode,
          details: err.details,
        };

        setError(collectionError);

        if (onError) {
          onError(collectionError);
        }

        throw collectionError;
      } finally {
        setLoading(false);
      }
    },
    [client, onError]
  );

  const deleteCollection = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await client.deleteCollection(id);
        setCollections((prev) => prev.filter((col) => col.id !== id));
      } catch (err: any) {
        const collectionError: AACSearchError = {
          message: err.message || 'Failed to delete collection',
          code: err.code,
          statusCode: err.statusCode,
          details: err.details,
        };

        setError(collectionError);

        if (onError) {
          onError(collectionError);
        }

        throw collectionError;
      } finally {
        setLoading(false);
      }
    },
    [client, onError]
  );

  // Auto-fetch collections on mount
  useEffect(() => {
    if (autoFetch) {
      refresh();
    }
  }, [autoFetch, refresh]);

  return {
    collections,
    loading,
    error,
    createCollection,
    deleteCollection,
    refresh,
  };
};

export default useCollections;
