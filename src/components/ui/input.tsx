'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input Component
 * 
 * Implements all input states as per design specifications:
 * - States: default, focus, error, disabled, filled
 * - Styling: Border radius 8px, padding 10px 12px
 * - Focus: Blue border, shadow highlight
 * - Error: Red border, error message below
 * - Animations: 200ms transitions
 * 
 * Validates: Requirements 5.3, 5.4, 5.5
 */

interface InputProps extends React.ComponentProps<'input'> {
  error?: string
  label?: string
  helperText?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, icon, ...props }, ref) => {

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            data-slot="input"
            className={cn(
              // Base styles
              'w-full rounded-lg border px-3 py-2.5 text-base transition-all duration-200 ease-in-out',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
              // Default state
              'border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100',
              // Focus state
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 focus:shadow-md',
              // Error state
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              // Icon padding
              icon && 'pl-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            onFocus={(e) => {
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              props.onBlur?.(e)
            }}
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1 text-sm font-medium text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${props.id}-helper`}
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, type InputProps }
