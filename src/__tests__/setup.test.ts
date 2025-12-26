/**
 * Basic setup test to verify Jest configuration
 */

describe('Project Setup', () => {
  it('should have Jest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should be able to import types', async () => {
    const types = await import('@/lib/types');
    expect(types).toBeDefined();
  });
});