import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

/**
 * Button Component Unit Tests
 * 
 * Tests all button variants, states, animations, and loading behavior
 * Validates: Requirements 5.1, 5.2, 6.1, 6.5
 */

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render a button element', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    it('should render with default variant (primary)', () => {
      render(<Button>Primary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-variant', 'primary')
    })

    it('should render with default size (md)', () => {
      render(<Button>Medium</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-size', 'md')
    })
  })

  describe('Variants', () => {
    it('should render primary variant', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-variant', 'primary')
      expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-400', 'to-blue-600')
    })

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-variant', 'secondary')
      expect(button).toHaveClass('bg-purple-600')
    })

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-variant', 'outline')
      expect(button).toHaveClass('border-2', 'border-blue-600', 'bg-transparent')
    })

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-variant', 'ghost')
      expect(button).toHaveClass('bg-transparent')
    })
  })

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-size', 'sm')
      expect(button).toHaveClass('px-4', 'py-2.5', 'text-sm')
    })

    it('should render medium size (default)', () => {
      render(<Button size="md">Medium</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-size', 'md')
      expect(button).toHaveClass('px-5', 'py-3', 'text-base')
    })

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-size', 'lg')
      expect(button).toHaveClass('px-6', 'py-3.5', 'text-lg')
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('should have opacity-50 when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('should apply hover styles to primary variant', () => {
      render(<Button variant="primary">Hover me</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:shadow-lg', 'hover:scale-102')
    })

    it('should apply active styles to primary variant', () => {
      render(<Button variant="primary">Active</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('active:shadow-inner', 'active:scale-100')
    })

    it('should have focus-visible styles', () => {
      render(<Button>Focus</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2')
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when loading is true', () => {
      render(<Button loading>Loading</Button>)
      const svg = screen.getByRole('button').querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass('animate-spin')
    })

    it('should disable button when loading is true', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should set aria-busy when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
    })

    it('should show loading spinner and text', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Loading')
      expect(button.querySelector('svg')).toBeInTheDocument()
    })

    it('should have reduced opacity when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('opacity-75')
    })

    it('should not show loading spinner when loading is false', () => {
      render(<Button loading={false}>Not Loading</Button>)
      const button = screen.getByRole('button')
      const svg = button.querySelector('svg')
      expect(svg).not.toBeInTheDocument()
    })
  })

  describe('Icon Support', () => {
    it('should render icon when provided', () => {
      const icon = <span data-testid="test-icon">🎯</span>
      render(<Button icon={icon}>With Icon</Button>)
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('should render icon and text together', () => {
      const icon = <span data-testid="test-icon">📝</span>
      render(<Button icon={icon}>Edit</Button>)
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    it('should not render icon when loading', () => {
      const icon = <span data-testid="test-icon">🎯</span>
      render(
        <Button loading icon={icon}>
          Loading
        </Button>
      )
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should handle click events', async () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click</Button>)
      const button = screen.getByRole('button')
      await userEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not trigger click when disabled', async () => {
      const handleClick = jest.fn()
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      )
      const button = screen.getByRole('button')
      await userEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not trigger click when loading', async () => {
      const handleClick = jest.fn()
      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>
      )
      const button = screen.getByRole('button')
      await userEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should support keyboard interaction', async () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Keyboard</Button>)
      const button = screen.getByRole('button')
      button.focus()
      await userEvent.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<Button>Accessible</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should be keyboard focusable', () => {
      render(<Button>Focusable</Button>)
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    it('should have aria-busy when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
    })

    it('should not have aria-busy when not loading', () => {
      render(<Button>Not Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'false')
    })
  })

  describe('Styling', () => {
    it('should have transition class for smooth animations', () => {
      render(<Button>Transition</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('transition-all', 'duration-200', 'ease-in-out')
    })

    it('should have rounded corners (border-radius)', () => {
      render(<Button>Rounded</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('rounded-lg')
    })

    it('should have proper text styling', () => {
      render(<Button>Text</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('font-medium')
    })

    it('should have flex layout', () => {
      render(<Button>Flex</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
    })
  })

  describe('Dark Mode', () => {
    it('should have dark mode styles for primary variant', () => {
      render(<Button variant="primary">Dark Mode</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('dark:from-blue-500', 'dark:to-blue-700')
    })

    it('should have dark mode styles for secondary variant', () => {
      render(<Button variant="secondary">Dark Mode</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('dark:bg-purple-700')
    })

    it('should have dark mode styles for outline variant', () => {
      render(<Button variant="outline">Dark Mode</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('dark:border-blue-400', 'dark:text-blue-400')
    })

    it('should have dark mode styles for ghost variant', () => {
      render(<Button variant="ghost">Dark Mode</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('dark:text-gray-300', 'dark:hover:bg-gray-800')
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should accept custom data attributes', () => {
      render(<Button data-testid="custom-button">Custom</Button>)
      const button = screen.getByTestId('custom-button')
      expect(button).toBeInTheDocument()
    })

    it('should accept type attribute', () => {
      render(<Button type="submit">Submit</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Button />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should handle multiple children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('IconText')
    })

    it('should handle loading with no text', () => {
      render(<Button loading />)
      const button = screen.getByRole('button')
      expect(button.querySelector('svg')).toBeInTheDocument()
    })

    it('should handle disabled and loading together', () => {
      render(
        <Button disabled loading>
          Disabled Loading
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
    })
  })
})
