import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghostr Repositories",
  description: "List of repositories on Ghostr",
};

export default function ReposLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-900 px-4 w-full h-screen m-10">{children}</div>
  );
}
