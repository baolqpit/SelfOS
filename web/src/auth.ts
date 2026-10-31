import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const BE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        emailOrUsername: { label: 'Email or username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials.password) return null;
        try {
          const res = await fetch(`${BE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emailOrUsername: credentials.emailOrUsername,
              password: credentials.password,
            }),
            cache: 'no-store',
          });
          if (!res.ok) return null;
          const payload = (await res.json()) as {
            data?: {
              user: { id: string; email: string; username: string };
              accessToken: string;
              refreshToken: string;
            };
          };
          const data = payload.data;
          if (!data) return null;
          return {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as {
          id?: string;
          email?: string | null;
          username?: string;
          accessToken?: string;
          refreshToken?: string;
        };
        token.userId = u.id;
        token.email = u.email ?? undefined;
        token.username = u.username;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
      }
      if (trigger === 'update' && session) {
        if (session.accessToken) token.accessToken = session.accessToken;
        if (session.refreshToken) token.refreshToken = session.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user = {
          ...session.user,
          id: token.userId,
          email: token.email ?? '',
          username: token.username ?? '',
        } as typeof session.user;
      }
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
});
