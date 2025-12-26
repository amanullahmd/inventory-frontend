import React from 'react';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
  autoHide?: boolean;
  autoHideDelay?: number;
  title?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  onDismiss, 
  className = '',
  autoHide = false,
  autoHideDelay = 3000,
  title = 'Success'
}) => {
  React.useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, onDismiss]);

  return (
    <div className={`bg-white border border-border rounded-2xl p-6 shadow-sm animate-bounce-in ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          <svg 
            className="h-6 w-6 text-chart-2" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-base text-muted-foreground">{message}</p>
        </div>
        {onDismiss && (
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;