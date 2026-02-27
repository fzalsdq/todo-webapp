// Task: P2-T-013
// Spec: specs/ui/components.md §Badge

import React from 'react';

interface BadgeProps {
  variant: 'success' | 'pending' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  children,
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    neutral: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
