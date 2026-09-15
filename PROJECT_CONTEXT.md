# PROJECT CONTEXT: North Tech Hub

> **Persistent Long-Term Memory & Source of Truth**  
> *Last Full Audit Date:* 2026-09-15  
> *Initial Status:* Production-Ready / Final Hardening (~85-90% Complete)

---

## 1. Project Overview

- **Name:** North Tech Hub (Production domain: `https://www.northtechhub.in`, repository codename: `Flash` / `sunil-sir-project`)
- **Business Domain:** Dual-model platform combining:
  1. **E-Commerce:** Selling genuine new & certified refurbished electronics (laptops, accessories, mobile gear) across India.
  2. **EdTech Course Marketplace:** Programming, web development, and tech skills courses with modular lessons, video player, and completion tracking.
- **Core Objectives:**
  - High-conversion e-commerce shopping experience with cart/wishlist persistence, flash sales, promo banners, and coupons.
  - Seamless course enrollment, progress tracking, and structured lesson delivery.
  - Razorpay payment gateway integration (supports UPI, cards, net banking, Cash on Delivery for goods).
  - Robust role-based administration for inventory, categories, courses, orders, promotional engines, and sales analytics.
- **User Roles & Personas:**
  - **Visitor / Guest:** Browse catalog, search products/courses, filter, add to local cart/wishlist.
  - **Registered Customer / Student (`role: 'user'`):** Authenticated account, manage shipping addresses, place orders, make payments, track shipments, enroll in courses, view lessons, submit reviews.
  - **Administrator (`role: 'admin'`):** Full operational access with auto-inactivity lock screen, manage inventory, categories, coupons/banners/announcements, update order dispatch status, review analytics, export reports.

---

## 2. Tech Stack

| Layer | Technologies | Key Libraries / Frameworks |
| :--- | :--- | :--- |
| **Monorepo / Package Manager** | npm workspaces | Node.js (>=16), npm (>=8), Concurrently 8.2 |
| **Frontend Framework** | Next.js 16.1.0 (App Router) | React 19.2.3, TypeScript 5 |
| **Frontend Styling** | Tailwind CSS v4 | PostCSS, clsx, tailwind-merge, Lucide React icons |
| **Frontend Animations / Media** | Framer Motion 12.27, Canvas Confetti | Custom HTML5 / YouTube video player, Zoom & Skeletons |
| **Backend Framework** | Node.js + Express.js 4.18.2 | CommonJS (`src/server.js`, `src/app.js`) |
| **Database & ODM** | MongoDB (Atlas / self-hosted) | Mongoose 8.0.3 |
| **Authentication & Security** | JWT (jsonwebtoken 9.0), Passport Google OAuth 2.0, bcryptjs 2.4 | Helmet 7.1, mongo-sanitize, xss-clean, express-rate-limit 7.1, cookie-parser |
| **Payments** | Razorpay 2.9.6 | Razorpay Orders, Signatures (crypto HMAC-SHA256), Webhooks |
| **Media / Storage** | Cloudinary + Multer | `multer-storage-cloudinary`, local static fallback (`/uploads`) |
| **Email & Communications** | Nodemailer 6.9 & Resend 6.9 | Transactional OTPs, order notifications, password resets |
| **Document Generation** | PDFKit 0.17 | PDF invoice generation, analytics PDF exports |
| **Data Visualization & Tools** | Recharts 3.6, react-barcode, qrcode | Admin charts, order receipt barcoding |

---

## 3. Architecture & Monorepo Structure

```
sunil-sir-project/
├── frontend/                # Next.js 16 App Router application
│   ├── app/                 # Route groups: (auth), (courses), (dashboard), (shop)
│   ├── components/          # Reusable UI, layout, home, shop, admin components
│   ├── lib/                 # API client, Contexts, design tokens, hooks, utils
│   ├── public/              # Static assets (images, icons, robots, etc.)
│   └── src/styles/          # globals.css & premium-polish.css
├── backend/                 # Express.js REST API
│   ├── api/                 # Serverless deployment adapter (Vercel)
│   ├── src/
│   │   ├── config/          # db.js, passport.js, cloudinary.js
│   │   ├── controllers/     # Route logic + admin subcontrollers
│   │   ├── middlewares/     # authMiddleware, errorHandler, rateLimiter
│   │   ├── models/          # Mongoose data models
│   │   ├── routes/          # Express route definitions
│   │   ├── scripts/         # DB seeders & admin account initialization
│   │   ├── utils/           # payment.js, sendEmail.js, validateEnv.js
│   │   ├── app.js           # Express app setup, middlewares, mounts
│   │   └── server.js        # Server bootstrapper & graceful shutdown
├── codex-seo/               # Embedded SEO toolchain and audit suite
└── PROJECT_CONTEXT.md       # Primary project memory file (This file)
```

### Architectural Principles
- **Stateless Bearer JWT Authentication:** Auth tokens stored in secure cookies on the client and dispatched via standard `Authorization: Bearer <token>` headers.
- **Dual-Phase Stock & Payment Settlement:** For online payments, stock deduction is deferred until Razorpay signature verification succeeds, preventing negative/dangling inventory. Cash on Delivery (COD) reserves inventory immediately upon order creation.
- **Hybrid Storage for Cart & Wishlist:** Client uses localStorage for high responsiveness and instant guest access, which auto-syncs with MongoDB (`/api/cart/sync` & `/api/wishlist/sync`) once authenticated.
- **Admin Session Hardening:** Admin dashboard features an inactivity timer (15 minutes) backed by `AdminSession` records and HTTP 423 (Locked) responses with client lock screen overlay.

---

## 4. Frontend System

### Routing Structure (App Router)
- **Public Core:**
  - `/` - High-conversion homepage (Hero, Flash Sale, Featured Products, Refurbished Section, Course Showcase, Testimonials, Promo Banners)
  - `/faq`, `/about`, `/contact`, `/shipping`, `/terms`, `/privacy`, `/cookies` - Informational pages
- **Shop Group `app/(shop)`:**
  - `/products` - Full catalog with search, facet filters (brand, category, price, specs, stock), view toggles (grid/list), and sorting
  - `/products/[id]` - Product detail with gallery zoom, specs tabs, warranty/policy tabs, customer reviews & rating breakdown, related items
  - `/cart` - Shopping cart page with quantity management, coupon code input, delivery calculations
  - `/checkout` - Multi-step checkout (Address selection/creation, Payment selection: Razorpay/COD, Order review)
  - `/order-success` - Confirmation receipt with order tracking link and confettis
  - `/wishlist` - User wishlist with direct "Move to Cart" action
- **Courses Group `app/(courses)`:**
  - `/courses` - Course catalog with category filter, skill level filters, rating badges
  - `/courses/[id]` - Course overview page with curriculum outline, learning outcomes, instructor details, enrollment button
  - `/courses/[id]/lessons` - Interactive lesson viewer with video player, resources, and progress checklist
- **Auth Group `app/(auth)`:**
  - `/login` - Credential login + Google OAuth button + redirect memory
  - `/register` - Account registration with password strength meter
  - `/verify-email` - 6-digit OTP verification interface
  - `/forgot-password` & `/reset-password` - OTP-based secure password reset flow
  - `/callback` - Google OAuth callback handler
- **Dashboard Group `app/(dashboard)`:**
  - `/profile` - User profile, personal details, email verification status, address book
  - `/orders` & `/orders/[id]` - Order history and visual milestone delivery tracker
  - `/my-courses` - Enrolled courses with percentage progress bars
  - `/admin` - Unified tabbed administration dashboard:
    - Products management (modal forms, image upload, specs)
    - Orders management (status update, tracking details, print receipt)
    - Course management (curriculum builder, publishing)
    - Promotions management (Banners, Announcements, Coupons, Offers)
    - Category management
    - User management & stats
    - `/admin/analytics` - Financial graphs, sales metrics, CSV/PDF report downloads

### State Management & Context Hierarchy
The root layout wraps the entire app in a robust provider pipeline:
```tsx
<AuthProvider>          {/* User state, token lifecycle, refreshUser */}
  <CartProvider>        {/* Cart items, price calculation, backend sync */}
    <WishlistProvider>  {/* Wishlist items, toggle product, backend sync */}
      <OffersProvider>  {/* Active promos, flash sales, coupon calculations */}
        <ToastProvider> {/* Dynamic notifications (success, error, info) */}
          <Navbar />
          {children}
          <Footer />
        </ToastProvider>
      </OffersProvider>
    </WishlistProvider>
  </CartProvider>
</AuthProvider>
```

### Design System & Styling (`lib/design-system.ts`)
- **Brand Palette:**
  - Primary Electric Blue: `#2563EB` | Deep: `#1D4ED8` | Soft 50: `#EFF6FF`
  - Secondary Pop Blue: `#0EA5E9` | Warm: `#0284C7`
  - Success: `#10B981`, Warning: `#F59E0B`, Error: `#EF4444`
  - Neutrals: Zinc/Slate scale `#0A0A0B` (950) to `#FAFAFA` (50)
- **Typography:**
  - Inter (`--font-inter`): UI body, inputs, secondary text
  - Outfit (`--font-outfit`): Display headings, brand logos, badges
- **Border Radius Standards:** `sm` (12px inputs), `md` (16px buttons), `lg` (20px cards), `xl` (24px modals)

---

## 5. Backend System

### API Architecture
- RESTful Express server hosted via `src/server.js` (with Vercel serverless support in `backend/api/index.js`).
- Strict rate limiting configured via `express-rate-limit`:
  - `authLimiter`: 5 requests / 15 mins (brute-force defense)
  - `paymentLimiter`: 10 requests / 15 mins (payment creation/verification)
  - `adminLimiter`: 300 requests / 15 mins
  - `apiLimiter`: 100 requests / 15 mins (standard endpoints)
- Security middleware pipeline: Helmet (CSP, HSTS), MongoSanitize (NoSQL injection), XSS-Clean, CookieParser, CORS with origin whitelist.

### Middleware Layer
- `protect`: Validates `Authorization: Bearer <token>`, looks up user, ensures account not locked.
- `authorize('admin')`: Restricts endpoint access strictly to users with `role: 'admin'`.
- `optionalAuth`: Extracts user info if token is provided, otherwise continues anonymously (used for tracking announcement dismissals).
- `errorHandler`: Formats Mongoose validation errors, CastErrors, duplicate key errors (11000), and unhandled errors into standardized JSON `{ success: false, message, error }`.

### Authentication & Authorization Logic
- **Registration:** Hashes password with bcrypt (10 rounds), generates User with `isEmailVerified: false`.
- **Email Verification:** Sends 6-digit OTP via Nodemailer/Resend, stored as SHA-256 hash in `EmailVerification` collection with 24-hour TTL.
- **Login Defense:** Max 5 failed attempts locks user account for 15 minutes (`lockUntil` in User schema). Returns HTTP 423.
- **Admin Session Defense:** Tracks admin activity in `AdminSession`. After 15 minutes of idle time, returns HTTP 423, requiring admin password unlock at `/api/admin/auth/unlock`.

---

## 6. Database Schema (Mongoose Models)

| Model | Key Fields | Indexes & Constraints |
| :--- | :--- | :--- |
| **User** | `name`, `email`, `password`, `role` ('user'\|'admin'), `googleId`, `isEmailVerified`, `addresses` array, `loginAttempts`, `lockUntil`, `otp` | Unique `email`, sparse unique `googleId` |
| **Product** | `title`, `description`, `price`, `originalPrice`, `category`, `stock`, `images` [{url, alt}], `specs` (Map), `specifications` (Map), `rating` {average, count}, `policies`, `warranty`, `isFeatured`, `isActive` | Text index on `title`, `description`; compound index on `category`, `price` |
| **Order** | `user` (ref), `orderItems` [{product, title, quantity, price, image}], `shippingAddress`, `paymentInfo` {razorpayOrderId, razorpayPaymentId, razorpaySignature, method, status}, `itemsPrice`, `taxPrice`, `shippingPrice`, `discountPrice`, `coupon` (ref), `totalPrice`, `orderStatus`, `trackingDetails` | Index on `user`, `createdAt`; index on `orderStatus`; index on `paymentInfo.razorpayOrderId` |
| **Course** | `title`, `description`, `price`, `instructor` (ref), `category`, `level`, `thumbnail`, `lessons` [{title, description, videoUrl, duration, order, resources, isFree}], `rating`, `enrolledStudents`, `isPublished` | Text index on `title`, `description`; compound index on `category`, `price` |
| **Enrollment** | `user` (ref), `course` (ref), `contactDetails`, `paymentDetails`, `progress` [{lessonId, completed, completedAt}], `enrolledAt`, `certificateIssued` | Compound unique index on `{user: 1, course: 1}` |
| **Cart** | `user` (ref, unique), `items` [{product (ref), quantity, addedAt}], `updatedAt` | Unique `user` index |
| **Wishlist** | `user` (ref, unique), `products` [ref Product] | Unique `user` index |
| **Category** | `name`, `slug`, `icon`, `image`, `description`, `productCount`, `isActive` | Unique `slug` index |
| **Review** | `product` (ref), `user` (ref), `rating` (1-5), `title`, `comment`, `isVerifiedPurchase`, `helpfulVotes`, `helpfulCount`, `isApproved` | Compound unique index `{product: 1, user: 1}` |
| **Coupon** | `code` (uppercase), `discountType` ('percentage'\|'fixed'), `discountValue`, `maxDiscount`, `minPurchase`, `usageLimit`, `usedCount`, `usedBy`, `startDate`, `endDate`, `isActive` | Unique `code` index; compound index `{isActive: 1, startDate: 1, endDate: 1}` |
| **Offer** | `name`, `type` ('flash_sale'\|'bundle_deal'\|...), `discountType`, `discountValue`, `startDate`, `endDate`, `priority`, `isActive` | Index `{isActive: 1, startDate: 1, endDate: 1}` |
| **Banner** | `title`, `subtitle`, `image`, `mobileImage`, `link`, `buttonText`, `position` ('hero'\|'sidebar'\|'popup'), `priority`, `clickCount`, `viewCount`, `isActive` | Index `{isActive: 1, position: 1, priority: -1}` |
| **Announcement** | `message`, `type`, `icon`, `link`, `backgroundColor`, `textColor`, `position` ('top'\|'bottom'), `isScrolling`, `dismissedBy` | Index `{isActive: 1, position: 1, priority: -1}` |
| **AdminSession** | `user` (ref), `tokenHash`, `lastActivity`, `isLocked`, `deviceInfo`, `ipAddress` | TTL index on `lastActivity` (expires after 86400s) |
| **EmailVerification**| `user` (ref), `email`, `tokenHash` (SHA-256 OTP), `expiresAt`, `isUsed`, `attempts` | TTL index on `expiresAt` |
| **Newsletter** | `email`, `isActive`, `subscribedAt` | Unique `email` |

---

## 7. API Routes Reference

### Auth & User (`/api/auth`)
- `POST /register` - Register standard account
- `POST /login` - Password authentication + lockout check
- `GET /profile` - Retrieve authenticated user profile `[Protected]`
- `PUT /profile` - Update user details `[Protected]`
- `POST /forgot-password` - Request password reset OTP
- `POST /verify-reset-otp` - Validate reset OTP
- `POST /reset-password` - Complete password reset with OTP
- `GET /google` & `GET /google/callback` - Google OAuth authentication
- `POST /profile/address` - Add new address `[Protected]`
- `PUT /profile/address/:id` - Update existing address `[Protected]`
- `DELETE /profile/address/:id` - Delete address `[Protected]`

### Verification (`/api/verification`)
- `POST /send-verification-email` - Trigger OTP to user's email `[Protected]`
- `POST /verify-otp` - Verify 6-digit OTP
- `POST /resend-verification-email` - Resend OTP
- `GET /status` - Check email verification status `[Protected]`

### Products (`/api/products`)
- `GET /` - List/filter/search active products
- `GET /categories` - Get distinct product categories
- `GET /:id` - Get single product details
- `POST /` - Create product `[Admin]`
- `PUT /:id` - Update product `[Admin]`
- `DELETE /:id` - Delete product `[Admin]`

### Orders (`/api/orders`)
- `POST /` - Create new order (validates email verification & items) `[Protected]`
- `POST /:id/verify` - Verify Razorpay payment signature & deduct stock `[Protected]`
- `GET /my-orders` - Get current user order history `[Protected]`
- `GET /:id` - Get order details `[Protected]`
- `GET /` - List all orders `[Admin]`
- `PUT /:id/status` - Update order dispatch / fulfillment status `[Admin]`

### Courses (`/api/courses`)
- `GET /` - List all published courses
- `GET /categories` - Course categories
- `GET /my-courses` - Enrolled courses for user `[Protected]`
- `GET /:id` - Course details with curriculum
- `GET /:id/progress` - Get lesson progress for user `[Protected]`
- `POST /:id/lessons/:lessonId/complete` - Mark lesson as completed `[Protected]`
- `POST /:id/purchase` - Enroll in course (free enrollment or Razorpay order init) `[Protected]`
- `POST /:id/verify-payment` - Verify payment for paid course enrollment `[Protected]`

### Cart & Wishlist (`/api/cart` & `/api/wishlist`)
- `GET /api/cart` - Fetch user's cart `[Protected]`
- `POST /api/cart` - Add or update cart item `[Protected]`
- `PUT /api/cart/:productId` - Update item quantity `[Protected]`
- `DELETE /api/cart/:productId` - Remove cart item `[Protected]`
- `DELETE /api/cart` - Empty cart `[Protected]`
- `POST /api/cart/sync` - Synchronize localStorage cart on login `[Protected]`
- `GET /api/wishlist` - Fetch user's wishlist `[Protected]`
- `POST /api/wishlist/add` & `POST /api/wishlist/toggle` - Toggle item in wishlist `[Protected]`
- `DELETE /api/wishlist/:productId` - Remove from wishlist `[Protected]`
- `POST /api/wishlist/sync` - Synchronize localStorage wishlist on login `[Protected]`

### Promotions (`/api`)
- `GET /banners` - Get active hero/marketing banners
- `POST /banners/:id/click` - Record banner click
- `GET /announcements` - Active header announcements
- `POST /announcements/:id/dismiss` - Dismiss announcement
- `GET /offers` - Active flash sales and category discounts
- `POST /coupons/validate` - Validate coupon for cart amount `[Protected]`
- `POST /coupons/apply` - Apply coupon code to active order `[Protected]`

### Admin Suite (`/api/admin`)
- `GET /analytics/overview` - High-level metrics (sales, users, orders, courses)
- `GET /analytics/revenue` | `/users` | `/products` | `/courses` - Segmented metrics
- `GET /analytics/export/orders` & `/export/users` - CSV data export
- `GET /analytics/export/orders-pdf` & `/export/report-pdf` - PDF document exports
- CRUD endpoints for `/products`, `/courses`, `/orders`, `/categories`, `/users`, `/offers`, `/coupons`, `/banners`, `/announcements` `[Admin]`
- `GET /auth/status`, `POST /auth/unlock`, `POST /auth/lock`, `POST /auth/logout` - Admin session lock control `[Admin]`

### Webhooks & Uploads
- `POST /api/webhooks/razorpay` - Raw body signature verified payment events
- `POST /api/upload/image` & `POST /api/upload/images` - Upload images to Cloudinary / local storage

---

## 8. Current System State

### Capabilities Operational Now
- Full e-commerce browse, search, multi-filter, and detail display.
- Cart and wishlist management with localStorage + MongoDB synchronization.
- Complete order creation and Razorpay checkout flow with signature verification and inventory deduction.
- Email verification system using 6-digit OTPs and SHA-256 hashes (order placement strictly requires verified email).
- Course delivery platform with video player (HTML5 + YouTube embed support), lesson navigation, and progress tracking.
- Dynamic promotional engine: dismissible announcement bar, interactive banner carousels, flash sales with live countdowns, coupon discounts.
- Admin dashboard with 15-minute inactivity lock screen, order status manager, inventory CRUD, and analytics exports.

### Known Issues & Minor Quirks
1. **Login Verification Policy:**
   - Unverified accounts can log in and browse products/courses, but cannot checkout (`orderController.js` blocks them with HTTP 403 `EMAIL_VERIFICATION_REQUIRED`). Login-time blocking can be toggled in `authController.js` if product specifications mandate it.
2. **Razorpay Mock vs Production Keys:**
   - The platform includes automatic mock order generation (`order_mock_...`) when Razorpay test/production keys are not fully configured in `.env`. Production rollout requires setting live credentials (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`).
3. **Orphaned Legacy Directories in `frontend/src`:**
   - `frontend/src/components` and `frontend/src/lib` contain legacy duplications excluded by `tsconfig.json`. Only `frontend/src/styles/` is currently imported.

### Resolved Issues (Fixed on 2026-09-15)
- ✅ **Webhook Stock Deduction Discrepancy:** Added `isStockDeducted` flag to `Order` schema. `webhookController.js:handlePaymentCaptured` now verifies and decrements inventory and updates coupon usage if client verification has not run yet.
- ✅ **Order Cancellation Inventory Inflation:** Added guard in `orderAdminController.js:updateOrderStatus` to restore stock only when `order.isStockDeducted` is true (or order was COD/paid).
- ✅ **Missing Course Authentication:** Added `optionalAuth` middleware to `GET /api/courses/:id` in `courseRoutes.js`, allowing authenticated enrolled students to retrieve full lesson content.
- ✅ **Deleted Duplicate Context File:** Removed `frontend/lib/context/CartContext (1).tsx` and updated `frontend/tsconfig.json`.
- ✅ **React 19 Cascading Render Hooks:** Refactored `useReducedMotion` lazy initialization in `useAccessibility.ts` and switched `useProductDiscount` to `useMemo` in `useOffers.tsx`.

---

## 9. Change Management Rules

To maintain long-term context across all future AI and developer sessions:

### Before Every Task:
1. **ALWAYS read `PROJECT_CONTEXT.md` first.**
2. Use this document as the single source of truth for architectural choices, database models, and existing features.
3. Do not run redundant full-codebase audits.

### After Every Task / Modification:
1. If any feature is added, modified, or removed:
   - Update the relevant sections (API routes, Frontend, Backend, Database schema, Known issues).
2. Append a concise entry to the **Change Log** below following standard conventions (`Added`, `Updated`, `Fixed`, `Removed`).

---

## 10. Change Log

# Change Log

## 2026-09-15

### Fixed
- **Webhook Stock Deduction:** Added `isStockDeducted` to `Order` model and implemented stock deduction & coupon application in `webhookController.js:handlePaymentCaptured`.
- **Cancellation Inventory Inflation:** Prevented false stock replenishment for unverified/abandoned online orders in `orderAdminController.js:updateOrderStatus`.
- **Course Details Authorization:** Mounted `optionalAuth` on `GET /api/courses/:id` in `courseRoutes.js` so logged-in students receive full curriculum access.
- **React 19 Cascading Renders:** Refactored `useAccessibility.ts` (lazy `useState` initialization) and `useOffers.tsx` (`useMemo` for `useProductDiscount`) to eliminate synchronous `setState` in effect roots.

### Removed
- Removed duplicate file `frontend/lib/context/CartContext (1).tsx` and cleaned up `tsconfig.json` exclude list.

### Audited
- Conducted exhaustive deep audit across all backend controllers, routes, utility libraries, test suites, and frontend components.
- Verified backend test suite with Jest (8/8 suites passed, 38/38 tests).
- Verified frontend TypeScript compilation with zero errors.

### Added & Redesigned (UI/UX Transformation inspired by Robocraze)
- **3-Tier Robocraze Header:**
  - **Tier 1 (Utility Bar):** Live announcements, express shipping notice, WhatsApp helpline (`+91 93553 86007`), Order Tracking, Warranty & Assurance links.
  - **Tier 2 (Main Branding & Omnichannel Search):** Stylized North Tech Hub logo, smart category selector dropdown (`All`, `Laptops`, `Accessories`, `Components`, `Courses`), live search auto-suggest with popular tags, user account popover, wishlist badge, cart button with total price (`₹`).
  - **Tier 3 (Category Mega-Navigation):** "Browse All Departments" dropdown, category links with live badges (`Certified`, `Skill Pass`, `HOT`), 7-day replacement guarantee callout.
  - **Mobile Drawer:** Dual-tab navigation (Tech Hardware vs Tech Courses), direct WhatsApp link, profile quick actions.
- **Aesthetic Refinements (Elevated Luxury Tech Styling):**
  - **Zero Emojis Policy:** Replaced all informal emojis in trust badges, category icons, product cards, and checklist items with clean, bespoke stroke-based SVG vector icons.
  - **TrustBadges:** Polished micro-cards with soft slate borders and clean SVG icons (Truck, Shield Check, Refresh, Diploma, WhatsApp).
  - **CategoryGrid:** Squircles with bespoke tech SVG icons (Laptop, Keyboard, RAM Chip, Monitor, Code Terminal, Python AI, Circuit, Lightning Deals).
  - **HeroBanner:** Deep slate-950 luxury aesthetic with ambient lighting and high-contrast typography.
  - **ProductCard & CourseCard:** Clean vector badges, micro-specs pills, warranty tags, and dual CTAs.
  - **RefurbishedSection:** High-contrast brand filter buttons (`All Certified`, `ThinkPad`, `Dell`, `HP`, `Under ₹25k`) + 32-point inspection strip with SVG checkmarks.
  - **FlashSale:** Urgent clearance header with digital countdown blocks (Days, Hours, Mins, Secs) and stock claim progress meters.
  - **CourseShowcase:** Coursera/Frontend Masters style layout with verified diploma badges and project tags.
  - **FeaturedSection:** Flagship product spotlight with responsive fallback and clean best-seller cards.
  - **PromoBanners:** Editorial dual-card layout for Hardware Performance Combos and Career Accelerator Passes.
  - **Testimonials:** Verified buyer proof wall with 5-star rating breakdowns, city tags, and verified purchase chips.
  - **Newsletter:** Sleek VIP Tech Club invitation with instant ₹500 discount voucher (`NORTH500`).
- **taste-skill Anti-Slop Frontend Overhaul:**
  - **Design Read & Dials:** Configured `DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 4`, `VISUAL_DENSITY: 4` for clean, high-conversion commercial tech e-commerce.
  - **Zero Em-Dashes Rule:** Audited and eliminated all em-dashes (`—`) across headlines, body copy, pills, and badges.
  - **Page Theme Lock (Section 4.11):** Eliminated jarring dark-gradient blocks in `FlashSale`, `PromoBanners`, and `Newsletter`. Converted all sections to a unified light-theme canvas with crisp borders (`#e5e7eb`), slate surfaces (`#f8f9fa`), and high-contrast charcoal text (`#202020`).
  - **Shape Consistency Lock (Section 4.4):** Standardized all card containers to `rounded-xl` and interactive controls to `rounded-lg` across the entire application.
  - **Hero Stack Discipline & Viewport Fit (Section 4.7):** Limited hero text stack to 4 essential elements (Eyebrow, 2-line Headline, Subtext ≤ 20 words, Dual CTAs). Relocated duplicate trust micro-strip from inside hero canvas to dedicated `TrustBadges` ribbon below. Reduced hero padding to `py-4 sm:py-6 md:py-8` so CTAs are visible without scrolling.
  - **Eyebrow Restraint (Section 4.7):** Removed repetitive small uppercase tracking badges from `CategoryGrid`, `RefurbishedSection`, `FlashSale`, `CourseShowcase`, `BrandCarousel`, and `Testimonials`.
  - **Split-Header Ban:** Replaced split headers with clean, focused vertical stack headers.

### Added (Dedicated Product Pages for 4 Verticals)
- **Refurbished Laptops (`/refurbished-laptops` & alias `/laptops`):**
  - Dedicated page with custom hero banner, 32-point inspection trust strip (Battery ≥ 80%, 1-Year Warranty, 7-Day Replacement, Free Shipping).
  - Quick brand filter pills (`All Certified`, `ThinkPad`, `Dell Latitude`, `HP EliteBook`, `Apple MacBook`, `Workstations`, `Under ₹25,000`).
  - Search, sort, grid/list view toggles, specs pills, and SEO `CollectionPage` JSON-LD schema.
- **IoT, Robotics & Development Boards (`/iot`):**
  - Dedicated page with custom hero banner, prototyping trust points, and multi-category backend support.
  - Quick sub-filter pills (`All IoT`, `ESP32 & Wi-Fi`, `Raspberry Pi & SBCs`, `Sensors & Modules`, `Robotics & DIY Kits`, `3D Printers & CNC`).
  - Search, sort, grid/list view, specs chips, and SEO `CollectionPage` JSON-LD schema.
- **Computer Accessories (`/computer-accessories` & alias `/accessories`):**
  - Dedicated page with workstation peripherals hero, compatibility badges, and 1-year warranty trust strip.
  - Quick sub-filter pills (`All Accessories`, `Keyboards & Mice`, `USB-C Hubs & Docks`, `GaN Chargers & Cables`, `Storage & Enclosures`, `Stands & Desk Mats`).
  - Seeded 8 realistic high-demand accessory products (`seedAccessories.js`) with complete technical specs, pricing, and images.
- **Online Tech Courses (`/courses`):**
  - Polished courses catalog page with luxury-tech hero banner, breadcrumbs, trust strip, level/category filters, and enrollment flow.
- **Cross-Platform Navigation & Linking:**
  - Updated 3-tier Navbar (department dropdown, quick links with badges, search category filter, mobile menu tabs).
  - Updated `CategoryGrid`, `RefurbishedSection`, `IoTSection`, `HeroBanner`, `Footer`, and `sitemap.ts`.
  - Updated product detail breadcrumbs on `/products/[id]` to dynamically link back to `/refurbished-laptops`, `/iot`, or `/computer-accessories`.
- **Backend Multi-Category Filter Support:**
  - Enhanced `productController.js` `getProducts` to support comma-separated category strings using Mongoose `$in` queries (e.g. `category=iot,raspberry-pi,diy-kits,rfid,drone-kit,3d-printer`).






