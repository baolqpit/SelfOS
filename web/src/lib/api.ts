import ky, { type KyInstance, type Options } from 'ky';

/**
 * Base API client (no auth header). Use `authFetch`/`serverFetch` for authed calls.
 */
export const api: KyInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1',
  retry: { limit: 1, methods: ['get'] },
  hooks: {
    beforeError: [
      async (error) => {
        try {
          const body = (await error.response.clone().json()) as {
            message?: string | string[];
          };
          const msg = Array.isArray(body.message)
            ? body.message.join(', ')
            : body.message;
          if (msg) error.message = msg;
        } catch {
          /* ignore */
        }
        return error;
      },
    ],
  },
});

/** Build an authed ky instance with a Bearer token. */
export function withAuth(token?: string | null): KyInstance {
  return api.extend({
    hooks: {
      beforeRequest: [
        (req) => {
          if (token) req.headers.set('Authorization', `Bearer ${token}`);
        },
      ],
    },
  });
}

/** Unwrap `{ data: T }` envelope used by the server TransformInterceptor. */
export async function unwrap<T>(
  promise: Promise<Response>,
): Promise<T> {
  const res = await promise;
  const json = (await res.json()) as { data?: T } & T;
  return (json?.data !== undefined ? json.data : json) as T;
}

export type { Options };
