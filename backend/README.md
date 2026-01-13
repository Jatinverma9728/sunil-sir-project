# Backend API

Express.js + TypeScript backend for e-commerce and course platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Authentication**: JWT

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update environment variables in `.env`

3. Install dependencies (from root):
```bash
npm install
```

4. Run in development mode:
```bash
npm run dev
```

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── models/          # Mongoose models
├── routes/          # API routes
├── middlewares/     # Custom middleware
├── utils/           # Utility functions
├── types/           # TypeScript types/interfaces
└── server.ts        # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT



ok we add email verification, and remove 2fa code onle 2fa related code. add XSS protection on user inputes,
add validatopn on file uploads beyond cloudniry
add CSRF protection.
add jwt refresh token mechanism
add session validations on password change, add logout all device feature.
complete all core featureslike product search , complete review system, shopping cart must be persistent , checkout flow payment integrantion must be complete (for payment we use razorpay payment gateway it prove a screen in that screen we have all payment options), so complete it fully, for course video playback we use telegram or oher things we just showcashe and information demo things on main website.
improve inventory management, improve user expperience gaps, profile management complete wishlist peristence, add email notificaitions,, add advance admin analitics, performance and scalibility must be complpete and well organised,.
ok these are the tasks we want to complete so divide them into phases and complete them pahse by phase   make sure you follow this project audit report, 


