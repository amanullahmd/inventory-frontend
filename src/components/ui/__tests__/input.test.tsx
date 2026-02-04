import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input Component', () => {
  describe('Default State', () => {
    it('should render an input field', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('should render with placeholder text', () => {
      render(<Input placeholder="Enter text" />)
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<Input id="test-input" label="Test Label" />)
      const label = screen.getByText('Test Label')
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('for', 'test-input')
    })
  })

  describe('Focus State', () => {
    it('should apply focus styles when focused', async () => {
      const user = userEvent.setup()
      render(<Input />)
      const input = screen.getByRole('textbox')

      await user.click(input)
      expect(input).toHaveFocus()
      expect(input).toHaveClass('focus:border-blue-500')
    })

    it('should call onFocus callback', async () => {
      const user = userEvent.setup()
      const onFocus = jest.fn()
      render(<Input onFocus={onFocus} />)
      const input = screen.getByRole('textbox')

      await user.click(input)
      expect(onFocus).toHaveBeenCalled()
    })
  })

  describe('Error State', () => {
    it('should display error message', () => {
      render(<Input id="test-input" error="This field is required" />)
      const errorMessage = screen.getByText('This field is required')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveAttribute('role', 'alert')
    })

    it('should apply error styling to input', () => {
      render(<Input error="Error message" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-red-500')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should set aria-describedby for error', () => {
      render(<Input id="test-input" error="Error message" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error')
    })
  })

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />)
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:opacity-50')
    })

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup()
      render(<Input disabled value="test" onChange={jest.fn()} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('test')

      await user.type(input, 'more')
      expect(input.value).toBe('test')
    })
  })

  describe('Helper Text', () => {
    it('should display helper text', () => {
      render(<Input id="test-input" helperText="This is helper text" />)
      const helperText = screen.getByText('This is helper text')
      expect(helperText).toBeInTheDocument()
    })

    it('should set aria-describedby for helper text', () => {
      render(<Input id="test-input" helperText="Helper text" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'test-input-helper')
    })

    it('should not show helper text when error is present', () => {
      render(
        <Input
          id="test-input"
          error="Error message"
          helperText="Helper text"
        />
      )
      const helperText = screen.queryByText('Helper text')
      expect(helperText).not.toBeInTheDocument()
    })
  })

  describe('Icon', () => {
    it('should render icon when provided', () => {
      render(
        <Input
          icon={<span data-testid="test-icon">🔍</span>}
        />
      )
      const icon = screen.getByTestId('test-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should apply icon padding to input', () => {
      render(
        <Input
          icon={<span>🔍</span>}
        />
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('pl-10')
    })
  })

  describe('Input Types', () => {
    it('should render email input', () => {
      render(<Input type="email" />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.type).toBe('email')
    })

    it('should render password input', () => {
      render(<Input type="password" />)
      const input = screen.getByDisplayValue('') as HTMLInputElement
      expect(input.type).toBe('password')
    })

    it('should render number input', () => {
      render(<Input type="number" />)
      const input = screen.getByRole('spinbutton')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Input
          id="test-input"
          label="Test Label"
          error="Error message"
        />
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error')
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()
      render(<Input onChange={onChange} />)
      const input = screen.getByRole('textbox')

      await user.type(input, 'test')
      expect(onChange).toHaveBeenCalled()
    })
  })
})
