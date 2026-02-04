import React from 'react'
import { render } from '@testing-library/react'
import fc from 'fast-check'
import { Button } from '@/components/ui/button'

/**
 * Button Component Property-Based Tests
 * 
 * Tests universal properties that should hold across all valid inputs
 * Validates: Requirements 5.1, 5.2, 6.1
 */

describe('Button Component - Property-Based Tests', () => {
  /**
   * Property 15: Button Variant Completeness
   * For any button component, it should support at least 4 variants 
   * (primary, secondary, outline, ghost) with distinct visual styling.
   * 
   * Validates: Requirements 5.1
   */
  describe('Property 15: Button Variant Completeness', () => {
    it('should render all 4 required variants', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const

      variants.forEach((variant) => {
        const { container } = render(<Button variant={variant}>Test</Button>)
        const button = container.querySelector('button')
        expect(button).toHaveAttribute('data-variant', variant)
      })
    })

    it('should have distinct styling for each variant', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const
      const classNames: Record<string, string[]> = {}

      variants.forEach((variant) => {
        const { container } = render(<Button variant={variant}>Test</Button>)
        const button = container.querySelector('button')
        classNames[variant] = Array.from(button?.classList || [])
      })

      // Verify each variant has unique classes
      const uniqueVariants = new Set(Object.values(classNames).map(c => c.join(' ')))
      expect(uniqueVariants.size).toBe(variants.length)
    })

    it('should apply variant-specific background colors', () => {
      const variantColors = {
        primary: ['bg-gradient-to-r', 'from-blue-400', 'to-blue-600'],
        secondary: ['bg-purple-600'],
        outline: ['border-2', 'border-blue-600', 'bg-transparent'],
        ghost: ['bg-transparent'],
      }

      Object.entries(variantColors).forEach(([variant, expectedClasses]) => {
        const { container } = render(
          <Button variant={variant as any}>Test</Button>
        )
        const button = container.querySelector('button')
        expectedClasses.forEach((cls) => {
          expect(button).toHaveClass(cls)
        })
      })
    })
  })

  /**
   * Property 16: Button State Visibility
   * For any button component, each state (default, hover, active, disabled, loading) 
   * should have visually distinct styling.
   * 
   * Validates: Requirements 5.2
   */
  describe('Property 16: Button State Visibility', () => {
    it('should have distinct disabled state styling', () => {
      const { container: enabledContainer } = render(<Button>Enabled</Button>)
      const { container: disabledContainer } = render(
        <Button disabled>Disabled</Button>
      )

      const enabledButton = enabledContainer.querySelector('button')
      const disabledButton = disabledContainer.querySelector('button')

      expect(disabledButton).toBeDisabled()
      expect(disabledButton).toHaveClass('disabled:opacity-50')
      expect(enabledButton).not.toBeDisabled()
    })

    it('should have distinct loading state styling', () => {
      const { container: normalContainer } = render(<Button>Normal</Button>)
      const { container: loadingContainer } = render(<Button loading>Loading</Button>)

      const normalButton = normalContainer.querySelector('button')
      const loadingButton = loadingContainer.querySelector('button')

      expect(loadingButton).toBeDisabled()
      expect(loadingButton).toHaveClass('opacity-75')
      expect(loadingButton?.querySelector('svg')).toBeInTheDocument()
      expect(normalButton?.querySelector('svg')).not.toBeInTheDocument()
    })

    it('should have hover state classes for interactive variants', () => {
      const interactiveVariants = ['primary', 'secondary', 'outline', 'ghost'] as const

      interactiveVariants.forEach((variant) => {
        const { container } = render(<Button variant={variant}>Test</Button>)
        const button = container.querySelector('button')

        // All variants should have some hover styling
        const hasHoverClass = Array.from(button?.classList || []).some((cls) =>
          cls.includes('hover:')
        )
        expect(hasHoverClass).toBe(true)
      })
    })

    it('should have active state classes for interactive variants', () => {
      const interactiveVariants = ['primary', 'secondary'] as const

      interactiveVariants.forEach((variant) => {
        const { container } = render(<Button variant={variant}>Test</Button>)
        const button = container.querySelector('button')

        // Primary and secondary should have active styling
        const hasActiveClass = Array.from(button?.classList || []).some((cls) =>
          cls.includes('active:')
        )
        expect(hasActiveClass).toBe(true)
      })
    })
  })

  /**
   * Property 19: Transition Duration Consistency
   * For any UI element state change, the transition duration should be 
   * between 200-300ms with smooth easing.
   * 
   * Validates: Requirements 6.1
   */
  describe('Property 19: Transition Duration Consistency', () => {
    it('should have transition classes for smooth animations', () => {
      const { container } = render(<Button>Transition</Button>)
      const button = container.querySelector('button')

      expect(button).toHaveClass('transition-all')
      expect(button).toHaveClass('duration-200')
      expect(button).toHaveClass('ease-in-out')
    })

    it('should apply consistent transition to all variants', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const

      variants.forEach((variant) => {
        const { container } = render(<Button variant={variant}>Test</Button>)
        const button = container.querySelector('button')

        expect(button).toHaveClass('transition-all')
        expect(button).toHaveClass('duration-200')
        expect(button).toHaveClass('ease-in-out')
      })
    })

    it('should apply consistent transition to all sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const

      sizes.forEach((size) => {
        const { container } = render(<Button size={size}>Test</Button>)
        const button = container.querySelector('button')

        expect(button).toHaveClass('transition-all')
        expect(button).toHaveClass('duration-200')
        expect(button).toHaveClass('ease-in-out')
      })
    })
  })

  /**
   * Property-based test: Button should always be accessible
   * For any button rendered with any combination of props,
   * it should have proper button role and be keyboard accessible
   */
  describe('Accessibility Properties', () => {
    it('should always have button role regardless of variant', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('primary'),
            fc.constant('secondary'),
            fc.constant('outline'),
            fc.constant('ghost')
          ),
          (variant) => {
            const { container } = render(<Button variant={variant as any}>Test</Button>)
            const button = container.querySelector('button')
            expect(button?.tagName).toBe('BUTTON')
          }
        )
      )
    })

    it('should always have button role regardless of size', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('sm'),
            fc.constant('md'),
            fc.constant('lg')
          ),
          (size) => {
            const { container } = render(<Button size={size as any}>Test</Button>)
            const button = container.querySelector('button')
            expect(button?.tagName).toBe('BUTTON')
          }
        )
      )
    })

    it('should always be focusable', () => {
      fc.assert(
        fc.property(fc.boolean(), (disabled) => {
          const { container } = render(
            <Button disabled={disabled}>Test</Button>
          )
          const button = container.querySelector('button') as HTMLButtonElement
          
          if (!disabled) {
            button.focus()
            expect(button).toHaveFocus()
          }
        })
      )
    })
  })

  /**
   * Property-based test: Button should maintain consistent structure
   * For any button rendered with any combination of props,
   * it should have consistent flex layout and text alignment
   */
  describe('Layout Properties', () => {
    it('should always have flex layout', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('primary'),
            fc.constant('secondary'),
            fc.constant('outline'),
            fc.constant('ghost')
          ),
          fc.oneof(
            fc.constant('sm'),
            fc.constant('md'),
            fc.constant('lg')
          ),
          (variant, size) => {
            const { container } = render(
              <Button variant={variant as any} size={size as any}>
                Test
              </Button>
            )
            const button = container.querySelector('button')
            expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
          }
        )
      )
    })

    it('should always have rounded corners', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('sm'),
            fc.constant('md'),
            fc.constant('lg')
          ),
          (size) => {
            const { container } = render(<Button size={size as any}>Test</Button>)
            const button = container.querySelector('button')
            expect(button).toHaveClass('rounded-lg')
          }
        )
      )
    })
  })

  /**
   * Property-based test: Button should handle text content correctly
   * For any button rendered with text content,
   * the text should be visible and accessible
   */
  describe('Content Properties', () => {
    it('should render text content correctly', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 50 }), (text) => {
          const { container } = render(<Button>{text}</Button>)
          const button = container.querySelector('button')
          expect(button?.textContent).toContain(text)
        })
      )
    })

    it('should handle empty content', () => {
      const { container } = render(<Button />)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })
  })

  /**
   * Property-based test: Button should maintain disabled state consistency
   * For any button with disabled prop, it should not be clickable
   */
  describe('Disabled State Properties', () => {
    it('should always be disabled when disabled prop is true', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('primary'),
            fc.constant('secondary'),
            fc.constant('outline'),
            fc.constant('ghost')
          ),
          (variant) => {
            const { container } = render(
              <Button variant={variant as any} disabled>
                Test
              </Button>
            )
            const button = container.querySelector('button') as HTMLButtonElement
            expect(button.disabled).toBe(true)
          }
        )
      )
    })

    it('should always have pointer-events-none when disabled', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('primary'),
            fc.constant('secondary'),
            fc.constant('outline'),
            fc.constant('ghost')
          ),
          (variant) => {
            const { container } = render(
              <Button variant={variant as any} disabled>
                Test
              </Button>
            )
            const button = container.querySelector('button')
            expect(button).toHaveClass('disabled:pointer-events-none')
          }
        )
      )
    })
  })

  /**
   * Property-based test: Button should maintain loading state consistency
   * For any button with loading prop, it should show spinner and be disabled
   */
  describe('Loading State Properties', () => {
    it('should always show spinner when loading', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('primary'),
            fc.constant('secondary'),
            fc.constant('outline'),
            fc.constant('ghost')
          ),
          (variant) => {
            const { container } = render(
              <Button variant={variant as any} loading>
                Test
              </Button>
            )
            const button = container.querySelector('button')
            const spinner = button?.querySelector('svg')
            expect(spinner).toBeInTheDocument()
          }
        )
      )
    })

    it('should always be disabled when loading', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('primary'),
            fc.constant('secondary'),
            fc.constant('outline'),
            fc.constant('ghost')
          ),
          (variant) => {
            const { container } = render(
              <Button variant={variant as any} loading>
                Test
              </Button>
            )
            const button = container.querySelector('button') as HTMLButtonElement
            expect(button.disabled).toBe(true)
          }
        )
      )
    })

    it('should always have aria-busy when loading', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('primary'),
            fc.constant('secondary'),
            fc.constant('outline'),
            fc.constant('ghost')
          ),
          (variant) => {
            const { container } = render(
              <Button variant={variant as any} loading>
                Test
              </Button>
            )
            const button = container.querySelector('button')
            expect(button).toHaveAttribute('aria-busy', 'true')
          }
        )
      )
    })
  })
})
