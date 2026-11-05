'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authClient } from '@/lib/auth-client';

const AuthContext = createContext(null);

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400';

export const getApiUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return raw.replace(/\/api\/?$/, '');
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user session
  const syncSession = async () => {
    try {
      // 1. Check BetterAuth session
      const session = await authClient.getSession();
      if (session?.data?.user) {
        const rawImg = session.data.user.image;
        const validImg = rawImg && rawImg.trim() && !rawImg.includes('i.ibb.co/2kR5zq0') ? rawImg : DEFAULT_AVATAR;
        const u = {
          name: session.data.user.name,
          email: session.data.user.email,
          photoURL: validImg,
        };
        setUser(u);
        localStorage.setItem('booknook_user', JSON.stringify(u));
        try {
          const res = await axios.post(
            `${getApiUrl()}/jwt`,
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
        const parsed = JSON.parse(savedUser);
        if (!parsed.photoURL || parsed.photoURL.includes('i.ibb.co/2kR5zq0')) {
          parsed.photoURL = DEFAULT_AVATAR;
          localStorage.setItem('booknook_user', JSON.stringify(parsed));
        }
        setUser(parsed);
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

    const finalPhotoURL = photoURL && photoURL.trim() ? photoURL.trim() : DEFAULT_AVATAR;

    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
        image: finalPhotoURL,
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
      existingUsers.push({ name, email, password, photoURL: finalPhotoURL });
      localStorage.setItem('booknook_users', JSON.stringify(existingUsers));
    }
    return true;
  };

  const login = async (email, password) => {
    let res = null;
    let authError = null;

    try {
      res = await authClient.signIn.email({
        email,
        password,
      });
    } catch (e) {
      authError = e;
    }

    if (res?.error) {
      throw new Error(res.error.message || 'Invalid email or password');
    }

    if (res?.data?.user) {
      const rawImg = res.data.user.image;
      const validImg = rawImg && rawImg.trim() && !rawImg.includes('i.ibb.co/2kR5zq0') ? rawImg : DEFAULT_AVATAR;
      const userData = {
        name: res.data.user.name,
        email: res.data.user.email,
        photoURL: validImg,
      };
      setUser(userData);
      localStorage.setItem('booknook_user', JSON.stringify(userData));
      try {
        const jwtRes = await axios.post(
          `${getApiUrl()}/jwt`,
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

    if (authError) {
      throw new Error(authError.message || 'Login failed. Please check your credentials.');
    }

    throw new Error('Invalid email or password');
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch {}
    try {
      await axios.post(`${getApiUrl()}/jwt/logout`, {}, { withCredentials: true });
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
