'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function BorrowModal({ book, onClose, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleBorrow = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
        {
          bookId: book._id,
          bookTitle: book.title,
          bookImage: book.image,
          userEmail: user.email,
        },
        { withCredentials: true }
      );
      toast.success('Book borrowed successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Confirm Borrow
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You are about to borrow <span className="font-semibold">&quot;{book.title}&quot;</span>
        </p>

        <div className="space-y-3 mb-6">
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">Your Name</label>
            <input
              type="text"
              value={user?.name || ''}
              readOnly
              className="w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">Your Email</label>
            <input
              type="text"
              value={user?.email || ''}
              readOnly
              className="w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBorrow}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Borrowing...' : 'Confirm Borrow'}
          </button>
        </div>
      </div>
    </div>
  );
}
