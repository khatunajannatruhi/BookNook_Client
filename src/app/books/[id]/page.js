'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import PrivateRoute from '@/components/PrivateRoute';
import BorrowModal from '@/components/BorrowModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

function BookDetailsContent() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
        withCredentials: true,
      });
      setBook(res.data);
      document.title = `BookNook | ${res.data.title}`;
    } catch {
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!book) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Book not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-80 md:h-full min-h-[400px]">
            <img
              src={book.image || 'https://i.ibb.co/2kR5zq0/User-avatar-svg.png'}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-8">
            <span className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium px-3 py-1 rounded-full mb-4">
              {book.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{book.title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">by {book.author}</p>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {book.description || 'No description available.'}
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Added by</span>
                <span className="text-gray-800 dark:text-white font-medium">
                  {book.userName || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Copies</span>
                <span className="text-gray-800 dark:text-white font-medium">{book.totalCopies}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Availability</span>
                <span
                  className={`font-medium ${
                    book.totalCopies > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {book.totalCopies > 0 ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowBorrowModal(true)}
              disabled={book.totalCopies === 0}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {book.totalCopies > 0 ? 'Borrow This Book' : 'Not Available'}
            </button>
          </div>
        </div>
      </div>

      {showBorrowModal && (
        <BorrowModal
          book={book}
          onClose={() => setShowBorrowModal(false)}
          onSuccess={fetchBook}
        />
      )}
    </motion.div>
  );
}

export default function BookDetailsPage() {
  return (
    <PrivateRoute>
      <Suspense fallback={<LoadingSpinner />}>
        <BookDetailsContent />
      </Suspense>
    </PrivateRoute>
  );
}
