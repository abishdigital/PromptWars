import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-status">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext Provider & Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default theme and toggles theme state', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const status = screen.getByTestId('theme-status');
    const button = screen.getByText('Toggle Theme');

    expect(status.textContent).toBe('light');

    await act(async () => {
      await userEvent.click(button);
    });

    expect(status.textContent).toBe('dark');
    expect(localStorage.getItem('recovery_theme')).toBe('dark');
  });
});
