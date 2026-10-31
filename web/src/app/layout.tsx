import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { SessionProvider } from '@/providers/session-provider';

export const metadata: Metadata = {
  title: {
    default: 'selfOS',
    template: '%s · selfOS',
  },
  description: 'Personal portfolio OS — profile, projects, daily, knowledge.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
