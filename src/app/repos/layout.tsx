import Logo from '@/components/Logo';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ghostr Repositories',
  description: 'List of repositories on Ghostr',
};

export default function ReposLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-900 px-4 w-full m-10">
      <Link className="absolute top-0 left-0 p-4" href={'/home'}>
        <Logo />
      </Link>
      {children}
    </div>
  );
}
