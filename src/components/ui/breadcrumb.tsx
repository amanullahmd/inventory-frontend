'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Breadcrumb Component
 * 
 * Provides navigation context with breadcrumb trail:
 * - Displays current page hierarchy
 * - Clickable links to parent pages
 * - Responsive design for mobile/desktop
 * - Accessibility support with ARIA attributes
 * 
 * Validates: Requirements 16.2
 */

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'text-sm font-medium',
                  item.current
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="text-gray-400 dark:text-gray-600">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
)

Breadcrumb.displayName = 'Breadcrumb'

export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem }
