/**
 * PWA Icon Generator Script
 * 
 * This script generates placeholder PNG icons from the SVG source.
 * For production, replace with actual designed icons.
 * 
 * To generate real icons, you can use tools like:
 * - sharp (npm install sharp)
 * - Inkscape CLI
 * - Online PWA icon generators
 * 
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../public/icons');

// Icon sizes needed for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const MASKABLE_SIZES = [192, 512];
const SHORTCUT_SIZE = 96;

// Ensure icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Generate a simple SVG placeholder for each size
function generatePlaceholderSVG(size, text = 'INV') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.125}" fill="url(#bg)"/>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
}

// Generate maskable icon SVG (with safe zone padding)
function generateMaskableSVG(size) {
  const padding = size * 0.1; // 10% safe zone
  const innerSize = size - (padding * 2);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${innerSize * 0.35}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">INV</text>
</svg>`;
}

// Generate shortcut icon SVG
function generateShortcutSVG(size, icon) {
  const icons = {
    dashboard: '📊',
    items: '📦',
    'stock-in': '📥',
    'stock-out': '📤',
  };
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.125}" fill="url(#bg)"/>
  <text x="50%" y="55%" font-size="${size * 0.5}" text-anchor="middle" dominant-baseline="middle">${icons[icon] || '📦'}</text>
</svg>`;
}

console.log('Generating PWA icons...');

// Generate regular icons
ICON_SIZES.forEach(size => {
  const svg = generatePlaceholderSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(ICONS_DIR, filename), svg);
  console.log(`Created ${filename}`);
});

// Generate maskable icons
MASKABLE_SIZES.forEach(size => {
  const svg = generateMaskableSVG(size);
  const filename = `icon-maskable-${size}x${size}.svg`;
  fs.writeFileSync(path.join(ICONS_DIR, filename), svg);
  console.log(`Created ${filename}`);
});

// Generate shortcut icons
['dashboard', 'items', 'stock-in', 'stock-out'].forEach(shortcut => {
  const svg = generateShortcutSVG(SHORTCUT_SIZE, shortcut);
  const filename = `shortcut-${shortcut}.svg`;
  fs.writeFileSync(path.join(ICONS_DIR, filename), svg);
  console.log(`Created ${filename}`);
});

// Generate apple-touch-icon
const appleTouchIcon = generatePlaceholderSVG(180);
fs.writeFileSync(path.join(ICONS_DIR, 'apple-touch-icon.svg'), appleTouchIcon);
console.log('Created apple-touch-icon.svg');

console.log('\\nIcon generation complete!');
console.log('\\nNote: These are SVG placeholders. For production:');
console.log('1. Design proper icons in your preferred tool');
console.log('2. Export as PNG in all required sizes');
console.log('3. Replace the SVG files with PNG files');
console.log('4. Update manifest.json if using different file extensions');
