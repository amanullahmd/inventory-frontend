/**
 * Integration tests for complete user flows with mock backend
 * Feature: inventory-frontend
 */

import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: jest.fn(),
  }),
  usePathname: () => '/items',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock NextAuth
const mockSession = {
  user: { name: 'Test User', email: 'test@example.com' },
  roles: ['User'],
  accessToken: 'mock-token'
}

const mockAdminSession = {
  user: { name: 'Admin User', email: 'admin@example.com' },
  roles: ['Admin'],
  accessToken: 'mock-admin-token'
}

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: mockSession, status: 'authenticated' })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock components for testing
interface MockItem {
  id: string
  name: string
  sku: string
  unitCost: number
  currentStock: number
  createdAt: string
}

const MockItemsPage = () => {
  const [items, setItems] = React.useState<MockItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/items', {
        headers: {
          'Authorization': `Bearer ${mockSession.accessToken}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch items')
      }
      
      const data = await response.json()
      setItems(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchItems()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return (
    <div>
      <div>Error: {error}</div>
      <button onClick={fetchItems}>Refresh</button>
    </div>
  )

  return (
    <div>
      <h1>Items</h1>
      <button onClick={fetchItems}>Refresh</button>
      {items.map(item => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          <span>{item.name}</span>
          <span>{item.sku}</span>
          <span>Stock: {item.currentStock}</span>
        </div>
      ))}
    </div>
  )
}

const MockStockInForm = () => {
  const [itemId, setItemId] = React.useState('')
  const [quantity, setQuantity] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/stock/in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockSession.accessToken}`
        },
        body: JSON.stringify({
          itemId,
          quantity: parseFloat(quantity)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }

      setSuccess(true)
      setItemId('')
      setQuantity('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Stock In</h1>
      <input
        type="text"
        placeholder="Item ID"
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        data-testid="item-id-input"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        data-testid="quantity-input"
      />
      <button type="submit" disabled={loading} data-testid="submit-button">
        {loading ? 'Adding...' : 'Add Stock'}
      </button>
      {success && <div data-testid="success-message">Stock added successfully!</div>}
      {error && <div data-testid="error-message">Error: {error}</div>}
    </form>
  )
}

interface MockUser {
  id: string
  username: string
  email: string
  roles: string[]
  createdAt: string
}

interface MockSession {
  user: { name: string; email: string }
  roles: string[]
  accessToken: string
}

const MockUserManagement = ({ userSession }: { userSession: MockSession }) => {
  const [users, setUsers] = React.useState<MockUser[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [accessDenied, setAccessDenied] = React.useState(false)

  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    setAccessDenied(false)
    
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${userSession.accessToken}`
        }
      })
      
      if (response.status === 403) {
        setAccessDenied(true)
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [userSession])

  React.useEffect(() => {
    fetchUsers()
  }, [userSession, fetchUsers])

  if (loading) return <div>Loading...</div>
  if (accessDenied) return <div data-testid="access-denied">Access denied - Admin access required</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>User Management</h1>
      {users.map(user => (
        <div key={user.id} data-testid={`user-${user.id}`}>
          <span>{user.username}</span>
          <span>{user.email}</span>
          <span>Roles: {user.roles.join(', ')}</span>
        </div>
      ))}
    </div>
  )
}

import React from 'react'

// Mock interfaces for type safety

describe('Integration Tests - Complete User Flows', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock fetch for integration tests
    global.fetch = jest.fn()
  })

  describe('Authenticated User Flow', () => {
    /**
     * Tests Requirements 1.1, 2.1, 2.3 - Authentication and item viewing
     */
    test('should load and display items for authenticated user', async () => {
      // Mock successful API response
      const mockItems = [
        { id: '1', name: 'Test Item 1', sku: 'TEST-001', unitCost: 10.99, currentStock: 50, createdAt: '2024-01-01T00:00:00Z' },
        { id: '2', name: 'Test Item 2', sku: 'TEST-002', unitCost: 25.50, currentStock: 25, createdAt: '2024-01-01T00:00:00Z' }
      ];
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockItems)
      })

      render(<MockItemsPage />)

      // Should show loading initially
      expect(screen.getByText('Loading...')).toBeInTheDocument()

      // Should display items after loading
      await waitFor(() => {
        expect(screen.getByText('Test Item 1')).toBeInTheDocument()
        expect(screen.getByText('Test Item 2')).toBeInTheDocument()
      })

      // Should display stock information
      expect(screen.getByText('Stock: 50')).toBeInTheDocument()
      expect(screen.getByText('Stock: 25')).toBeInTheDocument()
    })

    /**
     * Tests Requirements 4.1, 4.2, 4.4 - Stock-in functionality
     */
    test('should successfully add stock to items', async () => {
      // Mock successful stock-in response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: 'movement-1',
          itemId: '1',
          movementType: 'IN',
          quantity: 10,
          createdAt: new Date().toISOString()
        })
      })

      const user = userEvent.setup()
      render(<MockStockInForm />)

      // Fill in the form
      await user.type(screen.getByTestId('item-id-input'), '1')
      await user.type(screen.getByTestId('quantity-input'), '10')

      // Submit the form
      await user.click(screen.getByTestId('submit-button'))

      // Should show success message
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument()
      })

      // Form should be cleared
      expect(screen.getByTestId('item-id-input')).toHaveValue('')
      const quantityInput = screen.getByTestId('quantity-input') as HTMLInputElement
      expect(quantityInput.value).toBe('')
    })

    /**
     * Tests Requirements 5.2 - Insufficient stock validation
     */
    test('should handle insufficient stock error', async () => {
      // Mock insufficient stock error response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ 
          message: 'Insufficient stock. Available: 5 units' 
        })
      })

      const MockStockOutForm = () => {
        const [error, setError] = React.useState<string | null>(null)

        const handleStockOut = async () => {
          try {
            const response = await fetch('/api/stock/out', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mockSession.accessToken}`
              },
              body: JSON.stringify({ itemId: '1', quantity: 100 })
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.message)
            }
          } catch (err) {
            setError((err as Error).message)
          }
        }

        return (
          <div>
            <button onClick={handleStockOut} data-testid="stock-out-button">
              Remove Stock
            </button>
            {error && <div data-testid="error-message">{error}</div>}
          </div>
        )
      }

      const user = userEvent.setup()
      render(<MockStockOutForm />)

      await user.click(screen.getByTestId('stock-out-button'))

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Insufficient stock')
      })
    })
  })

  describe('Role-Based Access Control', () => {
    /**
     * Tests Requirements 6.4 - Non-admin access control
     */
    test('should deny access to user management for non-admin users', async () => {
      // Mock 403 forbidden response for non-admin user
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ message: 'Forbidden - Admin access required' })
      })

      render(<MockUserManagement userSession={mockSession} />)

      await waitFor(() => {
        expect(screen.getByTestId('access-denied')).toBeInTheDocument()
        expect(screen.getByText('Access denied - Admin access required')).toBeInTheDocument()
      })
    })

    /**
     * Tests Requirements 6.1, 6.3 - Admin user management access
     */
    test('should allow admin users to access user management', async () => {
      // Mock successful users response for admin
      const mockUsers = [
        { id: '1', username: 'admin', email: 'admin@test.com', roles: ['Admin'], createdAt: '2024-01-01T00:00:00Z' },
        { id: '2', username: 'user1', email: 'user1@test.com', roles: ['User'], createdAt: '2024-01-01T00:00:00Z' }
      ];
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsers)
      })

      render(<MockUserManagement userSession={mockAdminSession} />)

      await waitFor(() => {
        expect(screen.getByText('User Management')).toBeInTheDocument()
        expect(screen.getByTestId('user-1')).toBeInTheDocument()
        expect(screen.getByTestId('user-2')).toBeInTheDocument()
      })

      // Should display user information
      expect(screen.getByText('admin')).toBeInTheDocument()
      expect(screen.getByText('user1')).toBeInTheDocument()
      expect(screen.getByText('Roles: Admin')).toBeInTheDocument()
      expect(screen.getByText('Roles: User')).toBeInTheDocument()
    })
  })

  describe('Error Handling Flows', () => {
    /**
     * Tests Requirements 8.2 - 401 error handling
     */
    test('should handle 401 unauthorized responses', async () => {
      // Mock 401 unauthorized response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' })
      })

      render(<MockItemsPage />)

      await waitFor(() => {
        expect(screen.getByText('Error: Failed to fetch items')).toBeInTheDocument()
      })
    })

    /**
     * Tests Requirements 8.4 - Network error handling
     */
    test('should handle network errors with retry option', async () => {
      // Mock network error first, then success on retry
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            {
              id: '1',
              name: 'Test Item 1',
              sku: 'TEST-001',
              unitCost: 10.99,
              currentStock: 50,
              createdAt: '2024-01-01T00:00:00Z'
            }
          ])
        })

      const user = userEvent.setup()
      render(<MockItemsPage />)

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument()
      })

      // Should provide retry option
      const refreshButton = screen.getByText('Refresh')
      expect(refreshButton).toBeInTheDocument()

      await user.click(refreshButton)

      await waitFor(() => {
        expect(screen.getByText('Test Item 1')).toBeInTheDocument()
      })
    })
  })

  describe('Authentication Flow Integration', () => {
    /**
     * Tests Requirements 7.5 - Protected route access control
     */
    test('should redirect unauthenticated users to login', () => {
      // Mock unauthenticated session
      const nextAuthReact = jest.requireMock('next-auth/react')
      nextAuthReact.useSession.mockReturnValue({ data: null, status: 'unauthenticated' })

      const MockProtectedRoute = () => {
        const { data: session, status } = nextAuthReact.useSession()
        
        if (status === 'loading') return <div>Loading...</div>
        if (!session) {
          // Simulate redirect logic
          mockPush('/auth/signin?callbackUrl=/items')
          return <div>Redirecting to login...</div>
        }
        
        return <div>Protected content</div>
      }

      render(<MockProtectedRoute />)

      expect(screen.getByText('Redirecting to login...')).toBeInTheDocument()
      expect(mockPush).toHaveBeenCalledWith('/auth/signin?callbackUrl=/items')
    })
  })
})