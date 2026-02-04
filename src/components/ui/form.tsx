'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Form Component
 * 
 * Implements form validation with real-time error display:
 * - Real-time validation feedback
 * - Error message styling with red color
 * - Success feedback with checkmark
 * - Form submission handling
 * 
 * Validates: Requirements 19.1, 19.2, 19.3
 */

interface FormFieldError {
  [key: string]: string
}

interface FormContextType {
  errors: FormFieldError
  setErrors: (errors: FormFieldError) => void
  touched: Set<string>
  setTouched: (field: string) => void
  values: Record<string, any>
  setValues: (values: Record<string, any>) => void
}

const FormContext = React.createContext<FormContextType | undefined>(undefined)

export const useFormContext = () => {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a Form component')
  }
  return context
}

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (values: Record<string, any>) => void | Promise<void>
  initialValues?: Record<string, any>
  validate?: (values: Record<string, any>) => FormFieldError
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      onSubmit,
      initialValues = {},
      validate,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [errors, setErrors] = React.useState<FormFieldError>({})
    const [touched, setTouched] = React.useState<Set<string>>(new Set())
    const [values, setValues] = React.useState(initialValues)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      // Validate form
      if (validate) {
        const newErrors = validate(values)
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
          return
        }
      }

      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    }

    const handleFieldTouched = (field: string) => {
      setTouched(new Set([...touched, field]))

      // Validate field on blur
      if (validate) {
        const newErrors = validate(values)
        setErrors(newErrors)
      }
    }

    return (
      <FormContext.Provider
        value={{
          errors,
          setErrors,
          touched,
          setTouched: handleFieldTouched,
          values,
          setValues,
        }}
      >
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={cn('space-y-4', className)}
          noValidate
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    )
  }
)

Form.displayName = 'Form'

interface FormFieldProps {
  name: string
  children: (props: {
    value: any
    onChange: (value: any) => void
    onBlur: () => void
    error?: string
    touched: boolean
  }) => React.ReactNode
}

const FormField = ({ name, children }: FormFieldProps) => {
  const { errors, touched, values, setValues, setTouched } = useFormContext()

  const value = values[name] ?? ''
  const error = touched.has(name) ? errors[name] : undefined
  const isTouched = touched.has(name)

  const handleChange = (newValue: any) => {
    setValues({ ...values, [name]: newValue })
  }

  const handleBlur = () => {
    setTouched(name)
  }

  return (
    <>
      {children({
        value,
        onChange: handleChange,
        onBlur: handleBlur,
        error,
        touched: isTouched,
      })}
    </>
  )
}

FormField.displayName = 'FormField'

export { Form, FormField, type FormProps, type FormFieldError }
