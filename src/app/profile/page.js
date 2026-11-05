'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import { FiUser, FiMail, FiBook, FiBookmark, FiPlusCircle, FiShield, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400';
const FALLBACK_AVATAR_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23d97706'><circle cx='50' cy='50' r='50'/><circle cx='50' cy='38' r='18' fill='%23ffffff'/><path d='M20 85c0-16.569 13.431-30 30-30s30 13.431 30 30' fill='%23ffffff'/></svg>";

function ProfileContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ myBooksCount: 0, borrowsCount: 0, loading: true });

  useEffect(() => {
    document.title = 'BookNook | My Profile';
    if (!user?.email) return;

    const fetchStats = async () => {
      const apiUrl = getApiUrl();
      try {
        const [booksRes, borrowsRes] = await Promise.all([
          axios.get(`${apiUrl}/books?email=${encodeURIComponent(user.email)}`, { withCredentials: true }).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}/borrows?email=${encodeURIComponent(user.email)}`, { withCredentials: true }).catch(() => ({ data: [] })),
        ]);

        const books = Array.isArray(booksRes.data) ? booksRes.data : [];
        const borrows = Array.isArray(borrowsRes.data) ? borrowsRes.data : [];

        setStats({
          myBooksCount: books.length,
          borrowsCount: borrows.length,
          loading: false,
        });
      } catch {
        setStats({ myBooksCount: 0, borrowsCount: 0, loading: false });
      }
    };

    fetchStats();
  }, [user]);

  const avatarSrc = (user?.photoURL && user.photoURL.trim() && !user.photoURL.includes('i.ibb.co/2kR5zq0'))
    ? user.photoURL
    : DEFAULT_AVATAR;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        {/* Profile Banner */}
        <div className="h-36 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        </div>

        {/* Profile Info Header */}
        <div className="relative px-6 sm:px-8 pb-8 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={avatarSrc}
                  alt={user?.name || 'User Profile'}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_AVATAR_SVG;
                  }}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white dark:border-gray-800 object-cover shadow-lg bg-amber-50"
                />
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full" />
              </div>
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.name || 'Registered Reader'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <FiMail size={14} /> {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto mb-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-full">
                <FiShield size={12} /> Active Reader
              </span>
            </div>
          </div>

          {/* Real User Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xl shadow-xs">
                <FiBook size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Books Contributed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.loading ? '...' : stats.myBooksCount}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-xs">
                <FiBookmark size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Active Borrows
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.loading ? '...' : stats.borrowsCount}
                </p>
              </div>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700/40 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <FiUser size={15} /> Full Name
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <FiMail size={15} /> Email Address
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <FiClock size={15} /> Member Status
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Verified Member</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/add-book"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <FiPlusCircle size={16} /> Add a Book
            </Link>
            <Link
              href="/my-books"
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <FiBook size={16} /> My Books ({stats.myBooksCount})
            </Link>
            <Link
              href="/my-borrows"
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <FiBookmark size={16} /> My Borrows ({stats.borrowsCount})
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}

