// Task: P2-T-018
// Spec: specs/ui/components.md §Layout

import React from 'react';
import { Header } from './Header';
import { isAuthenticated } from '@/lib/auth';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  requireAuth = true,
}) => {
  // Check authentication on client side
  const [isClient, setIsClient] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setAuthenticated(isAuthenticated());
  }, []);

  // Redirect to sign in if not authenticated
  React.useEffect(() => {
    if (isClient && requireAuth && !authenticated) {
      window.location.href = '/signin';
    }
  }, [isClient, requireAuth, authenticated]);

  // Show loading during auth check
  if (isClient && requireAuth && !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Todo WebApp. Built with Next.js and FastAPI.
          </p>
        </div>
      </footer>
    </div>
  );
};
