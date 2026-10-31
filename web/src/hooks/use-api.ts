'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { withAuth } from '@/lib/api';

/**
 * Returns a ky instance bound to the current session's access token.
 * Re-created only when the token changes.
 */
export function useAuthedApi() {
  const { data } = useSession();
  const token = data?.accessToken;
  return useMemo(() => withAuth(token ?? null), [token]);
}
