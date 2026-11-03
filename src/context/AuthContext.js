'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('booknook_token');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    const savedUser = localStorage.getItem('booknook_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password, photoURL) => {
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    if (!/[A-Z]/.test(password)) throw new Error('Password must have an uppercase letter');
    if (!/[a-z]/.test(password)) throw new Error('Password must have a lowercase letter');

    const existingUsers = JSON.parse(localStorage.getItem('booknook_users') || '[]');
    if (existingUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    existingUsers.push({ name, email, password, photoURL });
    localStorage.setItem('booknook_users', JSON.stringify(existingUsers));

    return true;
  };

  const login = async (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('booknook_users') || '[]');
    const foundUser = existingUsers.find(u => u.email === email && u.password === password);
    if (!foundUser) throw new Error('Invalid email or password');

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, { email }, { withCredentials: true });
      if (res.data?.token) {
        localStorage.setItem('booknook_token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      }
    } catch (err) {
      console.warn('JWT endpoint warning:', err);
    }

    const userData = { name: foundUser.name, email: foundUser.email, photoURL: foundUser.photoURL };
    setUser(userData);
    localStorage.setItem('booknook_user', JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jwt/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout endpoint warning:', err);
    }
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('booknook_token');
    setUser(null);
    localStorage.removeItem('booknook_user');
  };

  const googleLogin = async () => {
    const userData = {
      name: 'Google Reader',
      email: 'reader@booknook.com',
      photoURL: 'https://i.ibb.co/2kR5zq0/User-avatar-svg.png'
    };
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, { email: userData.email }, { withCredentials: true });
      if (res.data?.token) {
        localStorage.setItem('booknook_token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      }
    } catch (err) {
      console.warn('JWT endpoint warning:', err);
    }
    setUser(userData);
    localStorage.setItem('booknook_user', JSON.stringify(userData));
    return userData;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
