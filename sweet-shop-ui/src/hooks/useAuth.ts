import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

// Relative Imports
import { api } from '../lib/api';
import { ENDPOINTS, COOKIE_NAME } from '../lib/constants';
import { LoginRequest, RegisterRequest, User, AuthResponse } from '../types';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Check for existing session on load
  useEffect(() => {
    const token = Cookies.get(COOKIE_NAME);
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      } catch (e) {
        logout(); 
      }
    }
    setLoading(false);
  }, []);

  // 2. Login
  const login = async (data: LoginRequest) => {
    try {
      const res = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);
      const { token } = res.data;

      Cookies.set(COOKIE_NAME, token, { expires: 1 });
      
      const decoded = jwtDecode<User>(token);
      setUser(decoded);

      toast.success("Welcome back to the dark side.");
      
      if (decoded.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/shop');
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Access Denied. Check your credentials.");
      throw error;
    }
  };

  // 3. Register
  const register = async (data: RegisterRequest) => {
    try {
      const res = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
      const { token } = res.data;
      
      Cookies.set(COOKIE_NAME, token, { expires: 1 });
      const decoded = jwtDecode<User>(token);
      setUser(decoded);

      toast.success("Account created successfully.");
      
      // FIX: Implement conditional redirection for ADMIN vs USER
      if (decoded.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/shop');
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  // 4. Logout
  const logout = () => {
    Cookies.remove(COOKIE_NAME);
    setUser(null);
    router.push('/login'); // We will build this page next
    toast.info("Logged out.");
  };

  return { user, login, register, logout, loading };
}