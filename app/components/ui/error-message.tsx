'use client';

import { AlertCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'error' | 'warning';
  className?: string;
  dismissible?: boolean;
}

export function ErrorMessage({
  title,
  message,
  variant = 'error',
  className = '',
  dismissible = true,
}: ErrorMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const bgColor = variant === 'error' ? 'bg-red-50' : 'bg-yellow-50';
  const borderColor = variant === 'error' ? 'border-red-300' : 'border-yellow-300';
  const textColor = variant === 'error' ? 'text-red-800' : 'text-yellow-800';
  const iconColor = variant === 'error' ? 'text-red-400' : 'text-yellow-400';

  return (
    <div
      className={`${bgColor} ${borderColor} ${textColor} border rounded-md p-4 mb-4 ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className="text-sm">{message}</div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className={`inline-flex rounded-md p-1.5 ${iconColor} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  variant === 'error' ? 'focus:ring-red-500' : 'focus:ring-yellow-500'
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <XCircle className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
