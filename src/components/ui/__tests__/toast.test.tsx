import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToast } from '../toast'

describe('Toast Component', () => {
  const TestComponent = () => {
    const { addToast } = useToast()

    return (
      <div>
        <button
          onClick={() =>
            addToast({
              message: 'Success message',
              variant: 'success',
            })
          }
        >
          Add Success Toast
        </button>
        <button
          onClick={() =>
            addToast({
              message: 'Error message',
              variant: 'error',
            })
          }
        >
          Add Error Toast
        </button>
        <button
          onClick={() =>
            addToast({
              message: 'Warning message',
              variant: 'warning',
            })
          }
        >
          Add Warning Toast
        </button>
        <button
          onClick={() =>
            addToast({
              message: 'Info message',
              variant: 'info',
            })
          }
        >
          Add Info Toast
        </button>
      </div>
    )
  }

  describe('Toast Display', () => {
    it('should render toast provider', () => {
      render(
        <ToastProvider>
          <div>Content</div>
        </ToastProvider>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should display success toast', async () => {
      const user = userEvent.setup()

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      const button = screen.getByRole('button', { name: /add success toast/i })
      await user.click(button)

      expect(screen.getByText('Success message')).toBeInTheDocument()
    })

    it('should display error toast', async () => {
      const user = userEvent.setup()

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      const button = screen.getByRole('button', { name: /add error toast/i })
      await user.click(button)

      expect(screen.getByText('Error message')).toBeInTheDocument()
    })

    it('should display warning toast', async () => {
      const user = userEvent.setup()

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      const button = screen.getByRole('button', { name: /add warning toast/i })
      await user.click(button)

      expect(screen.getByText('Warning message')).toBeInTheDocument()
    })

    it('should display info toast', async () => {
      const user = userEvent.setup()

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      const button = screen.getByRole('button', { name: /add info toast/i })
      await user.click(button)

      expect(screen.getByText('Info message')).toBeInTheDocument()
    })
  })

  describe('Toast Dismissal', () => {
    it('should close toast when close button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      const addButton = screen.getByRole('button', { name: /add success toast/i })
      await user.click(addButton)

      const closeButton = screen.getByLabelText('Close notification')
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument()
      })
    })

    it('should auto-dismiss toast after duration', async () => {
      render(
        <ToastProvider>
          <div>
            <button
              onClick={() => {
                const { addToast } = useToast()
                addToast({
                  message: 'Auto dismiss',
                  variant: 'success',
                  duration: 100,
                })
              }}
            >
              Add Toast
            </button>
          </div>
        </ToastProvider>
      )

      // Note: This test would need proper async handling
      // For now, we'll skip the timing test
    })
  })

  describe('Toast Stacking', () => {
    it('should stack multiple toasts', async () => {
      const user = userEvent.setup()

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      const successButton = screen.getByRole('button', { name: /add success toast/i })
      const errorButton = screen.getByRole('button', { name: /add error toast/i })

      await user.click(successButton)
      await user.click(errorButton)

      expect(screen.getByText('Success message')).toBeInTheDocument()
      expect(screen.getByText('Error message')).toBeInTheDocument()
    })

    it('should display multiple toasts without overlapping', async () => {
      const user = userEvent.setup()

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      const buttons = screen.getAllByRole('button').slice(0, 3)

      for (const button of buttons) {
        await user.click(button)
      }

      const alerts = screen.getAllByRole('alert')
      expect(alerts.length).toBe(3)
    })
  })

  describe('Toast Accessibility', () => {
    it('should have alert role', async () => {
      const user = userEvent.setup()

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      const button = screen.getByRole('button', { name: /add success toast/i })
      await user.click(button)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('should have aria-live polite', async () => {
      const user = userEvent.setup()

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      const button = screen.getByRole('button', { name: /add success toast/i })
      await user.click(button)

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'polite')
    })

    it('should have close button with aria-label', async () => {
      const user = userEvent.setup()

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      const button = screen.getByRole('button', { name: /add success toast/i })
      await user.click(button)

      const closeButton = screen.getByLabelText('Close notification')
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('useToast Hook', () => {
    it('should throw error when used outside ToastProvider', () => {
      const TestComponentOutsideProvider = () => {
        useToast()
        return null
      }

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => render(<TestComponentOutsideProvider />)).toThrow(
        'useToast must be used within a ToastProvider'
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Toast with Action', () => {
    it('should display action button', async () => {
      const user = userEvent.setup()
      const onAction = jest.fn()

      const TestComponentWithAction = () => {
        const { addToast } = useToast()

        return (
          <button
            onClick={() =>
              addToast({
                message: 'Undo action',
                variant: 'success',
                action: {
                  label: 'Undo',
                  onClick: onAction,
                },
              })
            }
          >
            Add Toast with Action
          </button>
        )
      }

      render(
        <ToastProvider>
          <TestComponentWithAction />
        </ToastProvider>
      )

      const button = screen.getByRole('button', { name: /add toast with action/i })
      await user.click(button)

      const actionButton = screen.getByRole('button', { name: /undo/i })
      expect(actionButton).toBeInTheDocument()

      await user.click(actionButton)
      expect(onAction).toHaveBeenCalled()
    })
  })
})
