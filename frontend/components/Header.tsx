// Task: P2-T-014
// Spec: specs/ui/components.md §Header

import React from 'react';
import { getUser, clearAuthState } from '@/lib/auth';
import { Button } from './ui/Button';

interface HeaderProps {
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSignOut }) => {
  const user = getUser();

  const handleSignOut = () => {
    clearAuthState();
    if (onSignOut) {
      onSignOut();
    } else {
      window.location.href = '/signin';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              <span className="text-3xl mr-2">📝</span>
              Todo App
            </h1>
          </div>

          {/* User info and sign out */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600 hidden sm:block">
                {user.name || user.email}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
