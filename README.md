# Inventory Management System - Frontend

A modern, responsive Next.js web application for inventory management with real-time stock tracking, user authentication, and comprehensive reporting capabilities.

## Overview

The Inventory Frontend is a production-ready React/Next.js application built with TypeScript, Tailwind CSS, and modern web technologies. It provides a seamless user experience for managing inventory, tracking stock movements, and generating detailed reports.

**Live Application**: [https://inventory-frontend.railway.app](https://inventory-frontend.railway.app)  
**Backend API**: [https://inventory-backend.railway.app/api](https://inventory-backend.railway.app/api)

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **NextAuth.js** - Authentication
- **Axios** - HTTP client
- **React Query** - Data fetching & caching
- **Jest & React Testing Library** - Testing
- **ESLint & Prettier** - Code quality

## Features

### Authentication
- User registration and login
- JWT token-based authentication
- Secure password management
- Session persistence
- Role-based access control

### Inventory Management
- View and manage items
- Create new items with categories
- Update item details
- Delete items
- Real-time stock level updates
- Category management

### Stock Movements
- Record stock-in movements
- Record stock-out movements
- Track movement history
- View stock out reasons
- Detailed movement logs

### Reporting & Analytics
- Inventory statistics dashboard
- Stock movement history
- Stock out reason breakdown
- Export reports to PDF
- Date range filtering
- Real-time data visualization

### User Management
- User profile management
- Change password functionality
- View user information
- Admin user management

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Accessible components
- Loading states
- Error handling
- Toast notifications
- Smooth animations

## Prerequisites

- Node.js 18+ or higher
- npm 9+ or yarn 4+
- Git
- Backend API running (see backend README)

## Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amanullahmd/inventory-frontend.git
   cd inventory-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8081/api
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Login with test credentials

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── items/             # Item management
│   │   ├── stock-in/          # Stock in page
│   │   ├── stock-out/         # Stock out page
│   │   ├── stock-movements/   # Movement history
│   │   ├── reports/           # Reports & analytics
│   │   ├── users/             # User management
│   │   ├── settings/          # Settings page
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   └── forms/             # Form components
│   ├── lib/
│   │   ├── api/               # API client
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   └── auth/              # Auth configuration
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── __tests__/             # Test files
├── public/                    # Static assets
├── .env.example               # Environment template
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest configuration
└── package.json               # Dependencies
```

## Key Pages

### Authentication
- `/auth/signin` - Login page
- `/auth/signup` - Registration page
- `/auth/change-password` - Change password

### Inventory
- `/items` - Item list and management
- `/stock-in` - Record stock in
- `/stock-out` - Record stock out
- `/stock-movements` - Movement history

### Reports
- `/reports/statistics` - Inventory statistics
- `/reports/stock-out-reasons` - Stock out analysis

### Admin
- `/users` - User management
- `/settings` - Application settings

## Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api
```

## API Integration

The frontend communicates with the backend API using Axios. API client is configured in `src/lib/api/client.ts`:

```typescript
import { apiClient } from '@/lib/api/client';

// GET request
const items = await apiClient.get('/items');

// POST request
const newItem = await apiClient.post('/items', itemData);

// PUT request
await apiClient.put(`/items/${id}`, updatedData);

// DELETE request
await apiClient.delete(`/items/${id}`);
```

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in secure HTTP-only cookie
4. Token included in all API requests
5. Token refreshed automatically when expired
6. User logged out when token expires

## Testing

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Generate Coverage Report
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test -- pages/items.test.tsx
```

## Code Quality

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Type Check
```bash
npm run type-check
```

## Building & Deployment

### Build Docker Image
```bash
docker build -t inventory-frontend:latest .
docker run -p 3000:3000 inventory-frontend:latest
```

### Deploy to Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway automatically builds and deploys on push

See [RAILWAY_DEPLOYMENT_GUIDE.md](../RAILWAY_DEPLOYMENT_GUIDE.md) for detailed instructions.

## Performance Optimization

### Image Optimization
- Next.js Image component for automatic optimization
- WebP format support
- Responsive images

### Code Splitting
- Automatic code splitting per route
- Dynamic imports for heavy components
- Lazy loading of components

### Caching
- React Query for server state caching
- Browser caching for static assets
- API response caching

### Bundle Size
- Tree shaking of unused code
- Minification of CSS and JavaScript
- Compression of assets

## Security

### Authentication
- JWT tokens with secure expiration
- HTTP-only cookies for token storage
- CSRF protection
- Secure password hashing

### Data Protection
- HTTPS/SSL encryption
- Input validation and sanitization
- XSS prevention
- SQL injection prevention (via API)

### Best Practices
- Environment variables for sensitive data
- No credentials in code
- Regular security updates
- Content Security Policy headers

## Accessibility

- WCAG 2.1 Level AA compliance
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### API Connection Issues
```
Error: Failed to fetch from API
Solution: Verify NEXT_PUBLIC_API_URL is correct and backend is running
```

### Authentication Errors
```
Error: Unauthorized (401)
Solution: Login again, token may have expired
```

### Build Errors
```
Error: TypeScript compilation failed
Solution: Run npm run type-check to see errors
```

### Port Already in Use
```
Error: Port 3000 already in use
Solution: Kill process on port 3000 or use different port
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful variable names
- Add comments for complex logic

### Component Structure
```typescript
// Functional component with TypeScript
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const MyComponent: React.FC<ComponentProps> = ({ title, onSubmit }) => {
  return <div>{title}</div>;
};
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit with clear messages
git commit -m "feat: add new feature"

# Push and create pull request
git push origin feature/your-feature
```

### Commit Message Format
```
feat: add new feature
fix: fix bug
docs: update documentation
refactor: refactor code
test: add tests
style: update styles
chore: update dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Performance Benchmarks

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s
- Lighthouse Score: 90+

## Roadmap

- [ ] Dark mode toggle
- [ ] Advanced filtering and search
- [ ] Bulk import/export
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support & Documentation

- **API Documentation**: [Swagger UI](https://inventory-backend.railway.app/api/swagger-ui.html)
- **Issues**: [GitHub Issues](https://github.com/amanullahmd/inventory-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/amanullahmd/inventory-frontend/discussions)

## Deployment Checklist

Before deploying to production:

- [ ] Update NEXT_PUBLIC_API_URL to production backend
- [ ] Run full test suite
- [ ] Check TypeScript compilation
- [ ] Run ESLint
- [ ] Build production bundle
- [ ] Test all features
- [ ] Verify API connectivity
- [ ] Check responsive design
- [ ] Test authentication flow
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring
- [ ] Configure error tracking

## Contact

**Author**: Amanullah  
**Email**: amanullahmd@gmail.com  
**GitHub**: [@amanullahmd](https://github.com/amanullahmd)

---

**Last Updated**: December 2024  
**Version**: 1.0.0
