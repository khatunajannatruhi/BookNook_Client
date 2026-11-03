'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-8xl mb-6">📖</div>
      <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-400 mb-3">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        It seems like this page has been checked out and never returned.
        Let&apos;s get you back to the library!
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors shadow-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}
