# Developer Documentation: PWA Implementation

## Overview
This document describes the Progressive Web App (PWA) implementation for the Inventory Management System frontend (Next.js). The implementation enables offline capabilities, asset caching, and app installation support while maintaining secure communication with the Spring Boot backend.

## Tech Stack
- **Frontend Framework**: Next.js 16 (App Router)
- **PWA Plugin**: `next-pwa`
- **Build Tool**: Webpack (required for `next-pwa` compatibility)

## Implementation Details

### 1. Configuration (`next.config.ts`)
The PWA plugin is configured to:
- Generate a service worker at `public/sw.js`
- Auto-register the service worker
- Disable PWA in development mode (to prevent caching issues during coding)
- Use `reactStrictMode: true`

```typescript
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});
```

### 2. Web App Manifest (`public/manifest.json`)
Defines the app's identity and appearance when installed:
- **Name**: Inventory Management System
- **Theme Color**: #000000
- **Display**: Standalone (hides browser UI)
- **Icons**: Uses `public/icons/icon.svg`

### 3. Layout Integration (`src/app/layout.tsx`)
The manifest is linked via Next.js Metadata API:
```typescript
export const metadata: Metadata = {
  // ...
  manifest: "/manifest.json",
};
```

### 4. Build System Update (`package.json`)
Since Next.js 16 defaults to Turbopack (which `next-pwa` does not yet fully support), the build scripts force Webpack usage:
```json
"scripts": {
  "dev": "next dev --webpack",
  "build": "next build --webpack",
  "start": "next start"
}
```

## How to Run

### Development
```bash
pnpm run dev
```
*Note: PWA features (service worker) are disabled in this mode.*

### Production (Test PWA)
To test PWA features like installation and offline support:
```bash
pnpm run build
pnpm run start
```
Then open `http://localhost:3000`. You should see an install icon in the browser address bar.

## Troubleshooting
- **Build Errors**: If you see errors about Turbopack, ensure you are running the scripts defined in `package.json` which include the `--webpack` flag.
- **Icons Not Showing**: Ensure `public/icons/icon.svg` exists.
- **Service Worker Not Updating**: The config uses `skipWaiting: true`, so new versions should take over immediately. If not, try "Update on reload" in DevTools > Application > Service Workers.
