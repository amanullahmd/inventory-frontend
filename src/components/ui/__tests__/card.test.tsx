import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '../card'

/**
 * Card Component Unit Tests
 * 
 * Tests all card variants, styling, hover effects, and responsive behavior
 * Validates: Requirements 4.1, 4.2, 4.3, 4.5, 3.1, 3.2
 */

describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render a card element', () => {
      render(<Card data-testid="test-card">Card content</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toBeInTheDocument()
    })

    it('should render with default variant (standard)', () => {
      render(<Card data-testid="test-card">Content</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toHaveAttribute('data-variant', 'standard')
    })

    it('should have rounded corners (border-radius 12px)', () => {
      render(<Card data-testid="test-card">Content</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('rounded-lg')
    })

    it('should have padding (16px)', () => {
      render(<Card data-testid="test-card">Content</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('p-4', 'md:p-6')
    })

    it('should have border styling', () => {
      render(<Card data-testid="test-card">Content</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('border')
    })

    it('should have transition classes for smooth effects', () => {
      render(<Card data-testid="test-card">Content</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('transition-all', 'duration-300', 'ease-in-out')
    })
  })

  describe('Variants', () => {
    it('should render standard variant', () => {
      render(
        <Card variant="standard" data-testid="test-card">
          Standard
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveAttribute('data-variant', 'standard')
      expect(card).toHaveClass('bg-white', 'text-gray-900', 'border-gray-200', 'shadow-md')
    })

    it('should render glassmorphic variant', () => {
      render(
        <Card variant="glassmorphic" data-testid="test-card">
          Glassmorphic
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveAttribute('data-variant', 'glassmorphic')
      expect(card).toHaveClass('bg-white/30', 'backdrop-blur-md', 'border-white/20')
    })

    it('should render elevated variant', () => {
      render(
        <Card variant="elevated" data-testid="test-card">
          Elevated
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveAttribute('data-variant', 'elevated')
      expect(card).toHaveClass('bg-white', 'text-gray-900', 'shadow-lg')
    })
  })

  describe('Hover Effects', () => {
    it('should have hover shadow elevation for standard variant', () => {
      render(
        <Card variant="standard" data-testid="test-card">
          Hover
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('hover:shadow-lg')
    })

    it('should have hover shadow elevation for elevated variant', () => {
      render(
        <Card variant="elevated" data-testid="test-card">
          Hover
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('hover:shadow-xl')
    })

    it('should have hover shadow elevation for glassmorphic variant', () => {
      render(
        <Card variant="glassmorphic" data-testid="test-card">
          Hover
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('hover:shadow-lg')
    })

    it('should apply scale transformation on hover when interactive', () => {
      render(
        <Card interactive data-testid="test-card">
          Interactive
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('hover:scale-102')
    })

    it('should have cursor-pointer when interactive', () => {
      render(
        <Card interactive data-testid="test-card">
          Interactive
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('cursor-pointer')
    })

    it('should not have scale transformation when not interactive', () => {
      render(<Card data-testid="test-card">Not Interactive</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).not.toHaveClass('hover:scale-102')
    })
  })

  describe('Dark Mode', () => {
    it('should have dark mode styles for standard variant', () => {
      render(
        <Card variant="standard" data-testid="test-card">
          Dark
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('dark:bg-gray-900', 'dark:text-gray-100', 'dark:border-gray-700')
    })

    it('should have dark mode styles for glassmorphic variant', () => {
      render(
        <Card variant="glassmorphic" data-testid="test-card">
          Dark
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('dark:bg-gray-900/30', 'dark:text-gray-100', 'dark:border-gray-700/20')
    })

    it('should have dark mode styles for elevated variant', () => {
      render(
        <Card variant="elevated" data-testid="test-card">
          Dark
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('dark:bg-gray-900', 'dark:text-gray-100', 'dark:border-gray-700')
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive padding', () => {
      render(<Card data-testid="test-card">Responsive</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('p-4', 'md:p-6')
    })

    it('should maintain proportional sizing across breakpoints', () => {
      render(<Card data-testid="test-card">Responsive</Card>)
      const card = screen.getByTestId('test-card')
      // Check that responsive classes are applied
      expect(card.className).toMatch(/p-4/)
      expect(card.className).toMatch(/md:p-6/)
    })
  })

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(
        <Card>
          <CardHeader data-testid="test-header">Header</CardHeader>
        </Card>
      )
      const header = screen.getByTestId('test-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveAttribute('data-slot', 'card-header')
    })

    it('should have responsive padding', () => {
      render(
        <Card>
          <CardHeader data-testid="test-header">Header</CardHeader>
        </Card>
      )
      const header = screen.getByTestId('test-header')
      expect(header).toHaveClass('[.border-b]:pb-4', 'md:[.border-b]:pb-6')
    })
  })

  describe('CardTitle', () => {
    it('should render card title', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle data-testid="test-title">Title</CardTitle>
          </CardHeader>
        </Card>
      )
      const title = screen.getByTestId('test-title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-slot', 'card-title')
    })

    it('should have proper typography styling', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle data-testid="test-title">Title</CardTitle>
          </CardHeader>
        </Card>
      )
      const title = screen.getByTestId('test-title')
      expect(title).toHaveClass('text-lg', 'md:text-xl', 'font-semibold', 'leading-tight')
    })
  })

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription data-testid="test-desc">Description</CardDescription>
          </CardHeader>
        </Card>
      )
      const desc = screen.getByTestId('test-desc')
      expect(desc).toBeInTheDocument()
      expect(desc).toHaveAttribute('data-slot', 'card-description')
    })

    it('should have proper text styling', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription data-testid="test-desc">Description</CardDescription>
          </CardHeader>
        </Card>
      )
      const desc = screen.getByTestId('test-desc')
      expect(desc).toHaveClass('text-sm', 'text-gray-600', 'dark:text-gray-400')
    })
  })

  describe('CardContent', () => {
    it('should render card content', () => {
      render(
        <Card>
          <CardContent data-testid="test-content">Content</CardContent>
        </Card>
      )
      const content = screen.getByTestId('test-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'card-content')
    })

    it('should have responsive padding', () => {
      render(
        <Card>
          <CardContent data-testid="test-content">Content</CardContent>
        </Card>
      )
      const content = screen.getByTestId('test-content')
      expect(content).toHaveClass('py-2', 'md:py-4')
    })
  })

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(
        <Card>
          <CardFooter data-testid="test-footer">Footer</CardFooter>
        </Card>
      )
      const footer = screen.getByTestId('test-footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveAttribute('data-slot', 'card-footer')
    })

    it('should have flex layout with responsive gap', () => {
      render(
        <Card>
          <CardFooter data-testid="test-footer">Footer</CardFooter>
        </Card>
      )
      const footer = screen.getByTestId('test-footer')
      expect(footer).toHaveClass('flex', 'items-center', 'gap-2', 'md:gap-4')
    })
  })

  describe('CardAction', () => {
    it('should render card action', () => {
      render(
        <Card>
          <CardHeader>
            <CardAction data-testid="test-action">Action</CardAction>
          </CardHeader>
        </Card>
      )
      const action = screen.getByTestId('test-action')
      expect(action).toBeInTheDocument()
      expect(action).toHaveAttribute('data-slot', 'card-action')
    })

    it('should have proper positioning', () => {
      render(
        <Card>
          <CardHeader>
            <CardAction data-testid="test-action">Action</CardAction>
          </CardHeader>
        </Card>
      )
      const action = screen.getByTestId('test-action')
      expect(action).toHaveClass('col-start-2', 'row-span-2', 'row-start-1', 'self-start', 'justify-self-end')
    })
  })

  describe('Composition', () => {
    it('should render complete card structure', () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('should render card with action', () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(
        <Card className="custom-class" data-testid="test-card">
          Custom
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toHaveClass('custom-class')
    })

    it('should accept custom data attributes', () => {
      render(
        <Card data-testid="custom-card" data-custom="value">
          Custom
        </Card>
      )
      const card = screen.getByTestId('custom-card')
      expect(card).toHaveAttribute('data-custom', 'value')
    })

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Card ref={ref} data-testid="test-card">
          Ref
        </Card>
      )
      expect(ref.current).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should handle click events on interactive card', async () => {
      const handleClick = jest.fn()
      render(
        <Card interactive onClick={handleClick} data-testid="test-card">
          Click me
        </Card>
      )
      const card = screen.getByTestId('test-card')
      await userEvent.click(card)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should handle mouse events', async () => {
      const handleMouseEnter = jest.fn()
      const handleMouseLeave = jest.fn()
      render(
        <Card
          interactive
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          data-testid="test-card"
        >
          Hover
        </Card>
      )
      const card = screen.getByTestId('test-card')
      await userEvent.hover(card)
      expect(handleMouseEnter).toHaveBeenCalled()
      await userEvent.unhover(card)
      expect(handleMouseLeave).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible when interactive', async () => {
      const handleClick = jest.fn()
      render(
        <Card
          interactive
          onClick={handleClick}
          role="button"
          tabIndex={0}
          data-testid="test-card"
        >
          Accessible
        </Card>
      )
      const card = screen.getByTestId('test-card')
      card.focus()
      expect(card).toHaveFocus()
    })

    it('should support semantic HTML', () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card.tagName).toBe('DIV')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty card', () => {
      render(<Card data-testid="test-card" />)
      const card = screen.getByTestId('test-card')
      expect(card).toBeInTheDocument()
    })

    it('should handle card with only header', () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>Header</CardHeader>
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toBeInTheDocument()
      expect(screen.getByText('Header')).toBeInTheDocument()
    })

    it('should handle nested cards', () => {
      render(
        <Card data-testid="outer-card">
          <CardContent>
            <Card data-testid="inner-card">Inner</Card>
          </CardContent>
        </Card>
      )
      expect(screen.getByTestId('outer-card')).toBeInTheDocument()
      expect(screen.getByTestId('inner-card')).toBeInTheDocument()
    })

    it('should handle card with multiple children', () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>Header</CardHeader>
          <CardContent>Content 1</CardContent>
          <CardContent>Content 2</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
      const card = screen.getByTestId('test-card')
      expect(card).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })
  })

  describe('Styling Consistency', () => {
    it('should maintain consistent border styling across variants', () => {
      const { rerender } = render(
        <Card variant="standard" data-testid="test-card">
          Standard
        </Card>
      )
      let card = screen.getByTestId('test-card')
      expect(card).toHaveClass('border')

      rerender(
        <Card variant="glassmorphic" data-testid="test-card">
          Glassmorphic
        </Card>
      )
      card = screen.getByTestId('test-card')
      expect(card).toHaveClass('border')

      rerender(
        <Card variant="elevated" data-testid="test-card">
          Elevated
        </Card>
      )
      card = screen.getByTestId('test-card')
      expect(card).toHaveClass('border')
    })

    it('should maintain consistent transition timing', () => {
      const { rerender } = render(
        <Card variant="standard" data-testid="test-card">
          Standard
        </Card>
      )
      let card = screen.getByTestId('test-card')
      expect(card).toHaveClass('duration-300')

      rerender(
        <Card variant="glassmorphic" data-testid="test-card">
          Glassmorphic
        </Card>
      )
      card = screen.getByTestId('test-card')
      expect(card).toHaveClass('duration-300')

      rerender(
        <Card variant="elevated" data-testid="test-card">
          Elevated
        </Card>
      )
      card = screen.getByTestId('test-card')
      expect(card).toHaveClass('duration-300')
    })
  })
})
