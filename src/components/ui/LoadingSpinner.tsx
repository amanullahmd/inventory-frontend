import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  className = '',
  text
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} rounded-full border-2 border-muted animate-spin`}
          style={{ borderTopColor: 'var(--primary)' }}
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse-soft">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;