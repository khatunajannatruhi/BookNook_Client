'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400';
const FALLBACK_AVATAR_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23d97706'><circle cx='50' cy='50' r='50'/><circle cx='50' cy='38' r='18' fill='%23ffffff'/><path d='M20 85c0-16.569 13.431-30 30-30s30 13.431 30 30' fill='%23ffffff'/></svg>";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('booknook_theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('booknook_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('booknook_theme', 'light');
      }
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/books', label: 'All Books' },
  ];

  const privateLinks = [
    { href: '/add-book', label: 'Add Book' },
    { href: '/my-books', label: 'My Books' },
    { href: '/my-borrows', label: 'My Borrows' },
  ];

  const isActive = (href) => pathname === href;
  const avatarSrc = (user?.photoURL && user.photoURL.trim() && !user.photoURL.includes('i.ibb.co/2kR5zq0'))
    ? user.photoURL
    : DEFAULT_AVATAR;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-100 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-amber-700 dark:text-amber-400">
            <span>📚</span>
            <span>BookNook</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user &&
              privateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* User section (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-hidden"
                  >
                    <img
                      src={avatarSrc}
                      alt={user.name || 'User profile'}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_AVATAR_SVG;
                      }}
                      className="w-9 h-9 rounded-full border-2 border-amber-400 object-cover shadow-xs"
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                        <img
                          src={avatarSrc}
                          alt={user.name || 'User'}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_AVATAR_SVG;
                          }}
                          className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="px-4 py-2">
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                          <FiUser size={12} /> My Profile
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <FiLogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-800"
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-amber-100 dark:border-gray-700 pt-2">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.href)
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user &&
                privateLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive(link.href)
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              <div className="border-t border-amber-100 dark:border-gray-700 mt-2 pt-2">
                {user ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <img
                        src={avatarSrc}
                        alt={user.name || 'User profile'}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_AVATAR_SVG;
                        }}
                        className="w-9 h-9 rounded-full border-2 border-amber-400 object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-left flex items-center gap-2"
                    >
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-400"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 text-sm font-medium bg-amber-600 text-white rounded-lg text-center"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
