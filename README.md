# E-Commerce + Course Platform

Modern scalable MERN stack monorepo for e-commerce and course platform.

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules / Tailwind CSS
- **State Management**: React Context / Redux Toolkit

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Language**: TypeScript

## Project Structure

```
├── frontend/          # Next.js application
├── backend/           # Express.js API server
└── package.json       # Root workspace configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)

### Installation

```bash
# Install all dependencies
npm install

# Run in development mode (both frontend and backend)
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Environment Variables

See individual README files in `/frontend` and `/backend` for specific environment variables.

## License

MIT
