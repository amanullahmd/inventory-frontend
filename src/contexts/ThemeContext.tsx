'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { cssVariables } from '@/lib/design-system/config';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'dpe-theme-preference';

/**
 * ThemeProvider component that manages light/dark mode switching
 * Persists theme preference to localStorage and applies CSS variables
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    
    // Check OS-level dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine initial theme
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setMode(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  // Apply theme to DOM
  const applyTheme = (theme: ThemeMode) => {
    const root = document.documentElement;
    
    // Update class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply CSS variables
    const variables = cssVariables[theme];
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  const toggleTheme = () => {
    const newTheme = mode === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setMode(newTheme);
    applyTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
