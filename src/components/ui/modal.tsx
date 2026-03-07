'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Modal Component
 * 
 * Implements modal with glassmorphic styling:
 * - Glassmorphic styling with backdrop blur
 * - Modal entrance animations (scale and fade)
 * - Close button and overlay click handling
 * - Responsive modal sizing
 * - Keyboard support (Escape to close)
 * 
 * Validates: Requirements 3.4, 6.3
 */

interface ModalContextType {
  isOpen: boolean
  onClose: () => void
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined)

export const useModal = () => {
  const context = React.useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a Modal component')
  }
  return context
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  )
}

Modal.displayName = 'Modal'

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> { }

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Glassmorphic styling
        'bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl',
        // Shadow and elevation
        'shadow-2xl',
        // Padding and spacing
        'p-6 sm:p-8',
        // Dark mode
        'dark:bg-gray-900/30 dark:border-gray-700/20',
        className
      )}
      role="dialog"
      aria-modal="true"
      {...props}
    />
  )
)

ModalContent.displayName = 'ModalContent'

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between mb-4', className)}
      {...props}
    />
  )
)

ModalHeader.displayName = 'ModalHeader'

interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { }

const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100',
        className
      )}
      {...props}
    />
  )
)

ModalTitle.displayName = 'ModalTitle'

interface ModalCloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const ModalCloseButton = React.forwardRef<HTMLButtonElement, ModalCloseButtonProps>(
  ({ className, onClick, ...props }, ref) => {
    const { onClose } = useModal()

    return (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e)
          onClose()
        }}
        className={cn(
          'inline-flex items-center justify-center w-8 h-8 rounded-lg',
          'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ring',
          className
        )}
        aria-label="Close modal"
        {...props}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )
  }
)

ModalCloseButton.displayName = 'ModalCloseButton'

interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> { }

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('my-4 text-gray-700 dark:text-gray-300', className)}
      {...props}
    />
  )
)

ModalBody.displayName = 'ModalBody'

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    />
  )
)

ModalFooter.displayName = 'ModalFooter'

export {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  type ModalProps,
}
