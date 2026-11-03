'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import EditBookModal from '@/components/EditBookModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

function MyBooksContent() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBook, setEditBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/books?email=${user.email}`,
        { withCredentials: true }
      );
      setBooks(res.data);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'BookNook | My Books';
    if (user) fetchBooks();
  }, [user]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This book will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
          withCredentials: true,
        });
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch {
        toast.error('Failed to delete book');
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Books</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage books you have added</p>
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="relative h-52 w-full">
                <img
                  src={book.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'}
                  alt={book.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';
                  }}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                  {book.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">by {book.author}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                  Copies: {book.totalCopies}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditBook(book)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            You haven&apos;t added any books yet.
          </p>
        </div>
      )}

      {editBook && (
        <EditBookModal
          book={editBook}
          onClose={() => setEditBook(null)}
          onSuccess={fetchBooks}
        />
      )}
    </motion.div>
  );
}

export default function MyBooksPage() {
  return (
    <PrivateRoute>
      <MyBooksContent />
    </PrivateRoute>
  );
}
