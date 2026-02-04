/**
 * Design System Utilities
 * Helper functions for working with the design system
 */

import { colorPalettes, typography, spacing, effects } from './config';

/**
 * Validates if a color is in the design system palette
 */
export const isValidColor = (color: string, mode: 'light' | 'dark' = 'light'): boolean => {
  const palette = colorPalettes[mode];
  return Object.values(palette).includes(color);
};

/**
 * Gets all colors from the palette
 */
export const getPaletteColors = (mode: 'light' | 'dark' = 'light'): string[] => {
  return Object.values(colorPalettes[mode]);
};

/**
 * Validates if spacing value is a multiple of 4px base unit
 */
export const isValidSpacing = (value: number): boolean => {
  return value % spacing.baseUnit === 0;
};

/**
 * Gets spacing value in pixels
 */
export const getSpacing = (scale: keyof typeof spacing.scale): number => {
  return parseInt(spacing.scale[scale], 10);
};

/**
 * Validates typography size
 */
export const isValidTypographySize = (size: keyof typeof typography.sizes): boolean => {
  return size in typography.sizes;
};

/**
 * Gets typography styles as CSS object
 */
export const getTypographyStyles = (size: keyof typeof typography.sizes) => {
  const typo = typography.sizes[size];
  return {
    fontSize: typo.fontSize,
    fontWeight: typo.fontWeight,
    lineHeight: typo.lineHeight,
    letterSpacing: typo.letterSpacing,
  };
};

/**
 * Calculates contrast ratio between two colors (simplified)
 * Returns a value between 1 and 21
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance <= 0.03928 ? luminance / 12.92 : Math.pow((luminance + 0.055) / 1.055, 2.4);
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Validates if contrast ratio meets WCAG AA standards
 * Normal text: 4.5:1, Large text: 3:1
 */
export const meetsWCAGAA = (ratio: number, isLargeText: boolean = false): boolean => {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Gets all valid spacing values
 */
export const getSpacingScale = (): Record<string, number> => {
  const scale: Record<string, number> = {};
  Object.entries(spacing.scale).forEach(([key, value]) => {
    scale[key] = parseInt(value, 10);
  });
  return scale;
};

/**
 * Validates if a value is a valid border radius
 */
export const isValidBorderRadius = (value: string): boolean => {
  return Object.values(effects.borderRadius).includes(value);
};

/**
 * Gets border radius value
 */
export const getBorderRadius = (size: keyof typeof effects.borderRadius): string => {
  return effects.borderRadius[size];
};

/**
 * Validates if a value is a valid shadow
 */
export const isValidShadow = (value: string): boolean => {
  return Object.values(effects.shadows).includes(value);
};

/**
 * Gets shadow value
 */
export const getShadow = (size: keyof typeof effects.shadows): string => {
  return effects.shadows[size];
};

/**
 * Validates if a value is a valid transition
 */
export const isValidTransition = (value: string): boolean => {
  return Object.values(effects.transitions).includes(value);
};

/**
 * Gets transition value
 */
export const getTransition = (speed: keyof typeof effects.transitions): string => {
  return effects.transitions[speed];
};

/**
 * Validates if a value is a valid blur
 */
export const isValidBlur = (value: string): boolean => {
  return Object.values(effects.blur).includes(value);
};

/**
 * Gets blur value
 */
export const getBlur = (size: keyof typeof effects.blur): string => {
  return effects.blur[size];
};
