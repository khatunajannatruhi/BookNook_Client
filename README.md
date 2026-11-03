# 📚 BookNook – A Small Online Library

**BookNook** is a modern, responsive single-page online library application built with Next.js (App Router), Tailwind CSS, Framer Motion, and BetterAuth-compatible JWT authentication. Users can explore curated book catalogs, add new books, borrow titles for 14 days with real-time copy tracking, and manage their personal library and borrow history.

---

## 🌐 Live Website URL
- **Client Live Site**: [https://booknook-client.vercel.app](https://booknook-client.vercel.app)
- **Backend API**: [https://booknook-server.onrender.com](https://booknook-server.onrender.com)

---

## ✨ Key Features (Minimum 5 Highlights)
1. **Dynamic New Arrivals & Category Catalog**:
   - Interactive Swiper.js banner slider with smooth animations.
   - Live MongoDB-powered latest 6 arrivals sorted dynamically with direct book details access.
   - Organized category exploration (Fiction, Science, History, Kids, Others).

2. **Smart One-Click Borrowing System**:
   - Seamless book borrowing modal with auto-filled user credentials.
   - Automatic 14-day return date calculation.
   - Atomic `$inc` MongoDB decrement for available copies with "Not Available" badge when out of stock.
   - Strict "No Double Borrow" prevention logic to eliminate duplicate active borrows.

3. **Complete Book Management (CRUD)**:
   - Authenticated users can contribute new books with custom cover URLs and quantity tracking.
   - Private "My Books" dashboard allowing users to view, update existing data via pre-filled edit modals, and delete books.
   - Custom SweetAlert2 confirmation dialogs replacing default browser alerts.

4. **Robust Authentication & Private Route Protection**:
   - Secure registration with strict client & server password validation (minimum 6 characters, uppercase, and lowercase required).
   - Seamless email/password login and One-Click Google Social Authentication.
   - Persistent session management ensuring zero redirection to login on route reload.
   - JWT tokens stored in secure httpOnly cookies with Bearer token fallback.

5. **Modern, Accessible & Responsive UI**:
   - Warm literary aesthetic with full Dark Mode & Light Mode toggle saved in localStorage.
   - Fluid Framer Motion entrance animations and hover effects.
   - Custom 404 Not Found page, global loading states, and dynamic browser page titles (`BookNook | ...`).
   - Clean mobile-responsive navigation with hamburger menu and user profile dropdown.

---

## 🛠️ Tech Stack
- **Frontend Framework**: Next.js 16 (App Router)
- **Language**: JavaScript / ES6+
- **Styling**: Tailwind CSS
- **Icons**: React Icons (including updated X branding)
- **Slider**: Swiper.js
- **Animations**: Framer Motion
- **Alerts & Modals**: SweetAlert2 & React Hot Toast
- **HTTP Client**: Axios with credentials
- **State Management**: React Context API (`AuthContext`)

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/khatunajannatruhi/BookNook_Client.git
cd BookNook_Client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=booknook_better_auth_secret_key_2024
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
