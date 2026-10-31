import { auth } from '@/auth';
import { withAuth } from './api';

/**
 * Server-side authed API client. Reads JWT from the NextAuth session cookie.
 */
export async function serverApi() {
  const session = await auth();
  return withAuth(session?.accessToken);
}

/** Fetch wrapper for public (unauthed) requests from server components. */
export { api as publicApi } from './api';
