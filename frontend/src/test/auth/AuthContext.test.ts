import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../auth/AuthContext';
import { AuthProvider } from '../../auth/AuthProvider';

describe('AuthContext - useAuth hook', () => {
  it('throws error when used without AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('AuthProvider is missing');
  });

  it('provides user from AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('setUser');
  });

  it('allows setting user', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const testUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'MANAGER' as const,
    };

    act(() => {
      result.current.setUser(testUser);
    });

    expect(result.current.user).toEqual(testUser);
  });

  it('allows clearing user (logout)', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const testUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'MANAGER' as const,
    };

    act(() => {
      result.current.setUser(testUser);
    });

    expect(result.current.user).not.toBeNull();

    act(() => {
      result.current.setUser(null);
    });

    expect(result.current.user).toBeNull();
  });
});
