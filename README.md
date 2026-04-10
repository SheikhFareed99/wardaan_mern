# Wardaan — MERN E-Commerce Platform

Wardaan (vardaanswear.pk) is a full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). It supports product browsing, order placement, order tracking, admin management, finance tracking, and an Instagram product catalog feed.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Admin Panel](#admin-panel)
- [Instagram Catalog Feed](#instagram-catalog-feed)

---

## Features

- 🛍️ Browse products by category
- 📄 Product detail pages with images and discount pricing
- 🛒 Shopping cart and checkout
- 📦 Order placement and confirmation
- 🔍 Order tracking by order ID
- 🔐 Admin authentication (JWT-based)
- 🗂️ Admin dashboard: manage products, orders, and finances
- 💸 Expenditure tracking and finance management
- 🏷️ Discount code support
- ☁️ Image uploads via Cloudinary
- 📧 Email notifications via Nodemailer
- 📊 Instagram product catalog CSV feed (`/feed/products.csv`)

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS, Redux Toolkit, React Router v6, Framer Motion, Axios |
| Backend   | Node.js, Express 5, Mongoose, JWT, Bcrypt, Multer, Cloudinary, Nodemailer |
| Database  | MongoDB                                         |

---

## Project Structure

```
wardaan_mern/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models (Product, Order, Admin, Invoice, Expenditure, DiscountCode, Feedback)
│   ├── routes/          # API routes
│   ├── cloudinaryConfig.js
│   └── server.js        # Entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/  # React pages & UI components
        ├── router/      # Route helpers
        ├── store/       # Redux store & slices
        ├── App.jsx
        └── main.jsx
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- A MongoDB connection string (MongoDB Atlas or local)
- A Cloudinary account
- An email account for Nodemailer

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the App

**Development**

```bash
# Start backend (with nodemon)
cd backend
npm run dev

# Start frontend (in a separate terminal)
cd frontend
npm run dev
```

**Production**

```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

The backend runs on `http://localhost:5000` and the frontend dev server on `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| GET    | `/api/products`              | List all products              |
| POST   | `/api/products`              | Add a product (admin)          |
| GET    | `/api/products/:id`          | Get a single product           |
| PUT    | `/api/products/:id`          | Update a product (admin)       |
| DELETE | `/api/products/:id`          | Delete a product (admin)       |
| GET    | `/api/orders`                | List all orders (admin)        |
| POST   | `/api/orders`                | Place a new order              |
| GET    | `/api/orders/:id`            | Track an order                 |
| PUT    | `/api/orders/:id`            | Update order status (admin)    |
| POST   | `/api/admin/login`           | Admin login                    |
| GET    | `/api/admin/protected/...`   | Protected admin routes (JWT)   |
| GET    | `/api/finance`               | Finance summary (admin)        |
| GET    | `/api/expenditures`          | List expenditures (admin)      |
| POST   | `/api/expenditures`          | Add expenditure (admin)        |
| GET    | `/feed/products.csv`         | Instagram catalog CSV feed     |

---

## Admin Panel

Navigate to `/AdminLogin` to log in as an admin. After authentication you can access:

- `/AdminDashboard` — Overview
- `/ProductManagment` — Add, edit, and delete products
- `/OrdersManagment` — View and update orders
- `/FinanceManagment` — Revenue, expenditures, and profit tracking

---

## Instagram Catalog Feed

The endpoint `GET /feed/products.csv` returns a CSV file compatible with the Meta/Instagram Commerce product catalog format, including fields: `id`, `title`, `description`, `availability`, `price`, `discount_percentage`, `discounted_price`, `link`, and `image_link`.
