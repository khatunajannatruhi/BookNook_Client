'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BookCard({ book }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
    >
      <div className="relative h-52 w-full">
        <img
          src={book.image || 'https://i.ibb.co/2kR5zq0/User-avatar-svg.png'}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
          {book.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">{book.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">by {book.author}</p>
        <Link
          href={`/books/${book._id}`}
          className="block text-center bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors font-medium"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
