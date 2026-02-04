import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ThemeToggle } from '../theme-toggle'

describe('ThemeToggle Component', () => {
  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    )
  }

  describe('Icon Variant', () => {
    it('should render icon toggle button', () => {
      renderWithTheme(<ThemeToggle variant="icon" />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should have aria-label', () => {
      renderWithTheme(<ThemeToggle variant="icon" />)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label')
    })

    it('should render SVG icon', () => {
      const { container } = renderWithTheme(<ThemeToggle variant="icon" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Button Variant', () => {
    it('should render button toggle', () => {
      renderWithTheme(<ThemeToggle variant="button" />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should display text label', () => {
      renderWithTheme(<ThemeToggle variant="button" />)
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent(/dark|light/i)
    })

    it('should have aria-label', () => {
      renderWithTheme(<ThemeToggle variant="button" />)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label')
    })
  })

  describe('Accessibility', () => {
    it('should have focus ring', () => {
      renderWithTheme(<ThemeToggle variant="icon" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:ring-2')
    })

    it('should be keyboard accessible', () => {
      renderWithTheme(<ThemeToggle variant="icon" />)
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })
  })

  describe('Styling', () => {
    it('should apply custom className', () => {
      renderWithTheme(<ThemeToggle variant="icon" className="custom-class" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should have hover styles', () => {
      renderWithTheme(<ThemeToggle variant="icon" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-gray-100')
    })

    it('should have dark mode styles', () => {
      renderWithTheme(<ThemeToggle variant="icon" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('dark:text-gray-300')
    })
  })

  describe('Default Variant', () => {
    it('should render icon variant by default', () => {
      renderWithTheme(<ThemeToggle />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-10')
      expect(button).toHaveClass('h-10')
    })
  })

  describe('Button Variant Styling', () => {
    it('should have border styling', () => {
      renderWithTheme(<ThemeToggle variant="button" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
    })

    it('should have background styling', () => {
      renderWithTheme(<ThemeToggle variant="button" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-white')
    })
  })
})
