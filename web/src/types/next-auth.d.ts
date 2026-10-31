import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      username: string;
    };
  }

  interface User {
    id: string;
    email: string;
    username: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    username?: string;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
