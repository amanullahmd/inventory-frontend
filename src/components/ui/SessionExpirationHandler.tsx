'use client';

import React, { useState } from 'react';
import { useSessionExpiration } from '@/hooks/useSessionExpiration';
import { signOut } from 'next-auth/react';

interface SessionExpirationHandlerProps {
  children: React.ReactNode;
}

export const SessionExpirationHandler: React.FC<SessionExpirationHandlerProps> = ({ 
  children 
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useSessionExpiration({
    checkInterval: 30000, // Check every 30 seconds
    warningThreshold: 300000, // Warn 5 minutes before expiry
    onExpired: () => {
      // Session expired - sign out immediately
      signOut({ callbackUrl: '/auth/signin' });
    },
    onWarning: (timeLeft) => {
      setTimeLeft(timeLeft);
      setShowWarning(true);
    },
  });

  const handleExtendSession = () => {
    // In a real app, you might refresh the token here
    // For now, we'll just dismiss the warning
    setShowWarning(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const formatTimeLeft = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {children}
      
      {/* Session expiration warning modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg 
                  className="h-6 w-6 text-yellow-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Session Expiring Soon
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Your session will expire in {formatTimeLeft(timeLeft)}. 
                  Would you like to continue your session?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex space-x-3">
                  <button
                    onClick={handleExtendSession}
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Continue Session
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionExpirationHandler;