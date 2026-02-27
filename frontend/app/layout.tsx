// Task: P2-T-020
// Spec: specs/ui/pages.md §Root Layout

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo WebApp - Manage Your Tasks',
  description: 'A simple, efficient way to manage your daily tasks and boost productivity.',
  keywords: ['todo', 'tasks', 'productivity', 'management'],
  authors: [{ name: 'Todo WebApp' }],
  openGraph: {
    title: 'Todo WebApp',
    description: 'Manage your tasks efficiently',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
