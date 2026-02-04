/**
 * Design System Exports
 * Central export point for all design system utilities and configuration
 */

// Configuration exports
export {
  colorPalettes,
  typography,
  spacing,
  effects,
  breakpoints,
  getThemeConfig,
  cssVariables,
  type ThemeConfig,
} from './config';

// Utility exports
export {
  isValidColor,
  getPaletteColors,
  isValidSpacing,
  getSpacing,
  isValidTypographySize,
  getTypographyStyles,
  getContrastRatio,
  meetsWCAGAA,
  getSpacingScale,
  isValidBorderRadius,
  getBorderRadius,
  isValidShadow,
  getShadow,
  isValidTransition,
  getTransition,
  isValidBlur,
  getBlur,
} from './utils';
