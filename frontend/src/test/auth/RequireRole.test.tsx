import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RequireRole } from '../../auth/RequireRole';
import { AuthProvider } from '../../auth/AuthProvider';
import { AuthContext, type AuthUser } from '../../auth/AuthContext';

describe('RequireRole Component', () => {
  it('redirects to sign-in when user is not logged in', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RequireRole allowedRoles={['MANAGER']} />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(window.location.pathname).toBe('/sign-in');
  });

  it('allows user with correct role', () => {
    const mockUser: AuthUser = {
      id: 1,
      email: 'manager@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'MANAGER',
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser, setUser: () => {} }}>
          <RequireRole allowedRoles={['MANAGER']}>
            <div>Protected Content</div>
          </RequireRole>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to employee when user has wrong role', () => {
    const mockUser: AuthUser = {
      id: 2,
      email: 'worker@test.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'WORKER',
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser, setUser: () => {} }}>
          <RequireRole allowedRoles={['MANAGER']} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(window.location.pathname).toBe('/employee');
  });

  it('allows any role when allowedRoles is undefined', () => {
    const mockUser: AuthUser = {
      id: 3,
      email: 'user@test.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      role: 'WORKER',
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser, setUser: () => {} }}>
          <RequireRole>
            <div>Protected Content</div>
          </RequireRole>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('allows multiple roles', () => {
    const mockUser: AuthUser = {
      id: 4,
      email: 'supervisor@test.com',
      firstName: 'Alice',
      lastName: 'Wonder',
      role: 'SUPERVISOR',
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser, setUser: () => {} }}>
          <RequireRole allowedRoles={['MANAGER', 'SUPERVISOR']}>
            <div>Protected Content</div>
          </RequireRole>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
