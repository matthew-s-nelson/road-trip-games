// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tick } from 'svelte';

describe('theme.svelte.ts', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.resetModules();
  });

  it('defaults to dark when system preference is dark and no stored value', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { isDark } = await import('./theme.svelte');
    expect(isDark()).toBe(true);
  });

  it('defaults to light when system preference is light', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { isDark } = await import('./theme.svelte');
    expect(isDark()).toBe(false);
  });

  it('reads stored preference over system preference', async () => {
    localStorage.setItem('rtg:theme', 'light');
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true, // system says dark
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { isDark } = await import('./theme.svelte');
    expect(isDark()).toBe(false); // stored 'light' wins
  });

  it('toggleTheme() flips dark', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { isDark, toggleTheme } = await import('./theme.svelte');
    expect(isDark()).toBe(false);
    toggleTheme();
    expect(isDark()).toBe(true);
  });

  it('persists choice to localStorage', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { toggleTheme } = await import('./theme.svelte');
    toggleTheme();
    await tick();
    expect(localStorage.getItem('rtg:theme')).toBe('dark');
  });
});
