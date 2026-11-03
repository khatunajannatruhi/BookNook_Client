'use client';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = 2026;
  return (
    <footer className="bg-amber-900 dark:bg-gray-900 text-amber-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-3">
              <span>📚</span>
              <span>BookNook</span>
            </Link>
            <p className="text-amber-200 dark:text-gray-400 text-sm leading-relaxed">
              Your cozy corner of the internet for discovering, borrowing, and sharing great books.
              Join our community of readers today.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
            <ul className="space-y-2 text-amber-200 dark:text-gray-400 text-sm">
              <li>📍 123 Library Lane, Book City</li>
              <li>📧 hello@booknook.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>🕐 Mon–Sat: 9 AM – 8 PM</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-amber-800 dark:bg-gray-800 flex items-center justify-center hover:bg-amber-700 dark:hover:bg-gray-700 transition-colors"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-amber-800 dark:bg-gray-800 flex items-center justify-center hover:bg-amber-700 dark:hover:bg-gray-700 transition-colors"
              >
                <FaXTwitter size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-amber-800 dark:bg-gray-800 flex items-center justify-center hover:bg-amber-700 dark:hover:bg-gray-700 transition-colors"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-amber-800 dark:bg-gray-800 flex items-center justify-center hover:bg-amber-700 dark:hover:bg-gray-700 transition-colors"
              >
                <FaLinkedinIn size={16} />
              </a>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-white mb-2">Quick Links</h4>
              <div className="flex flex-wrap gap-2 text-sm text-amber-200 dark:text-gray-400">
                <Link href="/books" className="hover:text-white transition-colors">All Books</Link>
                <span>•</span>
                <Link href="/login" className="hover:text-white transition-colors">Login</Link>
                <span>•</span>
                <Link href="/register" className="hover:text-white transition-colors">Register</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-800 dark:border-gray-700 mt-8 pt-6 text-center">
          <p className="text-amber-300 dark:text-gray-500 text-sm">
            © {currentYear} BookNook. All rights reserved. Made with ❤️ for book lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
