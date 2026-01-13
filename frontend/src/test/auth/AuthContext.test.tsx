import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../auth/AuthContext';
import { AuthContext } from '../../auth/AuthContext';
import { ReactNode } from 'react';

describe('AuthContext - useAuth hook', () => {
  it('throws error when used without AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('AuthProvider is missing');
  });

  it('provides user from AuthContext', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'MANAGER' as const,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={{ user: mockUser, setUser: () => {} }}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
  });

  it('allows setting user via setUser', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'MANAGER' as const,
    };

    let currentUser = mockUser;

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider
        value={{
          user: currentUser,
          setUser: (user) => {
            currentUser = user;
          },
        }}
      >
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
  });

  it('handles null user (logout)', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={{ user: null, setUser: () => {} }}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
  });
});
