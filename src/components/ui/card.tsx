'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Card Component
 * 
 * Implements all card variants and states as per design specifications:
 * - Variants: standard, glassmorphic, elevated
 * - Styling: Border radius 12px, padding 16px, shadows
 * - Hover effects: Shadow elevation, scale transformation (1.02)
 * - Responsive: Maintains proportional sizing across breakpoints
 * 
 * Validates: Requirements 4.1, 4.2, 4.3, 4.5, 3.1, 3.2
 */

const cardVariants = cva(
  // Base styles - common to all cards
  'rounded-lg border transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        // Standard: White background, subtle shadow, rounded corners
        standard:
          'bg-white text-gray-900 border-gray-200 shadow-md hover:shadow-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700',
        // Glassmorphic: 30% opacity, 10px blur, semi-transparent background
        glassmorphic:
          'bg-white/30 text-gray-900 border-white/20 backdrop-blur-md shadow-md hover:shadow-lg dark:bg-gray-900/30 dark:text-gray-100 dark:border-gray-700/20',
        // Elevated: Enhanced shadow, slight elevation on hover
        elevated:
          'bg-white text-gray-900 border-gray-200 shadow-lg hover:shadow-xl dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700',
      },
    },
    defaultVariants: {
      variant: 'standard',
    },
  }
)

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'standard', interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      data-variant={variant}
      className={cn(
        cardVariants({ variant, className }),
        'p-4 md:p-6',
        interactive && 'hover:scale-102 cursor-pointer'
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-4 md:[.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('text-lg md:text-xl font-semibold leading-tight', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('py-2 md:py-4', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center gap-2 md:gap-4 [.border-t]:pt-4 md:[.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
  type CardProps,
}
