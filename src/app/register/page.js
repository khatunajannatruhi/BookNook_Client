'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiImage } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const { register, googleLogin } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    document.title = 'BookNook | Register';
  }, []);

  const validatePassword = (pw) => {
    const errs = [];
    if (pw.length < 6) errs.push('Must be at least 6 characters');
    if (!/[A-Z]/.test(pw)) errs.push('Must have an uppercase letter');
    if (!/[a-z]/.test(pw)) errs.push('Must have a lowercase letter');
    return errs;
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setErrors(validatePassword(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwErrors = validatePassword(password);
    if (pwErrors.length > 0) {
      setErrors(pwErrors);
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, photoURL);
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin('/');
    } catch {
      toast.error('Google login failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[80vh] flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Join the BookNook community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Photo URL</label>
              <div className="relative">
                <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://i.ibb.co/your-photo.jpg"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {errors.map((err, i) => (
                    <li key={i} className="text-xs text-red-500 flex items-center gap-1">
                      <span>•</span> {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
