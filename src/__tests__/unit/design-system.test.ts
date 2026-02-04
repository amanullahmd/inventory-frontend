/**
 * Unit Tests for Design System
 * Tests configuration, utilities, and design system compliance
 */

import {
  colorPalettes,
  typography,
  spacing,
  effects,
  breakpoints,
  getThemeConfig,
  cssVariables,
} from '@/lib/design-system/config';
import {
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
} from '@/lib/design-system/utils';

describe('Design System Configuration', () => {
  describe('Color Palettes', () => {
    it('should have all required colors in light mode', () => {
      const requiredColors = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'neutral', 'text'];
      requiredColors.forEach(color => {
        expect(colorPalettes.light).toHaveProperty(color);
        expect(typeof colorPalettes.light[color as keyof typeof colorPalettes.light]).toBe('string');
      });
    });

    it('should have all required colors in dark mode', () => {
      const requiredColors = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'neutral', 'text'];
      requiredColors.forEach(color => {
        expect(colorPalettes.dark).toHaveProperty(color);
        expect(typeof colorPalettes.dark[color as keyof typeof colorPalettes.dark]).toBe('string');
      });
    });

    it('should have valid hex color values', () => {
      const hexRegex = /^#[0-9A-F]{6}$/i;
      Object.values(colorPalettes.light).forEach(color => {
        expect(color).toMatch(hexRegex);
      });
      Object.values(colorPalettes.dark).forEach(color => {
        expect(color).toMatch(hexRegex);
      });
    });
  });

  describe('Typography System', () => {
    it('should have all required typography sizes', () => {
      const requiredSizes = ['h1', 'h2', 'h3', 'h4', 'body', 'small'];
      requiredSizes.forEach(size => {
        expect(typography.sizes).toHaveProperty(size);
      });
    });

    it('should have correct H1 typography', () => {
      expect(typography.sizes.h1.fontSize).toBe('32px');
      expect(typography.sizes.h1.fontWeight).toBe(700);
      expect(typography.sizes.h1.lineHeight).toBe(1.2);
      expect(typography.sizes.h1.letterSpacing).toBe('0.25px');
    });

    it('should have correct H2 typography', () => {
      expect(typography.sizes.h2.fontSize).toBe('24px');
      expect(typography.sizes.h2.fontWeight).toBe(600);
      expect(typography.sizes.h2.lineHeight).toBe(1.2);
      expect(typography.sizes.h2.letterSpacing).toBe('0.25px');
    });

    it('should have correct body typography', () => {
      expect(typography.sizes.body.fontSize).toBe('14px');
      expect(typography.sizes.body.fontWeight).toBe(400);
      expect(typography.sizes.body.lineHeight).toBe(1.5);
      expect(typography.sizes.body.letterSpacing).toBe('0.5px');
    });

    it('should have correct small typography', () => {
      expect(typography.sizes.small.fontSize).toBe('12px');
      expect(typography.sizes.small.fontWeight).toBe(400);
      expect(typography.sizes.small.lineHeight).toBe(1.4);
      expect(typography.sizes.small.letterSpacing).toBe('0.5px');
    });
  });

  describe('Spacing System', () => {
    it('should have 4px base unit', () => {
      expect(spacing.baseUnit).toBe(4);
    });

    it('should have all required spacing scales', () => {
      const requiredScales = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
      requiredScales.forEach(scale => {
        expect(spacing.scale).toHaveProperty(scale);
      });
    });

    it('should have correct spacing values', () => {
      expect(spacing.scale.xs).toBe('4px');
      expect(spacing.scale.sm).toBe('8px');
      expect(spacing.scale.md).toBe('12px');
      expect(spacing.scale.lg).toBe('16px');
      expect(spacing.scale.xl).toBe('24px');
      expect(spacing.scale['2xl']).toBe('32px');
      expect(spacing.scale['3xl']).toBe('48px');
    });

    it('should have spacing values that are multiples of 4px', () => {
      Object.values(spacing.scale).forEach(value => {
        const pixels = parseInt(value, 10);
        expect(pixels % spacing.baseUnit).toBe(0);
      });
    });
  });

  describe('Effects System', () => {
    it('should have all required shadow levels', () => {
      const requiredShadows = ['sm', 'md', 'lg', 'xl'];
      requiredShadows.forEach(shadow => {
        expect(effects.shadows).toHaveProperty(shadow);
      });
    });

    it('should have all required border radius sizes', () => {
      const requiredRadius = ['sm', 'md', 'lg', 'xl', 'full'];
      requiredRadius.forEach(radius => {
        expect(effects.borderRadius).toHaveProperty(radius);
      });
    });

    it('should have all required blur sizes', () => {
      const requiredBlur = ['sm', 'md', 'lg'];
      requiredBlur.forEach(blur => {
        expect(effects.blur).toHaveProperty(blur);
      });
    });

    it('should have all required transitions', () => {
      const requiredTransitions = ['fast', 'base', 'slow'];
      requiredTransitions.forEach(transition => {
        expect(effects.transitions).toHaveProperty(transition);
      });
    });
  });

  describe('Responsive Breakpoints', () => {
    it('should have mobile breakpoint', () => {
      expect(breakpoints.mobile.min).toBe('320px');
      expect(breakpoints.mobile.max).toBe('768px');
    });

    it('should have tablet breakpoint', () => {
      expect(breakpoints.tablet.min).toBe('768px');
      expect(breakpoints.tablet.max).toBe('1024px');
    });

    it('should have desktop breakpoint', () => {
      expect(breakpoints.desktop.min).toBe('1024px');
    });
  });

  describe('Theme Configuration', () => {
    it('should return light theme config', () => {
      const config = getThemeConfig('light');
      expect(config.mode).toBe('light');
      expect(config.colors).toEqual(colorPalettes.light);
    });

    it('should return dark theme config', () => {
      const config = getThemeConfig('dark');
      expect(config.mode).toBe('dark');
      expect(config.colors).toEqual(colorPalettes.dark);
    });

    it('should include all required properties in theme config', () => {
      const config = getThemeConfig('light');
      expect(config).toHaveProperty('mode');
      expect(config).toHaveProperty('colors');
      expect(config).toHaveProperty('typography');
      expect(config).toHaveProperty('spacing');
      expect(config).toHaveProperty('effects');
      expect(config).toHaveProperty('breakpoints');
    });
  });

  describe('CSS Variables', () => {
    it('should have CSS variables for light mode', () => {
      expect(cssVariables.light).toHaveProperty('--color-primary');
      expect(cssVariables.light).toHaveProperty('--color-secondary');
      expect(cssVariables.light).toHaveProperty('--spacing-lg');
      expect(cssVariables.light).toHaveProperty('--shadow-md');
    });

    it('should have CSS variables for dark mode', () => {
      expect(cssVariables.dark).toHaveProperty('--color-primary');
      expect(cssVariables.dark).toHaveProperty('--color-secondary');
      expect(cssVariables.dark).toHaveProperty('--spacing-lg');
      expect(cssVariables.dark).toHaveProperty('--shadow-md');
    });

    it('should have different color values for light and dark modes', () => {
      expect(cssVariables.light['--color-primary']).not.toBe(cssVariables.dark['--color-primary']);
      expect(cssVariables.light['--color-text']).not.toBe(cssVariables.dark['--color-text']);
    });
  });
});

describe('Design System Utilities', () => {
  describe('Color Validation', () => {
    it('should validate light mode colors', () => {
      expect(isValidColor('#3B82F6', 'light')).toBe(true);
      expect(isValidColor('#8B5CF6', 'light')).toBe(true);
      expect(isValidColor('#FFFFFF', 'light')).toBe(false);
    });

    it('should validate dark mode colors', () => {
      expect(isValidColor('#60A5FA', 'dark')).toBe(true);
      expect(isValidColor('#A78BFA', 'dark')).toBe(true);
      expect(isValidColor('#FFFFFF', 'dark')).toBe(false);
    });

    it('should get all palette colors', () => {
      const lightColors = getPaletteColors('light');
      expect(lightColors).toHaveLength(8);
      expect(lightColors).toContain('#3B82F6');
    });
  });

  describe('Spacing Validation', () => {
    it('should validate spacing values', () => {
      expect(isValidSpacing(4)).toBe(true);
      expect(isValidSpacing(8)).toBe(true);
      expect(isValidSpacing(16)).toBe(true);
      expect(isValidSpacing(15)).toBe(false);
      expect(isValidSpacing(10)).toBe(false);
    });

    it('should get spacing value', () => {
      expect(getSpacing('lg')).toBe(16);
      expect(getSpacing('xl')).toBe(24);
      expect(getSpacing('xs')).toBe(4);
    });

    it('should get spacing scale', () => {
      const scale = getSpacingScale();
      expect(scale.lg).toBe(16);
      expect(scale.xl).toBe(24);
      expect(Object.keys(scale)).toHaveLength(7);
    });
  });

  describe('Typography Utilities', () => {
    it('should validate typography sizes', () => {
      expect(isValidTypographySize('h1')).toBe(true);
      expect(isValidTypographySize('body')).toBe(true);
      expect(isValidTypographySize('invalid')).toBe(false);
    });

    it('should get typography styles', () => {
      const styles = getTypographyStyles('h1');
      expect(styles.fontSize).toBe('32px');
      expect(styles.fontWeight).toBe(700);
      expect(styles.lineHeight).toBe(1.2);
      expect(styles.letterSpacing).toBe('0.25px');
    });

    it('should get body typography styles', () => {
      const styles = getTypographyStyles('body');
      expect(styles.fontSize).toBe('14px');
      expect(styles.fontWeight).toBe(400);
      expect(styles.lineHeight).toBe(1.5);
      expect(styles.letterSpacing).toBe('0.5px');
    });
  });

  describe('Contrast Ratio Calculation', () => {
    it('should calculate contrast ratio between colors', () => {
      const ratio = getContrastRatio('#FFFFFF', '#000000');
      expect(ratio).toBeGreaterThan(20);
    });

    it('should calculate contrast ratio for primary color on white', () => {
      const ratio = getContrastRatio('#3B82F6', '#FFFFFF');
      expect(ratio).toBeGreaterThan(4);
    });

    it('should meet WCAG AA for large text with primary color', () => {
      const ratio = getContrastRatio('#3B82F6', '#FFFFFF');
      expect(meetsWCAGAA(ratio, true)).toBe(true);
    });

    it('should meet WCAG AA for large text', () => {
      const ratio = getContrastRatio('#3B82F6', '#FFFFFF');
      expect(meetsWCAGAA(ratio, true)).toBe(true);
    });

    it('should fail WCAG AA for low contrast', () => {
      const ratio = getContrastRatio('#CCCCCC', '#FFFFFF');
      expect(meetsWCAGAA(ratio)).toBe(false);
    });
  });

  describe('Border Radius Utilities', () => {
    it('should validate border radius', () => {
      expect(isValidBorderRadius('8px')).toBe(true);
      expect(isValidBorderRadius('12px')).toBe(true);
      expect(isValidBorderRadius('10px')).toBe(false);
    });

    it('should get border radius value', () => {
      expect(getBorderRadius('md')).toBe('8px');
      expect(getBorderRadius('lg')).toBe('12px');
    });
  });

  describe('Shadow Utilities', () => {
    it('should validate shadow', () => {
      expect(isValidShadow('0 2px 8px rgba(0, 0, 0, 0.1)')).toBe(true);
      expect(isValidShadow('invalid')).toBe(false);
    });

    it('should get shadow value', () => {
      expect(getShadow('md')).toBe('0 2px 8px rgba(0, 0, 0, 0.1)');
      expect(getShadow('lg')).toBe('0 8px 16px rgba(0, 0, 0, 0.15)');
    });
  });

  describe('Transition Utilities', () => {
    it('should validate transition', () => {
      expect(isValidTransition('200ms ease-in-out')).toBe(true);
      expect(isValidTransition('invalid')).toBe(false);
    });

    it('should get transition value', () => {
      expect(getTransition('base')).toBe('200ms ease-in-out');
      expect(getTransition('fast')).toBe('150ms ease-in-out');
    });
  });

  describe('Blur Utilities', () => {
    it('should validate blur', () => {
      expect(isValidBlur('10px')).toBe(true);
      expect(isValidBlur('4px')).toBe(true);
      expect(isValidBlur('5px')).toBe(false);
    });

    it('should get blur value', () => {
      expect(getBlur('md')).toBe('10px');
      expect(getBlur('lg')).toBe('20px');
    });
  });
});
