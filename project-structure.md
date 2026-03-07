# Inventory Frontend - Project Structure

This project is a React-based frontend application built with Next.js (App Router), Tailwind CSS v4, and Radix UI. It includes PWA configurations (Workbox) and uses MSW (Mock Service Worker) for simulating API responses.

## Key Directories

- **`src/app/`**: Contains the Next.js routing and page definitions. It is organized by feature domains (e.g., `items`, `warehouses`, `orders`, `stock-in`).
- **`src/components/`**: Reusable UI components.
  - `ui/`: Generic UI elements (likely shadcn/ui primitives).
  - `layout/`: Global structure components like navigation and sidebars.
  - `inventory/`, `admin/`, `auth/`: Domain-specific component features.
- **`src/lib/`**: Core utilities and API configurations.
  - `services/`: Service functions that make API calls (e.g., `itemService.ts`, `stockService.ts`). **This is where you'll ensure your app points to the mock API.**
  - `utils/`: Helper functions and formatters.
- **`src/hooks/`**: Custom React hooks handling state, PWA sync, auth, and data fetching (e.g., `useItems`, `useStock`, `useOnlineStatus`).
- **`src/types/`**: Global TypeScript definitions.
- **`src/__tests__/`**: Unit and integration tests (using Jest and React Testing Library).

## Tech Stack Summary

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4
- **Authentication:** NextAuth.js
- **API & Mocking:** Axios, MSW (Mock Service Worker)
- **Testing:** Jest, React Testing Library

## Development Notes for Mock API

Since you'll be using a mock API and focusing on the frontend:

1.  You will primarily edit files in `src/app/` (pages) and `src/components/` (UI).
2.  Data fetching logic relies on custom hooks in `src/hooks/` that call functions within `src/lib/services/`. Ensure these services are correctly pointing to your mock API endpoints.
3.  If you are using MSW to mock the API, you may need to update the request handlers (usually defined near the MSW setup, potentially inside a `mocks` folder or `src/__tests__`) to match your new frontend scenarios.
