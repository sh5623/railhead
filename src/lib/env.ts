import { z } from 'zod';

/**
 * Typed, validated access to Vite env vars. App code must import `env` from
 * here — never read `import.meta.env` directly. Fails fast at startup on
 * misconfiguration. Only `VITE_`-prefixed vars are exposed to the client.
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1, 'VITE_API_BASE_URL is required'),
  VITE_API_OPENAPI_URL: z.string().min(1).optional(),
});

export const env = envSchema.parse(import.meta.env);
