# Quick Start Guide

## 🚀 Get Started in 30 Seconds

### 1. Server Already Running
The development server is running on: **http://localhost:3000**

### 2. Login
Use these demo credentials:

**Admin:**
```
Email: admin@example.com
Password: Admin@123456
```

**User:**
```
Email: user@example.com
Password: User@123456
```

### 3. Explore
- Dashboard: View inventory statistics
- Items: Browse 10 sample products
- Stock In/Out: View mock transactions
- Users: Manage 2 demo users
- Warehouses: See 4 locations
- Suppliers: View 4 suppliers
- Employees: See 5 employees
- And more...

## 📊 What's Available

### Mock Data Ready
- ✅ 10 Items with categories
- ✅ 4 Warehouses
- ✅ 4 Suppliers
- ✅ 5 Employees
- ✅ Stock transactions
- ✅ Purchase orders
- ✅ Sales orders
- ✅ And more...

### All Features Working
- ✅ Create/Read/Update/Delete
- ✅ Search and filter
- ✅ Forms and validation
- ✅ Error handling
- ✅ Loading states
- ✅ Offline support

## 🔧 Configuration

### Mock Mode Status
**Currently**: ✅ ENABLED (no backend needed)

**File**: `src/lib/api/client.ts` (line 24)
```typescript
const USE_MOCK_API = true;
```

### To Use Real Backend
1. Change `USE_MOCK_API = false`
2. Set `NEXT_PUBLIC_API_URL` in `.env.local`
3. Restart server: `npm run dev`

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/api/mockData.ts` | All mock data definitions |
| `src/lib/api/mockClient.ts` | Mock API implementation |
| `src/lib/api/client.ts` | Main API client (routes to mock) |
| `src/lib/auth/config.ts` | Demo authentication |

## 🎯 Common Tasks

### View Mock Data
Edit: `src/lib/api/mockData.ts`

### Add New Mock Data
1. Add to `mockData.ts`
2. Update `mockClient.ts` endpoint handler
3. Restart server

### Switch to Real Backend
1. Set `USE_MOCK_API = false` in `client.ts`
2. Configure backend URL
3. Restart server

### Test Different Scenarios
Modify mock data in `mockData.ts` to test:
- Low stock items
- Out of stock items
- Different warehouse scenarios
- Various employee roles

## 🌐 URLs

| Page | URL |
|------|-----|
| Dashboard | http://localhost:3000 |
| Items | http://localhost:3000/items |
| Stock In | http://localhost:3000/stock-in |
| Stock Out | http://localhost:3000/stock-out |
| Users | http://localhost:3000/users |
| Warehouses | http://localhost:3000/warehouses |
| Suppliers | http://localhost:3000/suppliers |
| Employees | http://localhost:3000/employees |
| Grades | http://localhost:3000/grades |
| Orders (Purchase) | http://localhost:3000/orders/purchase |
| Orders (Sales) | http://localhost:3000/orders/sales |
| Transfers | http://localhost:3000/transfers |
| Demands | http://localhost:3000/demand |
| Settings | http://localhost:3000/settings |

## 💡 Tips

1. **No Backend Needed** - Everything works with mock data
2. **Fast Development** - No database setup required
3. **Realistic Data** - Mock data simulates real scenarios
4. **Easy to Modify** - Change mock data in one file
5. **Easy to Switch** - One flag to enable real backend

## ❓ FAQ

**Q: Do I need a backend server?**
A: No! Mock mode is enabled. Everything works with dummy data.

**Q: Can I modify the mock data?**
A: Yes! Edit `src/lib/api/mockData.ts` and restart the server.

**Q: How do I use a real backend?**
A: Set `USE_MOCK_API = false` and configure the backend URL.

**Q: Will data persist?**
A: No, mock data resets on page refresh. Use real backend for persistence.

**Q: Can I test all features?**
A: Yes! All features work with mock data.

## 🚀 Next Steps

1. ✅ Log in with demo credentials
2. ✅ Explore all pages
3. ✅ Test create/edit/delete operations
4. ✅ Modify mock data as needed
5. ✅ When ready, switch to real backend

---

**Status**: 🟢 Ready to Use
**Backend**: 🔴 Mock Mode (No Database)
**Demo Accounts**: 🟢 Ready
