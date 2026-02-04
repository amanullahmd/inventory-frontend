# Design System Documentation

## Overview

The DPE Inventory Management System uses a comprehensive design system built on modern design principles. This system provides a cohesive set of design tokens, components, and patterns that ensure consistency across the entire application.

## Design System Structure

```
Design System
├── Configuration (config.ts)
│   ├── Color Palettes (Light & Dark)
│   ├── Typography System
│   ├── Spacing System
│   ├── Effects System
│   └── Responsive Breakpoints
├── Theme Context (ThemeContext.tsx)
│   ├── Theme Provider
│   ├── Theme Switching
│   └── Persistence
├── Utilities (utils.ts)
│   ├── Color Validation
│   ├── Spacing Validation
│   ├── Typography Helpers
│   └── Contrast Ratio Calculation
└── CSS Variables (globals.css)
    ├── Light Mode Variables
    ├── Dark Mode Variables
    └── Legacy Variables
```

## Color System

### Light Mode Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #3B82F6 | Main brand color, primary buttons, links |
| Secondary | #8B5CF6 | Secondary actions, accents |
| Accent | #EC4899 | Highlights, special emphasis |
| Success | #10B981 | Success states, positive feedback |
| Warning | #F59E0B | Warning states, caution messages |
| Error | #EF4444 | Error states, destructive actions |
| Neutral | #F3F4F6 | Backgrounds, surfaces |
| Text | #1F2937 | Primary text color |

### Dark Mode Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #60A5FA | Main brand color (lighter) |
| Secondary | #A78BFA | Secondary actions (lighter) |
| Accent | #F472B6 | Highlights (lighter) |
| Success | #34D399 | Success states (lighter) |
| Warning | #FBBF24 | Warning states (lighter) |
| Error | #F87171 | Error states (lighter) |
| Neutral | #1F2937 | Backgrounds (darker) |
| Text | #F3F4F6 | Primary text (lighter) |

### Accessing Colors

```typescript
import { colorPalettes } from '@/lib/design-system/config';

// Get light mode colors
const lightColors = colorPalettes.light;
console.log(lightColors.primary); // #3B82F6

// Get dark mode colors
const darkColors = colorPalettes.dark;
console.log(darkColors.primary); // #60A5FA
```

## Typography System

### Font Family

- **Primary**: Inter (modern, clean, professional)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Sizes and Weights

| Level | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| H1 | 32px | 700 | 1.2 | 0.25px |
| H2 | 24px | 600 | 1.2 | 0.25px |
| H3 | 20px | 600 | 1.3 | 0.25px |
| H4 | 16px | 600 | 1.4 | 0.25px |
| Body | 14px | 400 | 1.5 | 0.5px |
| Small | 12px | 400 | 1.4 | 0.5px |

### Using Typography

```typescript
import { typography } from '@/lib/design-system/config';
import { getTypographyStyles } from '@/lib/design-system/utils';

// Get typography configuration
const h1Config = typography.sizes.h1;
console.log(h1Config.fontSize); // 32px

// Get typography as CSS object
const bodyStyles = getTypographyStyles('body');
// { fontSize: '14px', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.5px' }
```

### CSS Variables

Typography is also available as CSS variables:

```css
/* Headings */
font-size: var(--typography-h1-size);
font-weight: var(--typography-h1-weight);
line-height: var(--typography-h1-line-height);
letter-spacing: var(--typography-h1-letter-spacing);

/* Body text */
font-size: var(--typography-body-size);
font-weight: var(--typography-body-weight);
line-height: var(--typography-body-line-height);
letter-spacing: var(--typography-body-letter-spacing);
```

## Spacing System

### Base Unit

The spacing system uses a **4px base unit** with a consistent scale:

| Scale | Value | CSS Variable |
|-------|-------|--------------|
| xs | 4px | --spacing-xs |
| sm | 8px | --spacing-sm |
| md | 12px | --spacing-md |
| lg | 16px | --spacing-lg |
| xl | 24px | --spacing-xl |
| 2xl | 32px | --spacing-2xl |
| 3xl | 48px | --spacing-3xl |

### Using Spacing

```typescript
import { spacing } from '@/lib/design-system/config';
import { getSpacing, isValidSpacing } from '@/lib/design-system/utils';

// Get spacing value
const padding = getSpacing('lg'); // 16

// Validate spacing
console.log(isValidSpacing(16)); // true
console.log(isValidSpacing(15)); // false (not a multiple of 4)
```

### CSS Variables

```css
padding: var(--spacing-lg);
margin: var(--spacing-md);
gap: var(--spacing-sm);
```

## Effects System

### Shadows

| Level | Value | CSS Variable |
|-------|-------|--------------|
| sm | 0 1px 2px rgba(0,0,0,0.05) | --shadow-sm |
| md | 0 2px 8px rgba(0,0,0,0.1) | --shadow-md |
| lg | 0 8px 16px rgba(0,0,0,0.15) | --shadow-lg |
| xl | 0 12px 24px rgba(0,0,0,0.2) | --shadow-xl |

### Border Radius

| Size | Value | CSS Variable |
|------|-------|--------------|
| sm | 4px | --radius-sm |
| md | 8px | --radius-md |
| lg | 12px | --radius-lg |
| xl | 16px | --radius-xl |
| full | 9999px | --radius-full |

### Blur Effects

| Size | Value | CSS Variable |
|------|-------|--------------|
| sm | 4px | --blur-sm |
| md | 10px | --blur-md |
| lg | 20px | --blur-lg |

### Transitions

| Speed | Duration | CSS Variable |
|-------|----------|--------------|
| fast | 150ms ease-in-out | --transition-fast |
| base | 200ms ease-in-out | --transition-base |
| slow | 300ms ease-in-out | --transition-slow |

## Theme Switching

### Using the Theme Context

```typescript
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { mode, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {mode}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### Theme Persistence

The theme preference is automatically persisted to localStorage with the key `dpe-theme-preference`. On subsequent visits, the saved preference is restored.

### OS-Level Dark Mode Detection

On first visit, the system automatically detects the user's OS-level dark mode preference using `prefers-color-scheme` media query.

## Responsive Breakpoints

| Device | Min Width | Max Width |
|--------|-----------|-----------|
| Mobile | 320px | 768px |
| Tablet | 768px | 1024px |
| Desktop | 1024px | ∞ |

### Using Breakpoints

```typescript
import { breakpoints } from '@/lib/design-system/config';

console.log(breakpoints.mobile.min); // 320px
console.log(breakpoints.tablet.max); // 1024px
```

## Accessibility

### Contrast Ratios

The design system ensures WCAG AA compliance:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio

### Checking Contrast

```typescript
import { getContrastRatio, meetsWCAGAA } from '@/lib/design-system/utils';

const ratio = getContrastRatio('#3B82F6', '#FFFFFF');
console.log(ratio); // ~8.5

console.log(meetsWCAGAA(ratio)); // true
console.log(meetsWCAGAA(ratio, true)); // true (large text)
```

## CSS Variables Reference

All design system values are available as CSS variables:

### Colors
```css
--color-primary
--color-secondary
--color-accent
--color-success
--color-warning
--color-error
--color-neutral
--color-text
--color-background
--color-surface
--color-border
--color-disabled
```

### Typography
```css
--typography-font-family
--typography-h1-size
--typography-h1-weight
--typography-h1-line-height
--typography-h1-letter-spacing
/* ... and similar for h2, h3, h4, body, small */
```

### Spacing
```css
--spacing-xs
--spacing-sm
--spacing-md
--spacing-lg
--spacing-xl
--spacing-2xl
--spacing-3xl
```

### Effects
```css
--shadow-sm
--shadow-md
--shadow-lg
--shadow-xl
--blur-sm
--blur-md
--blur-lg
--radius-sm
--radius-md
--radius-lg
--radius-xl
--radius-full
--transition-fast
--transition-base
--transition-slow
```

## Best Practices

1. **Always use design system values** - Don't hardcode colors, spacing, or typography
2. **Use CSS variables** - Prefer CSS variables over importing config directly
3. **Validate values** - Use utility functions to validate design system compliance
4. **Maintain consistency** - Follow the design system for all new components
5. **Test accessibility** - Always verify contrast ratios and keyboard navigation
6. **Respect user preferences** - Support dark mode and OS-level theme preferences

## Examples

### Using Colors in Components

```typescript
import { colorPalettes } from '@/lib/design-system/config';

export function Button() {
  const colors = colorPalettes.light;
  
  return (
    <button style={{ backgroundColor: colors.primary }}>
      Click me
    </button>
  );
}
```

### Using CSS Variables

```css
.card {
  background-color: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}
```

### Responsive Design

```css
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-xl);
  }
}
```

## Validation and Testing

The design system includes utilities for validation:

```typescript
import {
  isValidColor,
  isValidSpacing,
  isValidTypographySize,
  isValidBorderRadius,
  isValidShadow,
  isValidTransition,
  isValidBlur,
  getContrastRatio,
  meetsWCAGAA,
} from '@/lib/design-system/utils';

// Validate colors
console.log(isValidColor('#3B82F6')); // true

// Validate spacing
console.log(isValidSpacing(16)); // true
console.log(isValidSpacing(15)); // false

// Validate typography
console.log(isValidTypographySize('h1')); // true

// Check contrast
const ratio = getContrastRatio('#3B82F6', '#FFFFFF');
console.log(meetsWCAGAA(ratio)); // true
```

## Future Enhancements

- Component library with pre-built components
- Animation system with predefined keyframes
- Gradient definitions for modern effects
- Icon system integration
- Theme customization API
