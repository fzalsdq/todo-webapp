// Task: P2-T-013
// Spec: specs/ui/components.md §TextArea

import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  required,
  rows = 3,
  maxLength,
  className = '',
  id,
  value,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const valueStr = value as string || '';
  const charCount = valueStr?.length || 0;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {(error || (maxLength && charCount > 0)) && (
        <div className="mt-1 flex justify-between">
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <div />
          )}
          {maxLength && (
            <p className={`text-sm ${charCount > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
