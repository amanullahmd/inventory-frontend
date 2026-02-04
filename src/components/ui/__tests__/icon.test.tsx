import React from 'react'
import { render } from '@testing-library/react'
import {
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
} from '../icon'

describe('Icon Component', () => {
  describe('Icon Base', () => {
    it('should render icon', () => {
      const { container } = render(<Icon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render with default size (md)', () => {
      const { container } = render(<Icon />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('w-6')
      expect(svg).toHaveClass('h-6')
    })

    it('should render with small size', () => {
      const { container } = render(<Icon size="sm" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('w-5')
      expect(svg).toHaveClass('h-5')
    })

    it('should render with large size', () => {
      const { container } = render(<Icon size="lg" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('w-8')
      expect(svg).toHaveClass('h-8')
    })

    it('should render with extra small size', () => {
      const { container } = render(<Icon size="xs" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('w-4')
      expect(svg).toHaveClass('h-4')
    })
  })

  describe('Icon Colors', () => {
    it('should render with primary color', () => {
      const { container } = render(<Icon color="primary" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-blue-600')
    })

    it('should render with secondary color', () => {
      const { container } = render(<Icon color="secondary" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-purple-600')
    })

    it('should render with success color', () => {
      const { container } = render(<Icon color="success" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-green-600')
    })

    it('should render with warning color', () => {
      const { container } = render(<Icon color="warning" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-amber-600')
    })

    it('should render with error color', () => {
      const { container } = render(<Icon color="error" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-red-600')
    })

    it('should render with muted color', () => {
      const { container } = render(<Icon color="muted" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-gray-400')
    })

    it('should render with inherit color', () => {
      const { container } = render(<Icon color="inherit" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-current')
    })
  })

  describe('Icon Interactive', () => {
    it('should apply interactive styles when interactive prop is true', () => {
      const { container } = render(<Icon interactive />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cursor-pointer')
      expect(svg).toHaveClass('hover:text-blue-700')
    })

    it('should not apply interactive styles by default', () => {
      const { container } = render(<Icon />)
      const svg = container.querySelector('svg')
      expect(svg).not.toHaveClass('cursor-pointer')
    })
  })

  describe('Icon Variants', () => {
    it('should render CheckIcon', () => {
      const { container } = render(<CheckIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    })

    it('should render XIcon', () => {
      const { container } = render(<XIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render AlertIcon', () => {
      const { container } = render(<AlertIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render InfoIcon', () => {
      const { container } = render(<InfoIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render LoadingIcon with animation', () => {
      const { container } = render(<LoadingIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('animate-spin')
    })

    it('should render ChevronDownIcon', () => {
      const { container } = render(<ChevronDownIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render ChevronUpIcon', () => {
      const { container } = render(<ChevronUpIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render ChevronLeftIcon', () => {
      const { container } = render(<ChevronLeftIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render ChevronRightIcon', () => {
      const { container } = render(<ChevronRightIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Icon Combinations', () => {
    it('should render icon with size and color', () => {
      const { container } = render(<Icon size="lg" color="success" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('w-8')
      expect(svg).toHaveClass('h-8')
      expect(svg).toHaveClass('text-green-600')
    })

    it('should render icon with size, color, and interactive', () => {
      const { container } = render(
        <Icon size="md" color="primary" interactive />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('w-6')
      expect(svg).toHaveClass('h-6')
      expect(svg).toHaveClass('text-blue-600')
      expect(svg).toHaveClass('cursor-pointer')
    })
  })

  describe('Icon Accessibility', () => {
    it('should accept aria attributes', () => {
      const { container } = render(
        <Icon aria-label="Loading" aria-hidden="false" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Loading')
      expect(svg).toHaveAttribute('aria-hidden', 'false')
    })

    it('should support custom className', () => {
      const { container } = render(<Icon className="custom-class" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
    })
  })
})
