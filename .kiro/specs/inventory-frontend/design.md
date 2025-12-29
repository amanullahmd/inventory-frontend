# Design Document - Inventory Management Frontend

## Overview

The inventory management frontend is a Next.js 16.0.7 application that provides a modern, responsive web interface for managing inventory items and stock movements. The application integrates with Keycloak for authentication and communicates with a Spring Boot backend API. It supports role-based access control with Admin and User roles, ensuring appropriate feature access based on user permissions.

The application follows modern React patterns with TypeScript for type safety, uses NextAuth for Keycloak integration, and implements a clean component architecture for maintainability and scalability.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Next.js App   │────│   Keycloak   │────│  Spring Boot    │
│   (Frontend)    │    │ (Auth Server)│    │   (Backend)     │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                       │                    │
         │                       │                    │
    ┌────▼────┐             ┌────▼────┐         ┌────▼────┐
    │ Browser │             │   JWT   │         │PostgreSQL│
    │ Session │             │ Tokens  │         │Database │
    └─────────┘             └─────────┘         └─────────┘
```

### Frontend Architecture Layers

1. **Presentation Layer**: React components and pages
2. **Authentication Layer**: NextAuth integration with Keycloak
3. **API Layer**: Axios-based HTTP client with JWT token management
4. **State Management**: React hooks and context for local state
5. **Routing Layer**: Next.js App Router with middleware protection

## Components and Interfaces

### Core Components

#### Authentication Components
- `LoginButton`: Triggers Keycloak authentication flow
- `LogoutButton`: Handles session termination
- `ProtectedRoute`: Wrapper component for role-based access control

#### Layout Components
- `Navigation`: Main navigation menu with role-based visibility
- `Layout`: Common page layout with header and navigation
- `LoadingSpinner`: Reusable loading indicator component

#### Inventory Components
- `ItemTable`: Displays inventory items with current stock levels
- `ItemForm`: Form for creating new inventory items
- `StockInForm`: Form for adding stock to items
- `StockOutForm`: Form for removing stock from items

#### Admin Components
- `UserTable`: Displays user list (admin only)
- `UserForm`: Form for creating new users (admin only)

#### Utility Components
- `ErrorMessage`: Standardized error display component
- `SuccessMessage`: Standardized success notification component

### API Interface

```typescript
interface ApiClient {
  // Authentication
  getCurrentUser(): Promise<UserInfo>
  
  // Items
  getItems(): Promise<Item[]>
  createItem(item: CreateItemRequest): Promise<Item>
  
  // Stock Operations
  addStock(request: StockInRequest): Promise<StockMovement>
  removeStock(request: StockOutRequest): Promise<StockMovement>
  
  // User Management (Admin only)
  getUsers(): Promise<User[]}
  createUser(user: CreateUserRequest): Promise<User>
}
```

### Type Definitions

```typescript
interface Item {
  id: string
  name: string
  sku: string
  unitCost: number
  currentStock: number
  createdAt: string
}

interface StockMovement {
  id: string
  itemId: string
  movementType: 'IN' | 'OUT'
  quantity: number
  note?: string
  createdAt: string
}

interface User {
  id: string
  username: string
  email: string
  roles: string[]
  createdAt: string
}

interface UserSession {
  user: {
    name: string
    email: string
  }
  roles: string[]
  accessToken: string
}
```

## Data Models

### Frontend Data Models

The frontend maintains minimal local state and relies primarily on server-side data. Key data structures include:

#### Item Model
- Represents inventory items with stock information
- Includes computed fields like `currentStock` from backend aggregation
- Used in item listing and form components

#### Stock Movement Model
- Represents individual stock transactions
- Contains movement type (IN/OUT) and quantity
- Used for stock operation forms and history tracking

#### User Model
- Represents system users with role information
- Used in admin user management features
- Includes Keycloak-managed user data

#### Session Model
- Contains authenticated user information and JWT token
- Managed by NextAuth and available throughout the application
- Includes role information for UI conditional rendering

### Data Flow

1. **Authentication Flow**: User → Keycloak → NextAuth → Session Storage
2. **API Request Flow**: Component → API Client → JWT Header → Backend
3. **State Update Flow**: API Response → Component State → UI Re-render
4. **Error Handling Flow**: API Error → Error Component → User Notification

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Authentication Properties

**Property 1: Unauthenticated access redirects to login**
*For any* unauthenticated user attempting to access the application, the system should redirect them to the Keycloak login page
**Validates: Requirements 1.1**

**Property 2: Successful authentication creates session**
*For any* valid authentication response from Keycloak, the system should store the JWT token and create a user session
**Validates: Requirements 1.2**

**Property 3: Role extraction from JWT**
*For any* JWT token containing role information, the system should correctly extract and make roles available throughout the application
**Validates: Requirements 1.3**

**Property 4: Session expiration handling**
*For any* expired user session, the system should automatically redirect to the login page regardless of current page
**Validates: Requirements 1.4**

**Property 5: Logout session cleanup**
*For any* authenticated user performing logout, the system should clear the session and redirect to login
**Validates: Requirements 1.5**

### Inventory Management Properties

**Property 6: Items display with complete information**
*For any* set of items returned from the API, the system should display all items with name, SKU, unit cost, and current stock
**Validates: Requirements 2.1**

**Property 7: Loading state indication**
*For any* API request in progress, the system should display a loading indicator until the request completes
**Validates: Requirements 2.3**

**Property 8: API error handling with retry**
*For any* API error response, the system should display an appropriate error message and provide retry functionality
**Validates: Requirements 2.4**

**Property 9: Focus-based data refresh**
*For any* page displaying data, the system should refresh the data when the page gains focus
**Validates: Requirements 2.5**

### Form Validation Properties

**Property 10: Valid form submission success**
*For any* valid item form data, the system should successfully submit to the API and display success feedback
**Validates: Requirements 3.2**

**Property 11: Invalid form validation**
*For any* invalid form input, the system should display validation errors and prevent submission
**Validates: Requirements 3.3**

**Property 12: Successful creation triggers refresh**
*For any* successful item creation, the system should refresh the items list to include the new item
**Validates: Requirements 3.4**

**Property 13: Form submission error handling**
*For any* failed form submission, the system should display error messages and preserve form data for retry
**Validates: Requirements 3.5**

### Stock Management Properties

**Property 14: Valid stock-in processing**
*For any* valid stock-in form submission, the system should create a stock movement record with type IN
**Validates: Requirements 4.2**

**Property 15: Stock-in validation**
*For any* invalid stock-in input, the system should display validation errors for quantity and item selection
**Validates: Requirements 4.3**

**Property 16: Stock-in success feedback**
*For any* successful stock addition, the system should display confirmation with updated stock level
**Validates: Requirements 4.4**

**Property 17: Stock-in error preservation**
*For any* failed stock-in operation, the system should display error messages and preserve form data
**Validates: Requirements 4.5**

**Property 18: Insufficient stock validation**
*For any* stock-out request exceeding available quantity, the system should prevent the operation and display insufficient stock error
**Validates: Requirements 5.2**

**Property 19: Valid stock-out processing**
*For any* valid stock-out form submission, the system should create a stock movement record with type OUT
**Validates: Requirements 5.3**

**Property 20: Stock-out success feedback**
*For any* successful stock removal, the system should display confirmation with updated stock level
**Validates: Requirements 5.4**

**Property 21: Stock-out error preservation**
*For any* failed stock-out operation, the system should display error messages and preserve form data
**Validates: Requirements 5.5**

### User Management Properties

**Property 22: Admin user list display**
*For any* admin accessing user management, the system should display all users with their roles
**Validates: Requirements 6.1**

**Property 23: Admin user creation**
*For any* valid user data submitted by an admin, the system should create a user with User role by default
**Validates: Requirements 6.3**

**Property 24: Non-admin access control**
*For any* non-admin user attempting to access user management, the system should display access denied message
**Validates: Requirements 6.4**

**Property 25: User creation success handling**
*For any* successful user creation, the system should refresh the user list and display success message
**Validates: Requirements 6.5**

### Navigation Properties

**Property 26: Authenticated user navigation**
*For any* authenticated user, the system should display navigation menu with items, stock-in, and stock-out links
**Validates: Requirements 7.1**

**Property 27: Admin navigation enhancement**
*For any* authenticated admin user, the system should additionally display user management link in navigation
**Validates: Requirements 7.2**

**Property 28: SPA navigation behavior**
*For any* navigation link click, the system should navigate without full page reload
**Validates: Requirements 7.3**

**Property 29: Active page highlighting**
*For any* current page, the system should highlight the corresponding navigation item
**Validates: Requirements 7.4**

**Property 30: Protected route access control**
*For any* protected route accessed without authentication, the system should redirect to login
**Validates: Requirements 7.5**

### API Communication Properties

**Property 31: JWT token inclusion**
*For any* API request, the system should include the JWT token in the Authorization header
**Validates: Requirements 8.1**

**Property 32: 401 response handling**
*For any* API request receiving 401 unauthorized response, the system should redirect to login
**Validates: Requirements 8.2**

**Property 33: 403 response handling**
*For any* API request receiving 403 forbidden response, the system should display access denied message
**Validates: Requirements 8.3**

**Property 34: Network error handling**
*For any* network error during API requests, the system should display error messages and retry options
**Validates: Requirements 8.4**

**Property 35: Successful response processing**
*For any* successful API response, the system should parse data and update UI accordingly
**Validates: Requirements 8.5**

## Error Handling

### Error Categories

1. **Authentication Errors**
   - Session expiration: Automatic redirect to login
   - Invalid credentials: Display Keycloak error messages
   - Token refresh failures: Force re-authentication

2. **API Communication Errors**
   - Network connectivity issues: Display retry options
   - Server errors (5xx): Show generic error with retry
   - Client errors (4xx): Display specific error messages
   - Timeout errors: Provide retry functionality

3. **Validation Errors**
   - Form validation: Real-time field validation with error messages
   - Business rule violations: Server-side validation error display
   - Data integrity issues: Prevent submission with clear feedback

4. **Authorization Errors**
   - Insufficient permissions: Access denied messages
   - Role-based restrictions: Hide unavailable features
   - Resource access denied: Redirect to appropriate page

### Error Handling Strategy

- **User-Friendly Messages**: Convert technical errors to understandable language
- **Retry Mechanisms**: Provide retry options for transient failures
- **Graceful Degradation**: Maintain functionality when possible during errors
- **Error Logging**: Log errors for debugging while protecting user privacy
- **Recovery Paths**: Clear paths for users to recover from error states

## Testing Strategy

### Dual Testing Approach

The application will use both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties that should hold across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Unit Testing

Unit tests will cover:
- Specific component rendering scenarios
- Form validation edge cases
- API integration points
- Authentication flow examples
- Error boundary behavior

### Property-Based Testing

Property-based testing will use **fast-check** library for JavaScript/TypeScript and will be configured to run a minimum of 100 iterations per test. Each property-based test will be tagged with a comment explicitly referencing the correctness property from this design document using the format: **Feature: inventory-frontend, Property {number}: {property_text}**

Property tests will verify:
- Authentication flows work for any valid/invalid credentials
- Form validation works for any input combination
- API error handling works for any error response
- Navigation works from any application state
- Role-based access control works for any user role combination

### Testing Tools

- **Jest**: Primary testing framework
- **React Testing Library**: Component testing utilities
- **fast-check**: Property-based testing library
- **MSW (Mock Service Worker)**: API mocking for tests
- **Playwright**: End-to-end testing for critical user flows

### Test Organization

```
__tests__/
├── components/           # Component unit tests
├── pages/               # Page integration tests
├── properties/          # Property-based tests
├── utils/               # Utility function tests
└── fixtures/            # Test data and mocks
```
