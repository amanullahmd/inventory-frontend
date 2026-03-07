/**
 * Design System Configuration
 * Defines the complete design system including colors, typography, spacing, and theme settings
 */

// Color Palettes
export const colorPalettes = {
  light: {
    primary: "#d5e6baba",
    primaryForeground: "#0088a3",
    secondary: "#a1cf8a",
    accent: "#00b8c9",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    neutral: "#F3F4F6",
    text: "#1F2937",
  },
  dark: {
    primary: "#d5e6baba",
    primaryForeground: "#0088a3",
    secondary: "#a1cf8a",
    accent: "#00b8c9",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    neutral: "#1F2937",
    text: "#F3F4F6",
  },
};

// Typography System
export const typography = {
  fontFamily: {
    primary: "Inter, system-ui, -apple-system, sans-serif",
    fallback: "system-ui, -apple-system, sans-serif",
  },
  sizes: {
    h1: {
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "0.25px",
    },
    h2: {
      fontSize: "24px",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "0.25px",
    },
    h3: {
      fontSize: "20px",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "0.25px",
    },
    h4: {
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "0.25px",
    },
    body: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.5px",
    },
    small: {
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: "0.5px",
    },
  },
};

// Spacing System (4px base unit)
export const spacing = {
  baseUnit: 4,
  scale: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
  },
};

// Effects System
export const effects = {
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 2px 8px rgba(0, 0, 0, 0.1)",
    lg: "0 8px 16px rgba(0, 0, 0, 0.15)",
    xl: "0 12px 24px rgba(0, 0, 0, 0.2)",
  },
  blur: {
    sm: "4px",
    md: "10px",
    lg: "20px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  transitions: {
    fast: "150ms ease-in-out",
    base: "200ms ease-in-out",
    slow: "300ms ease-in-out",
  },
};

// Responsive Breakpoints
export const breakpoints = {
  mobile: {
    min: "320px",
    max: "768px",
  },
  tablet: {
    min: "768px",
    max: "1024px",
  },
  desktop: {
    min: "1024px",
  },
};

// Theme Configuration Type
export interface ThemeConfig {
  mode: "light" | "dark";
  colors: typeof colorPalettes.light;
  typography: typeof typography;
  spacing: typeof spacing;
  effects: typeof effects;
  breakpoints: typeof breakpoints;
}

// Get theme configuration based on mode
export const getThemeConfig = (
  mode: "light" | "dark" = "light",
): ThemeConfig => {
  return {
    mode,
    colors: colorPalettes[mode],
    typography,
    spacing,
    effects,
    breakpoints,
  };
};

// CSS Variables mapping for design system
export const cssVariables = {
  light: {
    "--color-primary": colorPalettes.light.primary,
    "--color-primary-foreground": colorPalettes.light.primaryForeground,
    "--color-secondary": colorPalettes.light.secondary,
    "--color-accent": colorPalettes.light.accent,
    "--color-success": colorPalettes.light.success,
    "--color-warning": colorPalettes.light.warning,
    "--color-error": colorPalettes.light.error,
    "--color-neutral": colorPalettes.light.neutral,
    "--color-text": colorPalettes.light.text,
    "--color-background": "#FFFFFF",
    "--color-surface": colorPalettes.light.neutral,
    "--color-border": "#E5E7EB",
    "--color-disabled": "#D1D5DB",
    "--typography-font-family": typography.fontFamily.primary,
    "--typography-h1-size": typography.sizes.h1.fontSize,
    "--typography-h1-weight": typography.sizes.h1.fontWeight.toString(),
    "--typography-h1-line-height": typography.sizes.h1.lineHeight.toString(),
    "--typography-h1-letter-spacing": typography.sizes.h1.letterSpacing,
    "--typography-h2-size": typography.sizes.h2.fontSize,
    "--typography-h2-weight": typography.sizes.h2.fontWeight.toString(),
    "--typography-h2-line-height": typography.sizes.h2.lineHeight.toString(),
    "--typography-h2-letter-spacing": typography.sizes.h2.letterSpacing,
    "--typography-h3-size": typography.sizes.h3.fontSize,
    "--typography-h3-weight": typography.sizes.h3.fontWeight.toString(),
    "--typography-h3-line-height": typography.sizes.h3.lineHeight.toString(),
    "--typography-h3-letter-spacing": typography.sizes.h3.letterSpacing,
    "--typography-h4-size": typography.sizes.h4.fontSize,
    "--typography-h4-weight": typography.sizes.h4.fontWeight.toString(),
    "--typography-h4-line-height": typography.sizes.h4.lineHeight.toString(),
    "--typography-h4-letter-spacing": typography.sizes.h4.letterSpacing,
    "--typography-body-size": typography.sizes.body.fontSize,
    "--typography-body-weight": typography.sizes.body.fontWeight.toString(),
    "--typography-body-line-height":
      typography.sizes.body.lineHeight.toString(),
    "--typography-body-letter-spacing": typography.sizes.body.letterSpacing,
    "--typography-small-size": typography.sizes.small.fontSize,
    "--typography-small-weight": typography.sizes.small.fontWeight.toString(),
    "--typography-small-line-height":
      typography.sizes.small.lineHeight.toString(),
    "--typography-small-letter-spacing": typography.sizes.small.letterSpacing,
    "--spacing-xs": spacing.scale.xs,
    "--spacing-sm": spacing.scale.sm,
    "--spacing-md": spacing.scale.md,
    "--spacing-lg": spacing.scale.lg,
    "--spacing-xl": spacing.scale.xl,
    "--spacing-2xl": spacing.scale["2xl"],
    "--spacing-3xl": spacing.scale["3xl"],
    "--shadow-sm": effects.shadows.sm,
    "--shadow-md": effects.shadows.md,
    "--shadow-lg": effects.shadows.lg,
    "--shadow-xl": effects.shadows.xl,
    "--blur-sm": effects.blur.sm,
    "--blur-md": effects.blur.md,
    "--blur-lg": effects.blur.lg,
    "--radius-sm": effects.borderRadius.sm,
    "--radius-md": effects.borderRadius.md,
    "--radius-lg": effects.borderRadius.lg,
    "--radius-xl": effects.borderRadius.xl,
    "--radius-full": effects.borderRadius.full,
    "--transition-fast": effects.transitions.fast,
    "--transition-base": effects.transitions.base,
    "--transition-slow": effects.transitions.slow,
  },
  dark: {
    "--color-primary": colorPalettes.dark.primary,
    "--color-primary-foreground": colorPalettes.dark.primaryForeground,
    "--color-secondary": colorPalettes.dark.secondary,
    "--color-accent": colorPalettes.dark.accent,
    "--color-success": colorPalettes.dark.success,
    "--color-warning": colorPalettes.dark.warning,
    "--color-error": colorPalettes.dark.error,
    "--color-neutral": colorPalettes.dark.neutral,
    "--color-text": colorPalettes.dark.text,
    "--color-background": "#0F172A",
    "--color-surface": "#1E293B",
    "--color-border": "#334155",
    "--color-disabled": "#64748B",
    "--typography-font-family": typography.fontFamily.primary,
    "--typography-h1-size": typography.sizes.h1.fontSize,
    "--typography-h1-weight": typography.sizes.h1.fontWeight.toString(),
    "--typography-h1-line-height": typography.sizes.h1.lineHeight.toString(),
    "--typography-h1-letter-spacing": typography.sizes.h1.letterSpacing,
    "--typography-h2-size": typography.sizes.h2.fontSize,
    "--typography-h2-weight": typography.sizes.h2.fontWeight.toString(),
    "--typography-h2-line-height": typography.sizes.h2.lineHeight.toString(),
    "--typography-h2-letter-spacing": typography.sizes.h2.letterSpacing,
    "--typography-h3-size": typography.sizes.h3.fontSize,
    "--typography-h3-weight": typography.sizes.h3.fontWeight.toString(),
    "--typography-h3-line-height": typography.sizes.h3.lineHeight.toString(),
    "--typography-h3-letter-spacing": typography.sizes.h3.letterSpacing,
    "--typography-h4-size": typography.sizes.h4.fontSize,
    "--typography-h4-weight": typography.sizes.h4.fontWeight.toString(),
    "--typography-h4-line-height": typography.sizes.h4.lineHeight.toString(),
    "--typography-h4-letter-spacing": typography.sizes.h4.letterSpacing,
    "--typography-body-size": typography.sizes.body.fontSize,
    "--typography-body-weight": typography.sizes.body.fontWeight.toString(),
    "--typography-body-line-height":
      typography.sizes.body.lineHeight.toString(),
    "--typography-body-letter-spacing": typography.sizes.body.letterSpacing,
    "--typography-small-size": typography.sizes.small.fontSize,
    "--typography-small-weight": typography.sizes.small.fontWeight.toString(),
    "--typography-small-line-height":
      typography.sizes.small.lineHeight.toString(),
    "--typography-small-letter-spacing": typography.sizes.small.letterSpacing,
    "--spacing-xs": spacing.scale.xs,
    "--spacing-sm": spacing.scale.sm,
    "--spacing-md": spacing.scale.md,
    "--spacing-lg": spacing.scale.lg,
    "--spacing-xl": spacing.scale.xl,
    "--spacing-2xl": spacing.scale["2xl"],
    "--spacing-3xl": spacing.scale["3xl"],
    "--shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.3)",
    "--shadow-md": "0 2px 8px rgba(0, 0, 0, 0.4)",
    "--shadow-lg": "0 8px 16px rgba(0, 0, 0, 0.5)",
    "--shadow-xl": "0 12px 24px rgba(0, 0, 0, 0.6)",
    "--blur-sm": effects.blur.sm,
    "--blur-md": effects.blur.md,
    "--blur-lg": effects.blur.lg,
    "--radius-sm": effects.borderRadius.sm,
    "--radius-md": effects.borderRadius.md,
    "--radius-lg": effects.borderRadius.lg,
    "--radius-xl": effects.borderRadius.xl,
    "--radius-full": effects.borderRadius.full,
    "--transition-fast": effects.transitions.fast,
    "--transition-base": effects.transitions.base,
    "--transition-slow": effects.transitions.slow,
  },
};
