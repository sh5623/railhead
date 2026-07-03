import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-keys';

/**
 * Example data hook — the canonical pattern: a thin wrapper over the typed
 * client + the query-key factory. Copy this shape for every endpoint.
 */
export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health.all,
    queryFn: async () => {
      const { data, error } = await api.GET('/health');
      if (error) {
        throw new Error('Health check request failed');
      }
      return data;
    },
  });
}
