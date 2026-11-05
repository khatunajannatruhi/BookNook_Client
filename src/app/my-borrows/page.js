'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FiRotateCcw } from 'react-icons/fi';

function MyBorrowsContent() {
  const { user } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrows = async () => {
    try {
      const res = await axios.get(
        `${getApiUrl()}/borrows?email=${user.email}`,
        { withCredentials: true }
      );
      setBorrows(res.data);
    } catch {
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'BookNook | My Borrows';
    if (user) fetchBorrows();
  }, [user]);

  const handleReturn = async (id) => {
    const result = await Swal.fire({
      title: 'Return this book?',
      text: 'Are you sure you want to return this book?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, return it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${getApiUrl()}/borrows/${id}`, {
          withCredentials: true,
        });
        toast.success('Book returned successfully');
        fetchBorrows();
      } catch {
        toast.error('Failed to return book');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Borrows</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your borrowed books</p>
      </div>

      {borrows.length > 0 ? (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              <thead className="bg-amber-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Book</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Title</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Borrow Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Return Date</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {borrows.map((borrow) => (
                  <tr key={borrow._id} className="hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">
                      <img
                        src={borrow.bookImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'}
                        alt={borrow.bookTitle}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';
                        }}
                        className="w-12 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="p-4 text-gray-800 dark:text-white font-medium">{borrow.bookTitle}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(borrow.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                      {borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : 'Not returned'}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleReturn(borrow._id)}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <FiRotateCcw size={14} /> Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {borrows.map((borrow) => (
              <div
                key={borrow._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex gap-4">
                  <img
                    src={borrow.bookImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'}
                    alt={borrow.bookTitle}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';
                    }}
                    className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-1">{borrow.bookTitle}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Return by: {borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : 'N/A'}
                    </p>
                    <button
                      onClick={() => handleReturn(borrow._id)}
                      className="inline-flex items-center gap-1 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiRotateCcw size={14} /> Return
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            You haven&apos;t borrowed any books yet.
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function MyBorrowsPage() {
  return (
    <PrivateRoute>
      <MyBorrowsContent />
    </PrivateRoute>
  );
}
