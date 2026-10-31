import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAuth } from '@/lib/api';

interface SignBody {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
}

export const runtime = 'nodejs';

/**
 * Delegates signing to the BE (`POST /cloudinary/sign`) which holds
 * CLOUDINARY_API_SECRET. The browser never sees it.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let body: SignBody = {};
  try {
    body = (await req.json()) as SignBody;
  } catch {
    /* empty body is fine */
  }

  try {
    const client = withAuth(session.accessToken);
    const resp = await client
      .post('cloudinary/sign', {
        json: {
          folder: body.folder,
          resourceType: body.resourceType ?? 'image',
        },
      })
      .json<{ data?: Record<string, unknown> } | Record<string, unknown>>();
    const data =
      (resp as { data?: Record<string, unknown> }).data ??
      (resp as Record<string, unknown>);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign failed';
    return NextResponse.json({ message }, { status: 500 });
  }
}
