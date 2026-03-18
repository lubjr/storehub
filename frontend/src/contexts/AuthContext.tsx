import { useState } from 'react';
import type { ReactNode } from 'react';
import client from '../api/client';
import { AuthContext } from './auth-context';
import type { AuthContextType } from './auth-context';
import type { User } from '../types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const login: AuthContextType['login'] = async (email, password) => {
    const { data } = await client.post('/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const register: AuthContextType['register'] = async (name, email, password, passwordConfirmation) => {
    const { data } = await client.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout: AuthContextType['logout'] = () => {
    client.post('/logout').finally(() => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
