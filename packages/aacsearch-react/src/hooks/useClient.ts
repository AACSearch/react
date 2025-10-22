/**
 * useClient - React hook for direct access to AACSearchClient
 */

import { useSearchContext } from '../components/SearchProvider';
import type { AACSearchClient } from '../client/AACSearchClient';

/**
 * Hook to access the AACSearchClient instance directly
 *
 * This hook provides direct access to the SDK client, allowing you to
 * call any SDK method imperatively.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const client = useClient();
 *
 *   const handleImport = async () => {
 *     await client.importDocuments({
 *       collection: 'products',
 *       documents: [...],
 *     });
 *   };
 *
 *   return <button onClick={handleImport}>Import</button>;
 * }
 * ```
 */
export const useClient = (): AACSearchClient => {
  const { client } = useSearchContext();
  return client;
};

export default useClient;
