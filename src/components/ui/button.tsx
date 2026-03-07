'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Button Component
 * 
 * Implements all button variants and states as per design specifications:
 * - Variants: primary, secondary, outline, ghost
 * - States: default, hover, active, disabled, loading
 * - Animations: 200-300ms transitions
 * - Loading spinner animation
 * 
 * Validates: Requirements 5.1, 5.2, 6.1, 6.5
 */

// Loading spinner component
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const buttonVariants = cva(
  // Base styles - common to all buttons
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 ease-in-out disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary: Green background (user request)
        primary:
          'bg-secondary text-secondary-foreground shadow-md hover:shadow-lg hover:scale-102 active:shadow-inner active:scale-100 disabled:opacity-50',
        // Secondary: Shadowed accent color
        secondary:
          'bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:scale-102 active:shadow-inner active:scale-100 disabled:opacity-50',
        // Outline: Cyan border and text
        outline:
          'border-2 border-primary bg-transparent text-primary-foreground hover:bg-primary/10 active:bg-primary/20 disabled:opacity-50',
        // Ghost: Cyan text on hover
        ghost:
          'bg-transparent text-gray-700 hover:bg-primary/10 active:bg-primary/20 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-primary/20 dark:active:bg-primary/30',
      },
      size: {
        // sm: 10px 16px padding
        sm: 'px-4 py-2.5 text-sm rounded-lg',
        // md: 12px 20px padding (default)
        md: 'px-5 py-3 text-base rounded-lg',
        // lg: 14px 24px padding
        lg: 'px-6 py-3.5 text-lg rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      loading = false,
      disabled = false,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-loading={loading}
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && 'opacity-75'
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner className="size-4" />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {icon && <span className="flex items-center justify-center">{icon}</span>}
            {children}
          </>
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants, type ButtonProps }
