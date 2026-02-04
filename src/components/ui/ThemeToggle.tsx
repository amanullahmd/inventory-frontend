'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

/**
 * ThemeToggle Component
 * Provides a button to toggle between light and dark modes
 */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { mode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center justify-center
        p-2 rounded-lg
        transition-colors duration-200
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-blue-500 dark:focus:ring-offset-gray-900
        ${className}
      `}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle;
