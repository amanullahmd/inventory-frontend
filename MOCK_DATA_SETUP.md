# Mock Data Setup - Database Disabled

This application is now configured to run with **mock data only** and **no database connections**.

## Overview

All API calls are intercepted and return dummy data instead of connecting to a backend database. This allows you to:
- Test the entire application without a backend server
- Develop features independently
- Demonstrate functionality with realistic sample data

## Configuration

### Mock API Enabled
- **File**: `src/lib/api/client.ts`
- **Setting**: `USE_MOCK_API = true`
- **Location**: Line 24

To disable mock mode and use real API calls, change this to `false`.

## Mock Data Files

### Data Definitions
- **File**: `src/lib/api/mockData.ts`
- Contains all dummy data for:
  - Categories (5 items)
  - Items (10 products)
  - Warehouses (4 locations)
  - Suppliers (4 companies)
  - Grades (5 employee grades)
  - Employees (5 staff members)
  - Users (2 demo accounts)
  - Stock In Transactions (3 batches)
  - Stock Out Transactions (4 movements)
  - Purchase Orders (3 orders)
  - Sales Orders (2 orders)
  - Stock Transfers (2 transfers)
  - Demands (2 requests)
  - Batches (2 batches)
  - Statistics (dashboard metrics)

### Mock Client Implementation
- **File**: `src/lib/api/mockClient.ts`
- Implements all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Simulates network delay (300ms)
- Handles all API endpoints
- Returns realistic mock responses

## Demo Credentials

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `Admin@123456`
- **Roles**: ROLE_ADMIN, ROLE_USER

### Regular User Account
- **Email**: `user@example.com`
- **Password**: `User@123456`
- **Roles**: ROLE_USER

## Features with Mock Data

All features are fully functional with mock data:

| Feature | Mock Data | Status |
|---------|-----------|--------|
| Dashboard | Statistics, Items | ✅ Working |
| Items Management | 10 sample items, 5 categories | ✅ Working |
| Stock In | 3 transactions with details | ✅ Working |
| Stock Out | 4 transactions with types | ✅ Working |
| Users Management | 2 demo users | ✅ Working |
| Warehouses | 4 locations | ✅ Working |
| Suppliers | 4 suppliers | ✅ Working |
| Employees | 5 employees | ✅ Working |
| Grades | 5 grades | ✅ Working |
| Purchase Orders | 3 orders | ✅ Working |
| Sales Orders | 2 orders | ✅ Working |
| Stock Transfers | 2 transfers | ✅ Working |
| Demands | 2 demands | ✅ Working |
| Batches | 2 batches | ✅ Working |

## How It Works

1. **Request Interception**: All API calls go through `src/lib/api/client.ts`
2. **Mock Check**: If `USE_MOCK_API = true`, requests are routed to `mockApiClient`
3. **Mock Response**: `src/lib/api/mockClient.ts` returns appropriate dummy data
4. **Network Simulation**: 300ms delay simulates real network latency
5. **No Backend Required**: No database or backend server needed

## API Endpoints Mocked

### Items
- `GET /items` - Returns 10 sample items
- `POST /items` - Creates new item (mock)
- `PUT /items/{id}` - Updates item (mock)
- `GET /items/statistics` - Returns dashboard stats

### Categories
- `GET /categories` - Returns 5 categories
- `POST /categories` - Creates category (mock)
- `PUT /categories/{id}` - Updates category (mock)

### Warehouses
- `GET /warehouses` - Returns 4 warehouses
- `POST /warehouses` - Creates warehouse (mock)
- `PUT /warehouses/{id}` - Updates warehouse (mock)

### Suppliers
- `GET /suppliers` - Returns 4 suppliers
- `POST /suppliers` - Creates supplier (mock)
- `PUT /suppliers/{id}` - Updates supplier (mock)

### Employees
- `GET /employees` - Returns 5 employees
- `POST /employees` - Creates employee (mock)
- `PUT /employees/{id}` - Updates employee (mock)

### Users
- `GET /users` - Returns 2 demo users
- `POST /users` - Creates user (mock)
- `PUT /users/{id}` - Updates user (mock)

### Stock Management
- `GET /stock/in/grouped` - Returns stock-in transactions
- `GET /stock/in/{ref}` - Returns stock-in details
- `POST /stock/in/batch` - Creates stock-in (mock)
- `PUT /stock/in/{ref}` - Updates stock-in (mock)
- `DELETE /stock/in/{ref}` - Deletes stock-in (mock)
- `GET /stock-outs` - Returns stock-out transactions
- `POST /stock-outs/batch` - Creates stock-out (mock)
- `DELETE /stock-outs/{id}` - Deletes stock-out (mock)

### Orders & Transfers
- `GET /purchase-orders` - Returns 3 purchase orders
- `POST /purchase-orders` - Creates PO (mock)
- `GET /sales-orders` - Returns 2 sales orders
- `POST /sales-orders` - Creates SO (mock)
- `GET /stock-transfers` - Returns 2 transfers
- `POST /stock-transfers` - Creates transfer (mock)

### Other
- `GET /grades` - Returns 5 grades
- `GET /demands` - Returns 2 demands
- `POST /demands` - Creates demand (mock)
- `GET /batches` - Returns 2 batches
- `POST /batches` - Creates batch (mock)

## Switching to Real Backend

To use a real backend database:

1. **Disable Mock Mode**:
   ```typescript
   // src/lib/api/client.ts
   const USE_MOCK_API = false;
   ```

2. **Set Backend URL**:
   ```bash
   NEXT_PUBLIC_API_URL=http://your-backend-url/api
   ```

3. **Restart Server**:
   ```bash
   npm run dev
   ```

## Adding More Mock Data

To add more mock data:

1. **Edit** `src/lib/api/mockData.ts`
2. **Add** new data arrays (e.g., `MOCK_NEW_FEATURE`)
3. **Update** `src/lib/api/mockClient.ts` to handle new endpoints
4. **Test** the new data in the application

## Performance Notes

- Mock API calls have a 300ms simulated delay
- No actual network requests are made
- All data is in-memory (resets on page refresh)
- Perfect for development and testing

## Troubleshooting

### Data Not Showing
- Check browser console for errors
- Verify `USE_MOCK_API = true` in `src/lib/api/client.ts`
- Clear browser cache and refresh

### Need Real Backend
- Change `USE_MOCK_API = false`
- Ensure backend server is running
- Check `NEXT_PUBLIC_API_URL` environment variable

### Want to Modify Mock Data
- Edit `src/lib/api/mockData.ts`
- Restart the development server
- Changes will be reflected immediately

## Next Steps

1. **Test Features**: Log in and explore all features
2. **Modify Data**: Edit mock data to test different scenarios
3. **Add Backend**: When ready, switch to real backend
4. **Deploy**: Application works with or without mock mode

---

**Status**: ✅ Mock data fully configured and running
**Backend**: ❌ Disabled (no database connections)
**Demo Accounts**: ✅ Ready to use
