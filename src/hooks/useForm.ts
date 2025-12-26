'use client';

import { useState, useCallback } from 'react';

export interface FormErrors {
  [key: string]: string;
}

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  touched: { [key: string]: boolean };
  isSubmitting: boolean;
}

/**
 * Custom hook for form handling
 * Manages form state, validation, and submission
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void,
  validate?: (values: T) => FormErrors
) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  /**
   * Handle field change
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: fieldValue,
      },
    }));
  }, []);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;

    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }));
  }, []);

  /**
   * Set field value programmatically
   */
  const setFieldValue = useCallback((name: string, value: any) => {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
    }));
  }, []);

  /**
   * Set field error
   */
  const setFieldError = useCallback((name: string, error: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error,
      },
    }));
  }, []);

  /**
   * Validate form
   */
  const validateForm = useCallback((): boolean => {
    if (!validate) return true;

    const errors = validate(state.values);
    setState(prev => ({
      ...prev,
      errors,
    }));

    return Object.keys(errors).length === 0;
  }, [state.values, validate]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setState(prev => ({
      ...prev,
      isSubmitting: true,
    }));

    try {
      await onSubmit(state.values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  }, [state.values, validateForm, onSubmit]);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
    });
  }, [initialValues]);

  /**
   * Clear errors
   */
  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: {},
    }));
  }, []);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    clearErrors,
    validateForm,
  };
}
