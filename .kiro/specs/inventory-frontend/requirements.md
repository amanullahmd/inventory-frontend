# Requirements Document

## Introduction

This document specifies the requirements for an inventory management system frontend built with Next.js. The system provides role-based access control with Admin and User roles, integrating with Keycloak for authentication and a Spring Boot backend for data management. The frontend enables users to manage inventory items, stock movements, and user administration based on their assigned roles.

## Glossary

- **Inventory_System**: The Next.js frontend application for inventory management
- **Admin**: A user role with full system access including user management and inventory operations
- **User**: A user role with inventory management access only (cannot manage other users)
- **Item**: A product or inventory item with SKU, name, and unit cost
- **Stock_Movement**: A record of inventory changes (IN for additions, OUT for removals)
- **Keycloak**: The external identity provider handling authentication and role management
- **JWT_Token**: JSON Web Token used for authenticated API requests to the backend
- **NextAuth**: The authentication library used for Keycloak integration

## Requirements

### Requirement 1

**User Story:** As a user, I want to authenticate through Keycloak, so that I can securely access the inventory system with my assigned role.

#### Acceptance Criteria

1. WHEN a user visits the application without authentication, THE Inventory_System SHALL redirect them to the Keycloak login page
2. WHEN a user successfully authenticates with Keycloak, THE Inventory_System SHALL receive a JWT_Token and store the user session
3. WHEN authentication is complete, THE Inventory_System SHALL extract user roles from the JWT_Token and make them available throughout the application
4. WHEN a user session expires, THE Inventory_System SHALL automatically redirect to the login page
5. WHEN a user logs out, THE Inventory_System SHALL clear the session and redirect to the login page

### Requirement 2

**User Story:** As a user or admin, I want to view all inventory items with their current stock levels, so that I can understand the current inventory status.

#### Acceptance Criteria

1. WHEN a user accesses the items page, THE Inventory_System SHALL display a list of all items with name, SKU, unit cost, and current stock quantity
2. WHEN the items list is empty, THE Inventory_System SHALL display an appropriate message indicating no items exist
3. WHEN item data is loading, THE Inventory_System SHALL show a loading indicator
4. WHEN an API error occurs while fetching items, THE Inventory_System SHALL display an error message and provide a retry option
5. WHEN the items list is displayed, THE Inventory_System SHALL refresh the data automatically when the page gains focus

### Requirement 3

**User Story:** As a user or admin, I want to create new inventory items, so that I can add products to the system for tracking.

#### Acceptance Criteria

1. WHEN a user clicks the add item button, THE Inventory_System SHALL display a form with fields for name, SKU, and unit cost
2. WHEN a user submits a valid item form, THE Inventory_System SHALL send the data to the backend API and display a success message
3. WHEN a user submits an invalid item form, THE Inventory_System SHALL display validation errors and prevent submission
4. WHEN an item is successfully created, THE Inventory_System SHALL refresh the items list to show the new item
5. WHEN the form submission fails, THE Inventory_System SHALL display an error message and allow the user to retry

### Requirement 4

**User Story:** As a user or admin, I want to add stock to existing items, so that I can record inventory increases.

#### Acceptance Criteria

1. WHEN a user accesses the stock-in page, THE Inventory_System SHALL display a form to select an item and enter quantity to add
2. WHEN a user submits a valid stock-in form, THE Inventory_System SHALL create a stock movement record with type IN
3. WHEN a user enters invalid data, THE Inventory_System SHALL display validation errors for quantity and item selection
4. WHEN stock is successfully added, THE Inventory_System SHALL display a confirmation message with the updated stock level
5. WHEN the stock-in operation fails, THE Inventory_System SHALL display an error message and preserve the form data

### Requirement 5

**User Story:** As a user or admin, I want to remove stock from existing items, so that I can record inventory decreases and sales.

#### Acceptance Criteria

1. WHEN a user accesses the stock-out page, THE Inventory_System SHALL display a form to select an item and enter quantity to remove
2. WHEN a user attempts to remove more stock than available, THE Inventory_System SHALL prevent the operation and display an insufficient stock error
3. WHEN a user submits a valid stock-out form, THE Inventory_System SHALL create a stock movement record with type OUT
4. WHEN stock is successfully removed, THE Inventory_System SHALL display a confirmation message with the updated stock level
5. WHEN the stock-out operation fails, THE Inventory_System SHALL display an error message and preserve the form data

### Requirement 6

**User Story:** As an admin, I want to manage user accounts, so that I can create new users and control system access.

#### Acceptance Criteria

1. WHEN an admin accesses the user management page, THE Inventory_System SHALL display a list of all users with their roles
2. WHEN an admin clicks create user, THE Inventory_System SHALL display a form to enter username, email, and password
3. WHEN an admin creates a new user, THE Inventory_System SHALL assign the User role by default and send the data to Keycloak
4. WHEN a non-admin user attempts to access user management, THE Inventory_System SHALL display an access denied message
5. WHEN user creation is successful, THE Inventory_System SHALL refresh the user list and display a success message

### Requirement 7

**User Story:** As a user, I want to navigate between different sections of the application, so that I can efficiently access all available features.

#### Acceptance Criteria

1. WHEN a user is authenticated, THE Inventory_System SHALL display a navigation menu with links to items, stock-in, and stock-out pages
2. WHEN an admin is authenticated, THE Inventory_System SHALL additionally display a link to user management in the navigation
3. WHEN a user clicks a navigation link, THE Inventory_System SHALL navigate to the corresponding page without full page reload
4. WHEN a user is on a specific page, THE Inventory_System SHALL highlight the current page in the navigation menu
5. WHEN a user accesses a protected route without proper authentication, THE Inventory_System SHALL redirect to the login page

### Requirement 8

**User Story:** As a developer, I want the application to handle API communication securely, so that all backend requests are properly authenticated and authorized.

#### Acceptance Criteria

1. WHEN making API requests, THE Inventory_System SHALL include the JWT_Token in the Authorization header
2. WHEN an API request receives a 401 unauthorized response, THE Inventory_System SHALL redirect the user to login
3. WHEN an API request receives a 403 forbidden response, THE Inventory_System SHALL display an access denied message
4. WHEN network errors occur during API requests, THE Inventory_System SHALL display appropriate error messages and retry options
5. WHEN API responses are successful, THE Inventory_System SHALL parse the data and update the UI accordingly