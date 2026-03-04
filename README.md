# DPE Inventory Management System

> Enterprise-grade inventory management system for the Directorate of Primary Education (DPE), Bangladesh

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Overview

A production-ready Progressive Web Application (PWA) built with Next.js 16, React 19, and TypeScript. Features real-time stock tracking, multi-warehouse management, supply chain operations, and comprehensive reporting with full offline support.

### Key Features

- 📦 Multi-warehouse inventory tracking
- 📊 Real-time analytics and reporting
- 🔄 Stock in/out operations with batch processing
- 👥 User management with role-based access
- 📱 Progressive Web App with offline support
- 🌙 Dark mode support
- ♿ WCAG 2.1 Level AA accessibility
- 🧪 Property-based testing with Fast-check

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16, React 19.2, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Radix UI, Lucide Icons |
| **State** | NextAuth.js 5, Axios, IDB-Keyval |
| **Testing** | Jest 30, React Testing Library, Fast-check |
| **PWA** | Workbox 7, Service Workers |

## Quick Start

### Prerequisites

- Node.js 18.0+
- npm 9.0+ or yarn 4+

### Installation

```bash
# Clone repository
git clone https://github.com/amanullahmd/inventory-frontend.git
cd inventory-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Demo Credentials

```
Admin:
  Email: admin@example.com
  Password: Admin@123456

User:
  Email: user@example.com
  Password: User@123456
```

## Environment Configuration

Create `.env.local` in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8081/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Mock API Mode

Develop without a backend server using the built-in mock API.

**Enable Mock Mode:**

Edit `src/lib/api/client.ts`:
```typescript
const USE_MOCK_API = true;  // Set to false for real backend
```

**Mock Data Includes:**
- 10 Items with categories
- 4 Warehouses
- 4 Suppliers
- 5 Employees
- Stock transactions, orders, and reports

**Customize Mock Data:**

Edit `src/lib/api/mockData.ts` and restart the server.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── items/             # Item management
│   ├── stock-in/          # Stock in operations
│   ├── stock-out/         # Stock out operations
│   ├── reports/           # Analytics & reports
│   └── ...                # Other feature pages
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── pwa/               # PWA components
├── lib/
│   ├── api/               # API client & mock data
│   ├── auth/              # Authentication config
│   └── design-system/     # Design tokens
├── contexts/              # React contexts
└── __tests__/             # Test suites
```

## Core Features

### Inventory Management
- Items with SKU tracking
- Hierarchical categories
- Multi-warehouse support
- Batch tracking with expiry dates
- Real-time stock levels

### Stock Operations
- Stock in with batch operations
- Stock out with reason codes
- Inter-warehouse transfers
- Complete audit trail
- Demand management

### Supply Chain
- Supplier management
- Purchase orders
- Sales orders
- Employee management
- Grade assignments

### Reporting
- Real-time dashboard
- Inventory statistics
- Stock out analysis
- Most used items
- PDF export

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Items
- `GET /items` - List all items
- `POST /items` - Create item
- `PUT /items/{id}` - Update item
- `DELETE /items/{id}` - Delete item
- `GET /items/statistics` - Get statistics

### Stock Operations
- `POST /stock/in/batch` - Batch stock in
- `POST /stock/out/batch` - Batch stock out
- `GET /stock/in/grouped` - Get stock in transactions
- `GET /stock/out` - Get stock out transactions

### Reports
- `GET /reports/stock-out-reasons` - Stock out analysis
- `GET /reports/stock-movements` - Movement history

[View complete API documentation](#api-endpoints)

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: `src/__tests__/unit/`
- **Component Tests**: `src/components/ui/__tests__/`
- **Property Tests**: `src/__tests__/properties/`

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
# Build image
docker build -t dpe-inventory:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com/api \
  dpe-inventory:latest
```

### Platforms

- **Vercel**: Connect GitHub repo and deploy
- **Railway**: Auto-deploy on push
- **Traditional Server**: Use PM2 or systemd

## Progressive Web App

### Installation

**Desktop**: Click install icon in address bar
**Android**: Tap "Add to Home Screen"
**iOS**: Share → "Add to Home Screen"

### Offline Support

| Feature | Offline | Sync |
|---------|---------|------|
| Dashboard | ✅ Cached | Auto |
| Items | ✅ Cached | Auto |
| Stock In/Out | ⏳ Queued | Auto |
| Reports | ✅ Cached | Auto |

## Performance

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: 90+

## Security

- JWT token authentication
- HTTP-only cookies
- CSRF protection
- Input validation
- XSS prevention
- HTTPS/TLS encryption

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## Troubleshooting

### API Connection Failed
```bash
# Check environment variables
cat .env.local

# Enable mock mode
# Edit src/lib/api/client.ts: USE_MOCK_API = true
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Commit Convention

```
feat: add new feature
fix: fix bug
docs: update documentation
refactor: refactor code
test: add tests
style: update styles
chore: update dependencies
```

## Roadmap

### Completed ✅
- Progressive Web App
- Mock API mode
- Design system
- Offline support
- Multi-warehouse tracking

### In Progress 🚧
- Multi-language support (i18n)
- UI/UX modernization
- Advanced analytics

### Planned 📋
- Real-time notifications
- Bulk import/export
- Barcode scanning
- Mobile app (React Native)
- GraphQL API

## Documentation

- [PWA Testing Guide](docs/PWA_TESTING_GUIDE.md)
- [Design System](src/lib/design-system/README.md)
- [Feature Specs](.kiro/specs/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Organization**: Directorate of Primary Education (DPE), Bangladesh  
**Developer**: Amanullah  
**Email**: amanullahmd@gmail.com  
**GitHub**: [@amanullahmd](https://github.com/amanullahmd)

---

**Built with ❤️ for the Directorate of Primary Education, Bangladesh**
