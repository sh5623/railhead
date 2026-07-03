import createClient from 'openapi-fetch';
import type { paths } from '@/lib/api/schema';
import { clearToken, getToken } from '@/lib/auth/token';
import { env } from '@/lib/env';

/**
 * The ONE typed backend client. All API calls go through this — never
 * hand-write `fetch`/`axios`, and never invent endpoints/fields (they must
 * type-check against the generated `schema.d.ts`).
 */
export const api = createClient<paths>({ baseUrl: env.VITE_API_BASE_URL });

// Attach the auth token and handle expired sessions in one place.
api.use({
  onRequest({ request }) {
    const token = getToken();
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
  onResponse({ response }) {
    if (response.status === 401) {
      clearToken();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return response;
  },
});
