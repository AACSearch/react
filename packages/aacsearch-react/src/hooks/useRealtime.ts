/**
 * useRealtime - Real-time updates via WebSocket
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchContext } from '../components/SearchProvider';
import { AACSearchClientExtended } from '../client/AACSearchClientExtended';
import type { Document } from '../types';

export interface UseRealtimeOptions {
  collection?: string;
  autoConnect?: boolean;
  onUpdate?: (update: RealtimeUpdate) => void;
  onError?: (error: Event) => void;
}

export interface RealtimeUpdate {
  type: 'create' | 'update' | 'delete';
  collection: string;
  document: Document;
}

export interface UseRealtimeResult {
  connected: boolean;
  updates: RealtimeUpdate[];
  connect: () => void;
  disconnect: () => void;
  subscribe: (collection: string) => void;
  unsubscribe: (collection: string) => void;
}

export const useRealtime = (
  options: UseRealtimeOptions = {}
): UseRealtimeResult => {
  const { client: baseClient } = useSearchContext();
  const client = baseClient as unknown as AACSearchClientExtended;

  const [connected, setConnected] = useState(false);
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const subscribedCollections = useRef<Set<string>>(new Set());

  const connect = useCallback(() => {
    client.connectWebSocket(
      (data) => {
        if (data.type === 'connected') {
          setConnected(true);
        } else if (data.type === 'update') {
          const update: RealtimeUpdate = {
            type: data.action,
            collection: data.collection,
            document: data.document,
          };

          setUpdates(prev => [...prev, update]);

          if (options.onUpdate) {
            options.onUpdate(update);
          }
        }
      },
      (error) => {
        setConnected(false);
        if (options.onError) {
          options.onError(error);
        }
      }
    );
  }, [client, options]);

  const disconnect = useCallback(() => {
    client.disconnectWebSocket();
    setConnected(false);
    subscribedCollections.current.clear();
  }, [client]);

  const subscribe = useCallback(
    (collection: string) => {
      if (!connected) {
        console.warn('WebSocket not connected. Call connect() first.');
        return;
      }

      if (!subscribedCollections.current.has(collection)) {
        client.subscribeToCollection(collection, (update) => {
          const realtimeUpdate: RealtimeUpdate = {
            type: update.type,
            collection,
            document: update.document,
          };

          setUpdates(prev => [...prev, realtimeUpdate]);

          if (options.onUpdate) {
            options.onUpdate(realtimeUpdate);
          }
        });

        subscribedCollections.current.add(collection);
      }
    },
    [client, connected, options]
  );

  const unsubscribe = useCallback((collection: string) => {
    subscribedCollections.current.delete(collection);
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (options.autoConnect !== false) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [options.autoConnect]);

  // Auto-subscribe to collection if provided
  useEffect(() => {
    if (options.collection && connected) {
      subscribe(options.collection);
    }
  }, [options.collection, connected, subscribe]);

  return {
    connected,
    updates,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
  };
};

export default useRealtime;
