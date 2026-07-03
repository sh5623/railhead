import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useThemeStore } from '@/stores/theme';

// Reset shared store state between tests so order doesn't matter.
afterEach(() => useThemeStore.setState({ theme: 'light' }));

describe('ThemeToggle', () => {
  it('toggles the theme store and reflects state via role=switch / aria-checked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const sw = screen.getByRole('switch', { name: '다크 모드로 전환' });
    expect(sw).toHaveAttribute('aria-checked', 'false');

    await user.click(sw);

    expect(useThemeStore.getState().theme).toBe('dark');
    expect(screen.getByRole('switch', { name: '라이트 모드로 전환' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('is operable by keyboard (Enter and Space)', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const sw = screen.getByRole('switch');
    sw.focus();
    expect(sw).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(useThemeStore.getState().theme).toBe('dark');

    await user.keyboard(' ');
    expect(useThemeStore.getState().theme).toBe('light');
  });
});
