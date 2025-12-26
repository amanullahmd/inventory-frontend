import { render, screen } from '@testing-library/react'
import { ErrorMessage } from '../ErrorMessage'
import { SuccessMessage } from '../SuccessMessage'
import { DateRangePicker } from '../DateRangePicker'
import { ExportButton } from '../ExportButton'

/**
 * Feature: ui-text-sizing-improvements, Property 1: Text Size Consistency
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 * 
 * For any page in the application, all body text elements should use text-base (16px) or larger,
 * except for badges and captions which may use text-xs (12px).
 */

describe('Component Text Sizing Consistency', () => {
  describe('ErrorMessage Component', () => {
    it('should render error message with text-base class', () => {
      render(
        <ErrorMessage 
          message="This is an error message" 
          title="Error"
        />
      )
      
      const messageElement = screen.getByText('This is an error message')
      expect(messageElement).toHaveClass('text-base')
    })

    it('should render error title with text-base class', () => {
      render(
        <ErrorMessage 
          message="This is an error message" 
          title="Error"
        />
      )
      
      const titleElement = screen.getByText('Error')
      expect(titleElement).toHaveClass('text-base')
    })

    it('should maintain text-base for all error messages', () => {
      const messages = [
        'Network error occurred',
        'Invalid input provided',
        'Server error occurred'
      ]

      messages.forEach(msg => {
        const { unmount } = render(
          <ErrorMessage message={msg} title="Error" />
        )
        
        const messageElement = screen.getByText(msg)
        expect(messageElement).toHaveClass('text-base')
        unmount()
      })
    })
  })

  describe('SuccessMessage Component', () => {
    it('should render success message with text-base class', () => {
      render(
        <SuccessMessage 
          message="Operation completed successfully" 
          title="Success"
        />
      )
      
      const messageElement = screen.getByText('Operation completed successfully')
      expect(messageElement).toHaveClass('text-base')
    })

    it('should render success title with text-base class', () => {
      render(
        <SuccessMessage 
          message="Operation completed successfully" 
          title="Success"
        />
      )
      
      const titleElement = screen.getByText('Success')
      expect(titleElement).toHaveClass('text-base')
    })

    it('should maintain text-base for all success messages', () => {
      const messages = [
        'Item created successfully',
        'Changes saved',
        'Operation completed'
      ]

      messages.forEach(msg => {
        const { unmount } = render(
          <SuccessMessage message={msg} title="Success" />
        )
        
        const messageElement = screen.getByText(msg)
        expect(messageElement).toHaveClass('text-base')
        unmount()
      })
    })
  })

  describe('DateRangePicker Component', () => {
    it('should render label with text-base class', () => {
      const mockCallback = jest.fn()
      render(
        <DateRangePicker 
          onDateRangeChange={mockCallback}
          label="Select Date Range"
        />
      )
      
      const labelElement = screen.getByText('Select Date Range')
      expect(labelElement).toHaveClass('text-base')
    })

    it('should render date input fields with text-base class', () => {
      const mockCallback = jest.fn()
      render(
        <DateRangePicker 
          onDateRangeChange={mockCallback}
          label="Select Date Range"
        />
      )
      
      const startDateInput = screen.getByLabelText('Start Date')
      const endDateInput = screen.getByLabelText('End Date')
      
      expect(startDateInput).toHaveClass('text-base')
      expect(endDateInput).toHaveClass('text-base')
    })

    it('should render helper labels with text-sm class', () => {
      const mockCallback = jest.fn()
      render(
        <DateRangePicker 
          onDateRangeChange={mockCallback}
          label="Select Date Range"
        />
      )
      
      const startLabel = screen.getByText('Start Date')
      const endLabel = screen.getByText('End Date')
      
      expect(startLabel).toHaveClass('text-sm')
      expect(endLabel).toHaveClass('text-sm')
    })
  })

  describe('ExportButton Component', () => {
    it('should render button text with text-sm class', () => {
      const mockClick = jest.fn()
      render(
        <ExportButton 
          onClick={mockClick}
          label="Export to PDF"
        />
      )
      
      const button = screen.getByRole('button', { name: /Export to PDF/i })
      expect(button).toHaveClass('text-sm')
    })

    it('should maintain text-sm for all button labels', () => {
      const labels = [
        'Export to PDF',
        'Download Report',
        'Generate CSV'
      ]

      labels.forEach(label => {
        const mockClick = jest.fn()
        const { unmount } = render(
          <ExportButton 
            onClick={mockClick}
            label={label}
          />
        )
        
        const button = screen.getByRole('button', { name: new RegExp(label) })
        expect(button).toHaveClass('text-sm')
        unmount()
      })
    })
  })

  describe('Cross-Component Text Sizing', () => {
    it('should ensure body text is at least text-base across all components', () => {
      const { container: errorContainer } = render(
        <ErrorMessage message="Error text" title="Error" />
      )
      const errorMessage = errorContainer.querySelector('p')
      expect(errorMessage).toHaveClass('text-base')

      const { container: successContainer } = render(
        <SuccessMessage message="Success text" title="Success" />
      )
      const successMessage = successContainer.querySelector('p')
      expect(successMessage).toHaveClass('text-base')
    })

    it('should ensure form labels are at least text-base', () => {
      const mockCallback = jest.fn()
      render(
        <DateRangePicker 
          onDateRangeChange={mockCallback}
          label="Select Date Range"
        />
      )
      
      const mainLabel = screen.getByText('Select Date Range')
      expect(mainLabel).toHaveClass('text-base')
    })
  })
})
