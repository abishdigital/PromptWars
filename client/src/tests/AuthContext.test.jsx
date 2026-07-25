import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';

const AuthTestComponent = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'Logged In' : 'Logged Out'}</span>
      {user && <span data-testid="user-name">{user.name}</span>}
    </div>
  );
};

describe('AuthContext Provider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes in logged out state without token', () => {
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );

    const status = screen.getByTestId('auth-status');
    expect(status.textContent).toBe('Logged Out');
  });
});
