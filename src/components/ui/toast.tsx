'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Toast Component
 * 
 * Notification system with:
 * - Success, error, warning, and info variants
 * - Auto-dismiss (3-5 seconds)
 * - Toast stacking logic
 * - Smooth animations (fade-in, slide-in)
 * - Manual dismissal
 * 
 * Validates: Requirements 20.1, 20.2, 20.3, 20.4, 20.5
 */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = React.useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: Toast = { ...toast, id }

      setToasts((prev) => [...prev, newToast])

      // Auto-dismiss
      const duration = toast.duration || 4000
      setTimeout(() => {
        removeToast(id)
      }, duration)

      return id
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

const variantConfig = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    icon: '✓',
    iconBg: 'bg-green-100 dark:bg-green-800',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    icon: '✕',
    iconBg: 'bg-red-100 dark:bg-red-800',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-800 dark:text-amber-200',
    icon: '!',
    iconBg: 'bg-amber-100 dark:bg-amber-800',
  },
  info: {
    bg: 'bg-primary/10 dark:bg-primary/20',
    border: 'border-primary/20 dark:border-primary/80',
    text: 'text-primary-foreground dark:text-primary-foreground',
    icon: 'ℹ',
    iconBg: 'bg-primary/20 dark:bg-primary/80',
  },
}

interface ToastItemProps {
  toast: Toast
  onClose: (id: string) => void
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const config = variantConfig[toast.variant]

  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-right-full duration-200',
        'rounded-lg border p-4 shadow-lg',
        config.bg,
        config.border,
        config.text
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-semibold text-sm',
            config.iconBg
          )}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>

        {/* Action Button */}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="shrink-0 text-sm font-medium underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={() => onClose(toast.id)}
          className="shrink-0 text-lg leading-none opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  )
}

export { type Toast, type ToastContextType }
