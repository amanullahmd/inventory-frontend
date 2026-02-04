'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Spinner Component
 * 
 * Animated loading spinner:
 * - Smooth rotation animation (2s per rotation)
 * - Multiple size variants
 * - Color customization
 * - Accessibility support
 * 
 * Validates: Requirements 15.2, 15.3
 */

interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 'md', color = 'currentColor', ...props }, ref) => (
    <svg
      ref={ref}
      className={cn('animate-spin', sizeMap[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill={color}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
)

Spinner.displayName = 'Spinner'

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  spinnerSize?: 'sm' | 'md' | 'lg'
  label?: string
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, spinnerSize = 'md', label, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      {...props}
    >
      <Spinner size={spinnerSize} />
      {label && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      )}
    </div>
  )
)

Loading.displayName = 'Loading'

export { Spinner, Loading, type SpinnerProps, type LoadingProps }
