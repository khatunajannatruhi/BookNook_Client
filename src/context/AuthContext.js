'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authClient } from '@/lib/auth-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user session
  const syncSession = async () => {
    try {
      // 1. Check BetterAuth session
      const session = await authClient.getSession();
      if (session?.data?.user) {
        const u = {
          name: session.data.user.name,
          email: session.data.user.email,
          photoURL: session.data.user.image || 'https://i.ibb.co/2kR5zq0/User-avatar-svg.png',
        };
        setUser(u);
        localStorage.setItem('booknook_user', JSON.stringify(u));
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/jwt`,
            { email: u.email },
            { withCredentials: true }
          );
          if (res.data?.token) {
            localStorage.setItem('booknook_token', res.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          }
        } catch {}
        setLoading(false);
        return;
      }
    } catch {
      // fallback
    }

    // 2. Check local stored user if BetterAuth session is not yet active
    const savedUser = localStorage.getItem('booknook_user');
    const savedToken = localStorage.getItem('booknook_token');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
    setLoading(false);
  };

  useEffect(() => {
    syncSession();
  }, []);

  const register = async (name, email, password, photoURL) => {
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    if (!/[A-Z]/.test(password)) throw new Error('Password must have an uppercase letter');
    if (!/[a-z]/.test(password)) throw new Error('Password must have a lowercase letter');

    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoURL || '',
      });
      if (res?.error) {
        throw new Error(res.error.message || 'Registration failed');
      }
    } catch (err) {
      // Fallback local storage registration if MongoDB Atlas is in template mode
      const existingUsers = JSON.parse(localStorage.getItem('booknook_users') || '[]');
      if (existingUsers.find((u) => u.email === email)) {
        throw new Error('User already exists');
      }
      existingUsers.push({ name, email, password, photoURL });
      localStorage.setItem('booknook_users', JSON.stringify(existingUsers));
    }
    return true;
  };

  const login = async (email, password) => {
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });
      if (res?.error) {
        throw new Error(res.error.message || 'Invalid email or password');
      }
      if (res?.data?.user) {
        const userData = {
          name: res.data.user.name,
          email: res.data.user.email,
          photoURL: res.data.user.image || 'https://i.ibb.co/2kR5zq0/User-avatar-svg.png',
        };
        setUser(userData);
        localStorage.setItem('booknook_user', JSON.stringify(userData));
        try {
          const jwtRes = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/jwt`,
            { email: userData.email },
            { withCredentials: true }
          );
          if (jwtRes.data?.token) {
            localStorage.setItem('booknook_token', jwtRes.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${jwtRes.data.token}`;
          }
        } catch {}
        return userData;
      }
    } catch (err) {
      // Fallback if BetterAuth server route had an error
      const existingUsers = JSON.parse(localStorage.getItem('booknook_users') || '[]');
      const foundUser = existingUsers.find((u) => u.email === email && u.password === password);
      if (!foundUser) throw new Error(err.message || 'Invalid email or password');

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/jwt`,
          { email },
          { withCredentials: true }
        );
        if (res.data?.token) {
          localStorage.setItem('booknook_token', res.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        }
      } catch {}

      const userData = { name: foundUser.name, email: foundUser.email, photoURL: foundUser.photoURL };
      setUser(userData);
      localStorage.setItem('booknook_user', JSON.stringify(userData));
      return userData;
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch {}
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jwt/logout`, {}, { withCredentials: true });
    } catch {}
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('booknook_token');
    localStorage.removeItem('booknook_user');
    setUser(null);
  };

  const googleLogin = async (callbackURL = '/') => {
    // Real Google OAuth redirect via BetterAuth
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: callbackURL || '/',
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
