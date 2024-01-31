import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Logo from '@/components/Logo';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ghostr',
  description: 'Decentralized GitHub over Nostr',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
          <Link className="absolute top-0 left-0 p-4" href={'/'}>
            <Logo />
          </Link>
          {children}
        </div>
      </body>
    </html>
  );
}
