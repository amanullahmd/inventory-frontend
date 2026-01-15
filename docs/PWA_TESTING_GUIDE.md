# PWA Testing Guide

This guide covers how to test the Progressive Web App (PWA) features of the Inventory Management System.

## Prerequisites

- Chrome, Edge, or Firefox browser (latest version)
- Access to browser DevTools
- The application running locally or deployed

## 1. Lighthouse PWA Audit

### Running the Audit

1. Open the application in Chrome
2. Open DevTools (F12 or Ctrl+Shift+I)
3. Go to the "Lighthouse" tab
4. Select categories:
   - ✅ Progressive Web App
   - ✅ Performance (optional)
   - ✅ Best Practices (optional)
5. Click "Analyze page load"

### Expected Results

- PWA Score: 90+ (target)
- Installable: Yes
- PWA Optimized: Yes

### Common Issues

| Issue | Solution |
|-------|----------|
| "Does not register a service worker" | Check SW registration in Application tab |
| "Web app manifest does not meet installability requirements" | Verify manifest.json has all required fields |
| "Does not redirect HTTP traffic to HTTPS" | Ensure HTTPS in production |
| "Does not provide a valid apple-touch-icon" | Check /icons/apple-touch-icon.svg exists |

## 2. Service Worker Testing

### Verify Registration

1. Open DevTools > Application > Service Workers
2. Check that the service worker is:
   - Registered
   - Status: "activated and is running"
   - Source: sw.js

### Test Update Flow

1. Enable "Update on reload" checkbox
2. Make a change to sw.js (e.g., update CACHE_VERSION)
3. Reload the page
4. Verify new SW is installed

### Test Skip Waiting

1. Disable "Update on reload"
2. Deploy a new SW version
3. Reload the page
4. Check for "waiting" SW in DevTools
5. Click "skipWaiting" or use the update notification

## 3. Offline Testing

### Basic Offline Test

1. Open DevTools > Network tab
2. Check the "Offline" checkbox
3. Navigate to different pages:
   - Dashboard: Should show cached stats
   - Items: Should show cached list
   - Stock Movements: Should show cached history
4. Verify offline indicator appears

### Offline Fallback Test

1. Go offline (Network > Offline)
2. Navigate to a page you haven't visited
3. Should see the offline fallback page
4. Click "Try Again" when back online

### Cache Verification

1. Open DevTools > Application > Cache Storage
2. Verify caches exist:
   - `inventory-static-v1`
   - `inventory-api-v1`
   - `inventory-images-v1`
   - `inventory-dynamic-v1`
3. Check cached resources in each cache

## 4. Offline Queue Testing

### Queue Write Operations

1. Go offline
2. Try to create a new item
3. Verify:
   - Operation is queued (check SyncStatus component)
   - User sees "queued" feedback
   - No error is thrown

### Sync When Online

1. With queued operations, go back online
2. Verify:
   - Sync starts automatically
   - SyncStatus shows progress
   - Operations complete successfully

### Manual Sync

1. Queue some operations while offline
2. Go online
3. Click "Sync Now" in SyncStatus
4. Verify operations sync

### Retry Failed Operations

1. Queue operations that will fail (e.g., invalid data)
2. Go online and let sync attempt
3. Verify failed operations are marked
4. Click "Retry Failed"
5. Verify retry attempt

## 5. Install Prompt Testing

### Trigger Install Prompt

1. Clear site data (DevTools > Application > Clear storage)
2. Reload the page
3. Interact with the app (click, scroll)
4. Wait for install prompt (after delay)
5. Verify prompt appears

### Test Dismissal

1. Trigger install prompt
2. Click "Maybe Later"
3. Verify prompt doesn't reappear immediately
4. Check localStorage for dismissal timestamp

### Test Installation

1. Trigger install prompt
2. Click "Install"
3. Complete browser installation dialog
4. Verify:
   - App opens in standalone window
   - Install prompt no longer appears
   - App icon on desktop/home screen

## 6. Update Notification Testing

### Trigger Update

1. Deploy a new version (update CACHE_VERSION in sw.js)
2. Reload the page
3. Wait for update notification
4. Verify notification appears

### Accept Update

1. Click "Update Now" on notification
2. Verify page reloads
3. Verify new version is active

### Dismiss Update

1. Click dismiss on notification
2. Verify notification disappears
3. Verify update is still available (check SW in DevTools)

## 7. Cross-Platform Testing

### Desktop Browsers

| Browser | Install | Offline | Sync |
|---------|---------|---------|------|
| Chrome | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Firefox | ⚠️ Limited | ✅ | ✅ |
| Safari | ❌ | ✅ | ✅ |

### Mobile Devices

#### Android (Chrome)
1. Open app in Chrome
2. Look for "Add to Home Screen" banner
3. Or use menu > "Install app"
4. Test offline functionality
5. Test background sync

#### iOS (Safari)
1. Open app in Safari
2. Tap Share > "Add to Home Screen"
3. Test offline functionality
4. Note: Background sync not supported

### Testing Checklist

- [ ] Lighthouse PWA score 90+
- [ ] Service worker registers correctly
- [ ] Manifest is valid
- [ ] App is installable
- [ ] Offline indicator works
- [ ] Cached pages load offline
- [ ] Offline fallback page works
- [ ] Write operations queue offline
- [ ] Sync works when online
- [ ] Install prompt appears
- [ ] Install prompt dismissal persists
- [ ] Update notification works
- [ ] Update applies correctly
- [ ] Works on Chrome desktop
- [ ] Works on Edge desktop
- [ ] Works on Android Chrome
- [ ] Works on iOS Safari

## 8. Debugging Tips

### Service Worker Issues

```javascript
// Check SW registration
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW Registration:', reg);
});

// Force SW update
navigator.serviceWorker.getRegistration().then(reg => {
  reg.update();
});

// Unregister SW (for testing)
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
```

### Cache Issues

```javascript
// List all caches
caches.keys().then(names => console.log('Caches:', names));

// Clear specific cache
caches.delete('inventory-api-v1');

// Clear all caches
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

### IndexedDB Issues

```javascript
// Check offline queue
indexedDB.databases().then(dbs => console.log('Databases:', dbs));

// Clear IndexedDB (for testing)
indexedDB.deleteDatabase('keyval-store');
```

## 9. Performance Testing

### Metrics to Monitor

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cache hit rate: > 80%

### Tools

- Chrome DevTools Performance tab
- Lighthouse Performance audit
- WebPageTest.org
- Chrome User Experience Report

## 10. Automated Testing

### Jest Tests

```bash
# Run PWA property tests
npm test -- --testPathPattern=properties/pwa

# Run all PWA tests
npm test -- --testPathPattern=pwa
```

### Test Files

- `src/__tests__/properties/pwa.properties.test.ts`
- `src/__tests__/properties/cache.properties.test.ts`
- `src/__tests__/properties/install.properties.test.ts`
- `src/__tests__/properties/offline-queue.properties.test.ts`
- `src/__tests__/properties/auth-security.properties.test.ts`
- `src/__tests__/properties/update-flow.properties.test.ts`
- `src/__tests__/properties/app-shell.properties.test.ts`
- `src/__tests__/unit/manifest.test.ts`
- `src/__tests__/unit/pwa-components.test.tsx`
- `src/__tests__/unit/dashboard-offline.test.tsx`

---

Last Updated: January 2026
