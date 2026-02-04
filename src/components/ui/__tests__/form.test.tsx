import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, FormField, useFormContext } from '../form'
import { Input } from '../input'

describe('Form Component', () => {
  describe('Basic Rendering', () => {
    it('should render form children', () => {
      render(
        <Form onSubmit={jest.fn()}>
          <input type="text" placeholder="Test input" />
        </Form>
      )
      const input = screen.getByPlaceholderText('Test input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should call onSubmit with form values', async () => {
      const user = userEvent.setup()
      const onSubmit = jest.fn()

      render(
        <Form onSubmit={onSubmit} initialValues={{ name: 'John' }}>
          <FormField name="name">
            {({ value, onChange }) => (
              <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormField>
          <button type="submit">Submit</button>
        </Form>
      )

      const submitButton = screen.getByText('Submit')
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ name: 'John' })
      })
    })

    it('should prevent submission when validation fails', async () => {
      const user = userEvent.setup()
      const onSubmit = jest.fn()

      render(
        <Form
          onSubmit={onSubmit}
          initialValues={{ name: '' }}
          validate={(values) => {
            const errors: Record<string, string> = {}
            if (!values.name) {
              errors.name = 'Name is required'
            }
            return errors
          }}
        >
          <FormField name="name">
            {({ value, onChange, error, touched }) => (
              <div>
                <input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
                {error && <span>{error}</span>}
              </div>
            )}
          </FormField>
          <button type="submit">Submit</button>
        </Form>
      )

      const submitButton = screen.getByText('Submit')
      await user.click(submitButton)

      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Form Validation', () => {
    it('should validate on field blur', async () => {
      const user = userEvent.setup()

      render(
        <Form
          onSubmit={jest.fn()}
          initialValues={{ name: '' }}
          validate={(values) => {
            const errors: Record<string, string> = {}
            if (!values.name) {
              errors.name = 'Name is required'
            }
            return errors
          }}
        >
          <FormField name="name">
            {({ value, onChange, onBlur, error }) => (
              <div>
                <input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                />
                {error && <span>{error}</span>}
              </div>
            )}
          </FormField>
        </Form>
      )

      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.click(document.body)

      const errorMessage = screen.getByText('Name is required')
      expect(errorMessage).toBeInTheDocument()
    })
  })

  describe('FormField Component', () => {
    it('should track field value changes', async () => {
      const user = userEvent.setup()

      render(
        <Form onSubmit={jest.fn()} initialValues={{ name: '' }}>
          <FormField name="name">
            {({ value, onChange }) => (
              <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormField>
        </Form>
      )

      const input = screen.getByRole('textbox')
      await user.type(input, 'John')

      expect(input).toHaveValue('John')
    })

    it('should track touched state', async () => {
      const user = userEvent.setup()

      render(
        <Form onSubmit={jest.fn()} initialValues={{ name: '' }}>
          <FormField name="name">
            {({ value, onChange, onBlur, touched }) => (
              <div>
                <input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                />
                {touched && <span>Field touched</span>}
              </div>
            )}
          </FormField>
        </Form>
      )

      const input = screen.getByRole('textbox')
      expect(screen.queryByText('Field touched')).not.toBeInTheDocument()

      await user.click(input)
      await user.click(document.body)

      expect(screen.getByText('Field touched')).toBeInTheDocument()
    })
  })

  describe('useFormContext Hook', () => {
    it('should throw error when used outside Form', () => {
      const TestComponent = () => {
        useFormContext()
        return null
      }

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => render(<TestComponent />)).toThrow(
        'useFormContext must be used within a Form component'
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Multiple Fields', () => {
    it('should handle multiple form fields', async () => {
      const user = userEvent.setup()
      const onSubmit = jest.fn()

      render(
        <Form
          onSubmit={onSubmit}
          initialValues={{ name: '', email: '' }}
        >
          <FormField name="name">
            {({ value, onChange }) => (
              <input
                placeholder="Name"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormField>
          <FormField name="email">
            {({ value, onChange }) => (
              <input
                placeholder="Email"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormField>
          <button type="submit">Submit</button>
        </Form>
      )

      const nameInput = screen.getByPlaceholderText('Name')
      const emailInput = screen.getByPlaceholderText('Email')

      await user.type(nameInput, 'John')
      await user.type(emailInput, 'john@example.com')

      const submitButton = screen.getByText('Submit')
      await user.click(submitButton)

      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@example.com',
      })
    })
  })

  describe('Async Submission', () => {
    it('should handle async onSubmit', async () => {
      const user = userEvent.setup()
      const onSubmit = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(
        <Form onSubmit={onSubmit} initialValues={{ name: 'John' }}>
          <FormField name="name">
            {({ value, onChange }) => (
              <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormField>
          <button type="submit">Submit</button>
        </Form>
      )

      const submitButton = screen.getByText('Submit')
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })
  })
})
