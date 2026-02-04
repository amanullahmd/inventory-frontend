'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Skeleton Component
 * 
 * Animated skeleton screen that matches content layout:
 * - Pulse animation (opacity 0.5 to 1)
 * - Matches layout of actual content
 * - Smooth fade-out when content loads
 * - Responsive sizing
 * 
 * Validates: Requirements 15.1, 15.2
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = 'rectangular',
      width,
      height,
      style,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'animate-pulse bg-gray-200 dark:bg-gray-700',
      {
        'rounded-full': variant === 'circular',
        'rounded-lg': variant === 'rectangular' || variant === 'text',
      }
    )

    const customStyle: React.CSSProperties = {
      ...style,
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, className)}
        style={customStyle}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  )
)

SkeletonText.displayName = 'SkeletonText'

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={200} height={24} />
        <Skeleton variant="circular" width={32} height={32} />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} width="80%" />
      </div>

      {/* Footer */}
      <div className="flex gap-2 pt-4">
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  )
)

SkeletonCard.displayName = 'SkeletonCard'

export { Skeleton, SkeletonText, SkeletonCard, type SkeletonProps }
