'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Icon Component
 * 
 * Consistent icon system using Lucide icons:
 * - Size variants (16px, 20px, 24px, 32px)
 * - Color system using design palette
 * - Hover states for interactive icons
 * - Accessibility support
 * 
 * Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5
 */

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted' | 'inherit'
  interactive?: boolean
}

const sizeMap = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

const colorMap = {
  primary: 'text-(--color-primary)',
  secondary: 'text-(--color-secondary)',
  success: 'text-(--color-success)',
  warning: 'text-(--color-warning)',
  error: 'text-(--color-error)',
  muted: 'text-gray-400 dark:text-gray-600',
  inherit: 'text-current',
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      className,
      size = 'md',
      color = 'inherit',
      interactive = false,
      ...props
    },
    ref
  ) => (
    <svg
      ref={ref}
      className={cn(
        sizeMap[size],
        colorMap[color],
        interactive && 'transition-colors duration-200 hover:text-primary-foreground cursor-pointer',
        className
      )}
      {...props}
    />
  )
)

Icon.displayName = 'Icon'

// Common icon components
const CheckIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
))
CheckIcon.displayName = 'CheckIcon'

const XIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
))
XIcon.displayName = 'XIcon'

const AlertIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
))
AlertIcon.displayName = 'AlertIcon'

const InfoIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </Icon>
))
InfoIcon.displayName = 'InfoIcon'

const LoadingIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" className="animate-spin" {...props}>
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
  </Icon>
))
LoadingIcon.displayName = 'LoadingIcon'

const ChevronDownIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </Icon>
))
ChevronDownIcon.displayName = 'ChevronDownIcon'

const ChevronUpIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <polyline points="18 15 12 9 6 15" />
  </Icon>
))
ChevronUpIcon.displayName = 'ChevronUpIcon'

const ChevronLeftIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <polyline points="15 18 9 12 15 6" />
  </Icon>
))
ChevronLeftIcon.displayName = 'ChevronLeftIcon'

const ChevronRightIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </Icon>
))
ChevronRightIcon.displayName = 'ChevronRightIcon'

export {
  Icon,
  CheckIcon,
  XIcon,
  AlertIcon,
  InfoIcon,
  LoadingIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  type IconProps,
}
