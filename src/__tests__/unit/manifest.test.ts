/**
 * Unit Tests for Web App Manifest Validation
 * Feature: pwa-implementation
 * Property 1: Manifest Validity
 * 
 * Validates: Requirements 1.1-1.10
 */

import * as fs from 'fs';
import * as path from 'path';

interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

interface ManifestShortcut {
  name: string;
  url: string;
  icons?: ManifestIcon[];
}

interface WebAppManifest {
  name: string;
  short_name: string;
  description?: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  orientation?: string;
  scope?: string;
  icons: ManifestIcon[];
  shortcuts?: ManifestShortcut[];
}

describe('Web App Manifest Validation', () => {
  let manifest: WebAppManifest;

  beforeAll(() => {
    // Read the manifest file
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);
  });

  /**
   * Property 1: Manifest Validity
   * For any valid Web App Manifest, parsing the manifest.json file SHALL produce 
   * an object containing all required PWA fields with valid values.
   */
  describe('Property 1: Manifest Validity', () => {
    // Requirement 1.1: Name property
    it('should have name set to "Store Management System"', () => {
      expect(manifest.name).toBe('Store Management System');
    });

    // Requirement 1.2: Short name property (max 12 characters)
    it('should have short_name set to "Inventory" with max 12 characters', () => {
      expect(manifest.short_name).toBe('Inventory');
      expect(manifest.short_name.length).toBeLessThanOrEqual(12);
    });

    // Requirement 1.3: Icons with 192x192 and 512x512 sizes
    it('should include icons in sizes 192x192 and 512x512', () => {
      const iconSizes = manifest.icons.map((icon) => icon.sizes);
      expect(iconSizes).toContain('192x192');
      expect(iconSizes).toContain('512x512');
    });

    // Requirement 1.4: Maskable icons
    it('should include maskable icons for adaptive icon support', () => {
      const maskableIcons = manifest.icons.filter(
        (icon) => icon.purpose === 'maskable'
      );
      expect(maskableIcons.length).toBeGreaterThan(0);
      
      // Should have maskable icons in required sizes
      const maskableSizes = maskableIcons.map((icon) => icon.sizes);
      expect(maskableSizes).toContain('192x192');
      expect(maskableSizes).toContain('512x512');
    });

    // Requirement 1.5: Start URL
    it('should specify start_url as "/"', () => {
      expect(manifest.start_url).toBe('/');
    });

    // Requirement 1.6: Display mode
    it('should specify display mode as "standalone"', () => {
      expect(manifest.display).toBe('standalone');
    });

    // Requirement 1.7: Theme color
    it('should include a valid theme_color', () => {
      expect(manifest.theme_color).toBeDefined();
      // Should be a valid hex color
      expect(manifest.theme_color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    // Requirement 1.8: Background color
    it('should include a valid background_color', () => {
      expect(manifest.background_color).toBeDefined();
      // Should be a valid hex color
      expect(manifest.background_color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    // Requirement 1.9: Orientation
    it('should specify orientation as "any"', () => {
      expect(manifest.orientation).toBe('any');
    });

    // Requirement 1.10: Description
    it('should include a description', () => {
      expect(manifest.description).toBeDefined();
      expect(manifest.description!.length).toBeGreaterThan(0);
    });
  });

  describe('Icon Validation', () => {
    it('should have all required icon sizes', () => {
      const requiredSizes = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'];
      const iconSizes = manifest.icons.map((icon) => icon.sizes);
      
      requiredSizes.forEach((size) => {
        expect(iconSizes).toContain(size);
      });
    });

    it('should have valid icon types', () => {
      manifest.icons.forEach((icon) => {
        expect(['image/png', 'image/svg+xml']).toContain(icon.type);
      });
    });

    it('should have valid icon purposes', () => {
      manifest.icons.forEach((icon) => {
        if (icon.purpose) {
          expect(['any', 'maskable', 'monochrome']).toContain(icon.purpose);
        }
      });
    });
  });

  describe('Shortcuts Validation', () => {
    // Requirements 13.1-13.4: PWA Shortcuts
    it('should include shortcuts for Dashboard, Items, Stock In, Stock Out', () => {
      expect(manifest.shortcuts).toBeDefined();
      
      const shortcutUrls = manifest.shortcuts!.map((s) => s.url);
      expect(shortcutUrls).toContain('/');
      expect(shortcutUrls).toContain('/items');
      expect(shortcutUrls).toContain('/stock-in');
      expect(shortcutUrls).toContain('/stock-out');
    });

    it('should have valid shortcut names', () => {
      manifest.shortcuts?.forEach((shortcut) => {
        expect(shortcut.name).toBeDefined();
        expect(shortcut.name.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Manifest Structure', () => {
    it('should have a valid scope', () => {
      expect(manifest.scope).toBe('/');
    });

    it('should be valid JSON', () => {
      const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
      const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
      
      expect(() => JSON.parse(manifestContent)).not.toThrow();
    });
  });
});
