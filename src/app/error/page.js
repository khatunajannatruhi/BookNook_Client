'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'unknown';
  const router = useRouter();

  const getErrorMessage = () => {
    switch (error) {
      case 'account_not_linked':
        return 'An account with this email address already exists. Automatic account linking has been enabled, please try signing in again.';
      case 'unable_to_get_user_info':
        return 'Could not retrieve your profile from the OAuth provider. Please try again.';
      case 'email_not_found':
        return 'The provider did not provide an email address. Please make sure your email is public in your OAuth account.';
      default:
        return `Authentication failed: ${error}. Please try again.`;
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-red-100 dark:border-red-900/30 text-center"
      >
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Authentication Notice
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {getErrorMessage()}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Login
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
          >
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-amber-600"></div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
