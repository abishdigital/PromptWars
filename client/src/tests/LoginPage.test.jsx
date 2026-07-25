import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

const renderLoginPage = () => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('LoginPage Component', () => {
  it('renders login form and demo account buttons', () => {
    renderLoginPage();

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByText('Patient')).toBeInTheDocument();
    expect(screen.getByText('Caregiver')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('populates email and password on demo quick-fill click', async () => {
    renderLoginPage();

    const patientBtn = screen.getByText('Patient');
    await act(async () => {
      await userEvent.click(patientBtn);
    });

    const emailInput = screen.getByPlaceholderText('you@example.com');
    expect(emailInput.value).toBe('user@example.com');
  });
});
