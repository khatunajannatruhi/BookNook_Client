'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import BookCard from '@/components/BookCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiSearch, FiBookOpen, FiRefreshCw } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'BookNook | Your Online Library';
    const fetchBooks = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/books?sort=createdAt&order=desc&limit=6`
        );
        setBooks(res.data);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const slides = [
    {
      title: 'Discover Your Next Favorite Book',
      desc: 'Explore thousands of titles across every genre. From timeless classics to the latest bestsellers.',
      bg: 'from-amber-700 via-amber-800 to-amber-900',
    },
    {
      title: 'Borrow Books with a Single Click',
      desc: 'Our digital library makes it simple to borrow and return books — no late fees, no hassle.',
      bg: 'from-emerald-700 via-emerald-800 to-emerald-900',
    },
    {
      title: 'Share Your Collection with the World',
      desc: 'Add your favorite books and let others enjoy them. Build a community of passionate readers.',
      bg: 'from-indigo-700 via-indigo-800 to-indigo-900',
    },
  ];

  const steps = [
    { icon: <FiSearch size={32} />, title: 'Browse', desc: 'Explore our curated collection of books across different categories.' },
    { icon: <FiBookOpen size={32} />, title: 'Borrow', desc: 'Found a book you like? Borrow it instantly with one click.' },
    { icon: <FiRefreshCw size={32} />, title: 'Return', desc: 'Done reading? Return it so others can enjoy it too.' },
  ];

  const categories = [
    { name: 'Fiction', icon: '📖', desc: 'Novels, short stories, and literary masterpieces' },
    { name: 'Science', icon: '🔬', desc: 'Explore the wonders of science and technology' },
    { name: 'History', icon: '🏛️', desc: 'Journey through the ages and great civilizations' },
    { name: 'Kids', icon: '🧒', desc: 'Fun and educational books for young readers' },
    { name: 'Others', icon: '📚', desc: 'Self-help, cooking, travel, and much more' },
  ];

  return (
    <div>
      {/* Banner / Slider */}
      <section className="w-full">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          className="w-full"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className={`bg-gradient-to-r ${slide.bg} py-24 md:py-36 px-4`}>
                <div className="max-w-3xl mx-auto text-center text-white">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl font-bold mb-4"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl mb-8 text-white/90"
                  >
                    {slide.desc}
                  </motion.p>
                  <Link
                    href="/books"
                    className="inline-block bg-white text-amber-800 font-semibold px-8 py-3 rounded-xl hover:bg-amber-50 transition-colors shadow-lg"
                  >
                    Browse Books
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
            New Arrivals
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
            Check out the latest additions to our library
          </p>
        </motion.div>

        {loading ? (
          <LoadingSpinner />
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No books found yet. Be the first to add one!</p>
        )}

        <div className="text-center mt-10">
          <Link
            href="/books"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-3 rounded-xl transition-colors shadow"
          >
            See All Books
          </Link>
        </div>
      </section>

      {/* How Borrowing Works */}
      <section className="bg-amber-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              How Borrowing Works
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
              Three simple steps to get your favorite book
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Step {i + 1}: {step.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
            Top Categories
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
            Find books in your favorite genre
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
