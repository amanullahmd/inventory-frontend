'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Progress Component
 * 
 * Linear progress bar for multi-step processes:
 * - Animated fill from left to right
 * - Percentage display
 * - Multiple color variants
 * - Responsive sizing
 * 
 * Validates: Requirements 15.3, 15.4
 */

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: 'primary' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  animated?: boolean
}

const variantClasses = {
  primary: 'bg-blue-500 dark:bg-blue-600',
  success: 'bg-green-500 dark:bg-green-600',
  warning: 'bg-amber-500 dark:bg-amber-600',
  error: 'bg-red-500 dark:bg-red-600',
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = 'primary',
      showLabel = false,
      animated = true,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label="Progress"
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-out',
              variantClasses[variant],
              animated && 'animate-pulse'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Progress
            </span>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    )
  }
)

Progress.displayName = 'Progress'

interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: string[]
  currentStep: number
}

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  ({ className, steps, currentStep, ...props }, ref) => (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-1 items-center">
            {/* Step Circle */}
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm transition-all duration-200',
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-1 mx-2 transition-all duration-200',
                  index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="mt-4 flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              'text-xs font-medium transition-colors duration-200',
              index <= currentStep
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-500 dark:text-gray-500'
            )}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  )
)

StepProgress.displayName = 'StepProgress'

export {
  Progress,
  StepProgress,
  type ProgressProps,
  type StepProgressProps,
}
