'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { CreateUserRequest, ApiError } from '@/lib/types'
import { apiClient } from '@/lib/api/client'

interface UserFormProps {
  onUserCreated: () => void
}

export default function UserForm({ onUserCreated }: UserFormProps) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

  // Check if user is admin
  const isAdmin = session?.roles?.includes('Admin')

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Clear general error and success messages
    setError(null)
    setSuccess(null)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAdmin) {
      setError('Access denied - Admin role required')
      return
    }
    
    if (!validateForm()) {
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      await apiClient.createUser(formData)
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: ''
      })
      
      setSuccess('User created successfully with User role')
      onUserCreated() // Trigger refresh of user list
      
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  // Non-admin access denied
  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Access Denied
        </div>
        <p className="text-red-700">
          You do not have permission to create users. Admin role is required.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New User</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter username"
          />
          {validationErrors.username && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter password"
          />
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
          )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-blue-700 text-sm">
            <strong>Note:</strong> New users will be created with the &quot;User&quot; role by default.
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          } text-white`}
        >
          {loading ? 'Creating User...' : 'Create User'}
        </button>
      </form>
    </div>
  )
}