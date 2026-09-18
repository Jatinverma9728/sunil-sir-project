# North Tech Hub (`Flash`)

> **Full-Stack Commercial E-Commerce Storefront & EdTech Course Marketplace**  
> Modern scalable monorepo combining certified electronics retail, hardware prototyping boards, workstation accessories, and online technical skills courses.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16-green?style=flat&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-darkgreen?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-blue?style=flat&logo=razorpay)](https://razorpay.com/)
[![Tests](https://img.shields.io/badge/Tests-8%20Suites%20Passing-brightgreen?style=flat&logo=jest)](https://jestjs.io/)

---

## 1. Overview & Dual Business Model

**North Tech Hub** (`https://www.northtechhub.in`) unites hardware sales and digital learning in a single high-conversion platform:

1. **Hardware E-Commerce Storefront:**
   - **Refurbished Laptops:** Certified enterprise laptops (Lenovo ThinkPad, Dell Latitude, HP EliteBook, Apple MacBook) backed by a 32-point inspection, battery health ≥ 80%, 1-year warranty, and 7-day replacement guarantee.
   - **IoT, Robotics & Prototyping Boards:** Microcontrollers (ESP32, ESP8266), single-board computers (Raspberry Pi), sensors, robotics kits, and 3D printing components.
   - **Computer & Workstation Accessories:** Mechanical keyboards, precision mice, GaN fast chargers, USB-C docks, NVMe enclosures, and ergonomic desk stands.
2. **EdTech Course Marketplace (LMS):**
   - Self-paced video courses covering full-stack web development, Python, IoT, and embedded systems.
   - Curriculum syllabus explorer, video lesson viewer, downloadable resources, progress completion checklists, and student diplomas.

---

## 2. Key Platform Features

- **3-Tier Commercial Navigation:** Inspired by leading electronics retailers, featuring live announcement tickers, smart category search auto-suggest, department mega-menus, and mobile dual-tab drawer navigation.
- **Dedicated Vertical Catalog Pages:** Specialized landing pages with tailored facets, brand filter pills, and SEO `CollectionPage` JSON-LD schemas:
  - `/refurbished-laptops` (alias `/laptops`)
  - `/iot`
  - `/computer-accessories` (alias `/accessories`)
  - `/courses`
- **Hybrid Cart & Wishlist:** Client-side local storage persistence for instantaneous guest browsing, automatically synchronizing with MongoDB upon authentication.
- **Razorpay Payments & COD:** Native Razorpay integration supporting UPI, Net Banking, credit/debit cards, and Cash on Delivery with dual-phase atomic stock deduction and post-payment webhook reconciliation.
- **Role-Based Admin Control Center:** Tabbed dashboard for catalog management, stock replenishment, promotional campaigns (coupons, banners, announcements), order dispatch tracking, and PDFKit sales analytics exports.
- **Security & Session Hardening:** Stateless Bearer JWT tokens, Google OAuth 2.0, 15-minute administrative inactivity lock screen, Helmet CSP headers, NoSQL query sanitization, and express rate-limiting.

---

## 3. Technology Stack

### Frontend Application (`frontend/`)
- **Framework:** Next.js 16.1.0 (App Router, Turbopack)
- **UI Library:** React 19.2.3 with TypeScript 5
- **Styling:** Tailwind CSS v4 with `@tailwindcss/postcss`
- **Icons & Animation:** Lucide React (`0.563.0`) & Framer Motion (`12.27.1`)
- **State Management:** React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `AdminAuthContext`, `ToastContext`)
- **Data Visualization & Media:** Recharts (`3.6.0`), Canvas Confetti, and `react-barcode`

### Backend REST API (`backend/`)
- **Runtime & Server:** Node.js (`>=16.0.0`) + Express.js 4.18.2 (CommonJS)
- **Database & ODM:** MongoDB Atlas with Mongoose 8.0.3
- **Authentication:** JWT (`jsonwebtoken 9.0`), Passport.js Google OAuth 2.0, bcryptjs
- **Payments:** Razorpay Node SDK 2.9.6 (Orders API, HMAC-SHA256 signature verification)
- **Email Delivery:** Resend 6.9.4 & Nodemailer 6.9.8
- **Media Storage:** Cloudinary with Multer integration and local disk fallback
- **Document Generation:** PDFKit 0.17.2 for automated invoice and report generation
- **Test Suite:** Jest 30.2.0 + Supertest 7.2.2

---

## 4. Repository Structure

```
sunil-sir-project/
├── frontend/                          # Next.js 16 App Router application
│   ├── app/                           # Route groups: (auth), (courses), (dashboard), (shop)
│   ├── components/                    # UI, layout, home sections, product cards, admin panels
│   ├── lib/                           # Typed API clients, Context providers, hooks, design tokens
│   ├── public/                        # Static assets, logos, favicons
│   └── src/styles/                    # Tailwind CSS v4 (globals.css)
├── backend/                           # Express.js REST API
│   ├── api/                           # Vercel serverless deployment adapter
│   ├── src/
│   │   ├── config/                    # MongoDB (db.js), Passport OAuth, Cloudinary
│   │   ├── controllers/               # Route logic + admin sub-controllers
│   │   ├── middlewares/               # authMiddleware, errorHandler, rateLimiter
│   │   ├── models/                    # Mongoose data models (16 collections)
│   │   ├── routes/                    # Express REST route definitions
│   │   ├── scripts/                   # Database seeders (seedAccessories, seedNorthTechHub)
│   │   ├── utils/                     # payment.js, email.js, validateEnv.js
│   │   ├── app.js                     # Express app setup, CORS, Helmet, rate limiters
│   │   └── server.js                  # Server listener & database connector
│   └── __tests__/                     # Jest backend test suites (8 test suites)
├── codex-seo/                         # Embedded SEO audit toolchain
├── docs/
│   └── DEVELOPMENT_AUDIT.md           # Official chronological development ledger
├── PROJECT_CONTEXT.md                 # Primary architecture & codebase source of truth
└── package.json                       # Monorepo root workspace configuration
```

---

## 5. Getting Started

### Prerequisites
- **Node.js:** `>=18.0.0` (LTS recommended)
- **npm:** `>=8.0.0`
- **MongoDB:** Local MongoDB instance or free MongoDB Atlas cluster URI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jatinverma9728/sunil-sir-project.git
   cd sunil-sir-project
   ```

2. **Install all workspace dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables:**
   - Create `backend/.env` using `backend/.env.example` as a template:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Create `frontend/.env.local`:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     NEXT_PUBLIC_SITE_URL=http://localhost:3000
     NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
     ```

4. **Seed Database (Optional but Recommended):**
   ```bash
   # Seed catalog products, laptops, and initial categories
   cd backend && node src/scripts/seedNorthTechHub.js

   # Seed computer accessories
   node src/scripts/seedAccessories.js

   # Create default administrator account
   node src/scripts/createAdmin.js
   cd ..
   ```

5. **Start Development Environment:**
   ```bash
   # Run both frontend and backend concurrently
   npm run dev
   ```
   - **Frontend:** `http://localhost:3000`
   - **Backend API:** `http://localhost:5000/api`
   - **Health Check:** `http://localhost:5000/health`

---

## 6. Available Scripts

| Command | Workspace | Description |
| :--- | :--- | :--- |
| `npm run dev` | Root | Concurrently runs frontend (`Turbopack`) and backend (`Nodemon`) |
| `npm run dev:frontend` | Frontend | Runs Next.js development server on port 3000 with Turbopack |
| `npm run dev:backend` | Backend | Runs Express backend API on port 5000 with Nodemon |
| `npm run build` | Root | Compiles production bundles for frontend and backend |
| `npm run start` | Backend | Boots backend production server (`node src/server.js`) |
| `npm run install:all` | Root | Installs dependencies across all monorepo workspaces |

### Verification & Testing Commands

```bash
# Verify frontend TypeScript compilation (0 errors)
cd frontend && npx tsc --noEmit

# Run backend Jest test suites (8 suites, 38 tests passing)
cd backend && npm test

# Run backend tests with coverage report
cd backend && npm run test:coverage
```

---

## 7. Environment Variables Reference

### Backend (`backend/.env`)

```text
# REQUIRED
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=<minimum 32 characters, 64 recommended for production>
RESEND_API_KEY=re_<your_resend_api_key>
EMAIL_FROM="North Tech Hub <noreply@northtechhub.in>"

# RECOMMENDED / INTEGRATIONS
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=<your_razorpay_secret>
RAZORPAY_WEBHOOK_SECRET=<your_webhook_secret>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Frontend (`frontend/.env.local`)

```text
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
```

---

## 8. Project Documentation & Audit Ledger

- **Architecture & System Specification:** See [PROJECT_CONTEXT.md](file:///c:/Users/somve/Desktop/projects/Working%20real%20projects/web/sunil-sir-project/PROJECT_CONTEXT.md) for complete entity-relationship diagrams, API specifications, component architectures, and AI operating rules.
- **Development Audit Ledger:** See [docs/DEVELOPMENT_AUDIT.md](file:///c:/Users/somve/Desktop/projects/Working%20real%20projects/web/sunil-sir-project/docs/DEVELOPMENT_AUDIT.md) for the official, evidence-based chronological history of all repository-level development tasks.

---

## 9. License

This project is licensed under the [MIT License](LICENSE).
