# Implementation Plan

- [x] 1. Set up Next.js project structure and dependencies





  - Initialize Next.js 16.0.7 project with TypeScript support
  - Install required dependencies: NextAuth, Axios, fast-check for testing
  - Configure project structure with app router, components, lib directories
  - Set up environment variables for Keycloak and API configuration
  - _Requirements: 1.1, 8.1_

- [x] 2. Implement authentication system with auth2 and Keycloak




  - [x] 2.1 Configure NextAuth with Keycloak provider


    - Create auth2 configuration with Keycloak provider setup
    - Implement JWT and session callbacks for role extraction
    - Configure environment variables for Keycloak integration
    - _Requirements: 1.2, 1.3_

  - [x] 2.2 Write property test for authentication flow


    - **Property 2: Successful authentication creates session**
    - **Validates: Requirements 1.2**

  - [x] 2.3 Create authentication middleware for route protection


    - Implement middleware to protect routes based on authentication status
    - Add redirect logic for unauthenticated users
    - _Requirements: 1.1, 7.5_

  - [x] 2.4 Write property test for route protection


    - **Property 1: Unauthenticated access redirects to login**
    - **Validates: Requirements 1.1**

  - [x] 2.5 Write property test for role extraction


    - **Property 3: Role extraction from JWT**
    - **Validates: Requirements 1.3**

- [x] 3. Create API client and communication layer


  - [x] 3.1 Implement API client with JWT token management


    - Create Axios-based API client with automatic JWT token inclusion
    - Implement request/response interceptors for error handling
    - Add retry logic for network failures
    - _Requirements: 8.1, 8.4_

  - [x] 3.2 Implement API error handling and response processing


    - Add 401/403 error handling with appropriate redirects
    - Create error message parsing and display logic
    - Implement success response processing
    - _Requirements: 8.2, 8.3, 8.5_

  - [x] 3.3 Write property test for JWT token inclusion



    - **Property 31: JWT token inclusion**
    - **Validates: Requirements 8.1**


  - [x] 3.4 Write property test for API error handling


    - **Property 32: 401 response handling**
    - **Validates: Requirements 8.2**

  - [x] 3.5 Write property test for network error handling



    - **Property 34: Network error handling**
    - **Validates: Requirements 8.4**

- [x] 4. Build core layout and navigation components


  - [x] 4.1 Create main layout component with navigation


    - Implement responsive layout with header and navigation menu
    - Add role-based navigation item visibility
    - Create active page highlighting functionality
    - _Requirements: 7.1, 7.2, 7.4_

  - [x] 4.2 Implement navigation behavior and routing

    - Add SPA navigation without full page reloads
    - Implement protected route access control
    - Create logout functionality with session cleanup
    - _Requirements: 7.3, 7.5, 1.5_

  - [x] 4.3 Write property test for navigation display

    - **Property 26: Authenticated user navigation**
    - **Validates: Requirements 7.1**

  - [x] 4.4 Write property test for admin navigation

    - **Property 27: Admin navigation enhancement**
    - **Validates: Requirements 7.2**

  - [x] 4.5 Write property test for SPA navigation

    - **Property 28: SPA navigation behavior**
    - **Validates: Requirements 7.3**

- [ ] 5. Implement inventory items management
  - [x] 5.1 Create items listing page and component

    - Build ItemTable component to display items with stock levels
    - Implement loading states and empty state handling
    - Add automatic data refresh on page focus
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 5.2 Create item creation form and functionality

    - Build ItemForm component with validation
    - Implement form submission with success/error handling
    - Add automatic list refresh after successful creation
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 5.3 Implement form validation and error handling

    - Add client-side validation for item form fields
    - Implement validation error display and prevention of invalid submissions
    - Create error handling for failed form submissions with data preservation
    - _Requirements: 3.3, 3.5_

  - [x] 5.4 Write property test for items display

    - **Property 6: Items display with complete information**
    - **Validates: Requirements 2.1**

  - [x] 5.5 Write property test for form validation

    - **Property 11: Invalid form validation**
    - **Validates: Requirements 3.3**

  - [x] 5.6 Write property test for successful form submission


    - **Property 10: Valid form submission success**
    - **Validates: Requirements 3.2**

- [x] 6. Implement stock management functionality





  - [x] 6.1 Create stock-in page and form component


    - Build StockInForm component with item selection and quantity input
    - Implement form validation and submission logic
    - Add success feedback with updated stock levels
    - _Requirements: 4.1, 4.2, 4.4_

  - [x] 6.2 Create stock-out page and form component


    - Build StockOutForm component with item selection and quantity input
    - Implement insufficient stock validation and prevention
    - Add success feedback with updated stock levels
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 6.3 Implement stock operation validation and error handling

    - Add validation for stock quantities and item selection
    - Implement error handling with form data preservation
    - Create insufficient stock error messaging
    - _Requirements: 4.3, 4.5, 5.2, 5.5_

  - [x] 6.4 Write property test for stock-in processing


    - **Property 14: Valid stock-in processing**
    - **Validates: Requirements 4.2**

  - [x] 6.5 Write property test for insufficient stock validation

    - **Property 18: Insufficient stock validation**
    - **Validates: Requirements 5.2**


  - [x] 6.6 Write property test for stock-out processing




    - **Property 19: Valid stock-out processing**
    - **Validates: Requirements 5.3**

- [x] 7. Implement admin user management features





  - [x] 7.1 Create user management page with role-based access


    - Build UserTable component to display users and roles
    - Implement access control to restrict to admin users only
    - Add non-admin access denied messaging
    - _Requirements: 6.1, 6.4_


  - [x] 7.2 Create user creation form and functionality

    - Build UserForm component for creating new users
    - Implement user creation with default User role assignment
    - Add success handling with user list refresh
    - _Requirements: 6.2, 6.3, 6.5_

  - [x] 7.3 Write property test for admin access control


    - **Property 24: Non-admin access control**
    - **Validates: Requirements 6.4**

  - [x] 7.4 Write property test for user creation


    - **Property 23: Admin user creation**
    - **Validates: Requirements 6.3**


- [x] 8. Add utility components and error handling




  - [x] 8.1 Create reusable UI components


    - Build LoadingSpinner component for loading states
    - Create ErrorMessage and SuccessMessage components
    - Implement consistent styling and behavior
    - _Requirements: 2.3, 2.4_

  - [x] 8.2 Implement comprehensive error handling


    - Add session expiration detection and handling
    - Create global error boundaries for unhandled errors
    - Implement retry mechanisms for failed operations
    - _Requirements: 1.4, 8.2, 8.4_

  - [x] 8.3 Write property test for session expiration


    - **Property 4: Session expiration handling**
    - **Validates: Requirements 1.4**

  - [x] 8.4 Write property test for loading states


    - **Property 7: Loading state indication**
    - **Validates: Requirements 2.3**

- [x] 9. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Add styling and responsive design





  - [x] 10.1 Implement responsive CSS styling


    - Add Tailwind CSS or styled-components for styling
    - Create responsive layouts for mobile and desktop
    - Implement consistent design system and theming
    - _Requirements: 7.1, 7.4_


  - [x] 10.2 Enhance user experience with animations and feedback

    - Add loading animations and transitions
    - Implement success/error message animations
    - Create smooth navigation transitions
    - _Requirements: 2.3, 3.4, 4.4_

- [x] 11. Final integration and testing





  - [x] 11.1 Integration testing with mock backend


    - Set up MSW for API mocking in tests
    - Create integration tests for complete user flows
    - Test role-based access control scenarios
    - _Requirements: 1.1, 6.4, 7.5_


  - [x] 11.2 Write comprehensive property tests for remaining properties

    - **Property 8: API error handling with retry**
    - **Property 9: Focus-based data refresh**
    - **Property 12: Successful creation triggers refresh**
    - **Validates: Requirements 2.4, 2.5, 3.4**

- [x] 12. Final Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.