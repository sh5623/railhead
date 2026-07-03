/**
 * Central query-key factory. Never inline ad-hoc array keys at call sites —
 * keys are hierarchical so invalidation cascades (e.g. invalidating
 * `users.all` drops every list and detail under it).
 */
export const queryKeys = {
  health: {
    all: ['health'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: Record<string, unknown>) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
} as const;
