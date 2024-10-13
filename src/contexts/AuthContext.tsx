'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  driver: any;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  loginDriver: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedDriver = localStorage.getItem('driver');
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedDriver) {
        setDriver(JSON.parse(savedDriver));
      }
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/users/login', {
        email,
        password,
      });
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ userId }));
      setToken(token);
      setUser({ userId });
      router.push('/');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const loginDriver = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/drivers/login', {
        email,
        password,
      });
      const { token, driverId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('driver', JSON.stringify({ driverId }));
      setToken(token);
      setDriver({ driverId });
      router.push('/driver/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('driver');
    setToken(null);
    setUser(null);
    setDriver(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{ user, driver, token, loginUser, loginDriver, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
