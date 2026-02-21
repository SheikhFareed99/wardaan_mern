# Wardaan MERN

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application.

## Project Structure

```
wardaan_mern/
├── backend/   # Express + MongoDB REST API
└── frontend/  # React (Vite) storefront & admin UI
```

---

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `backend/.env` and set every variable:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail address used by Nodemailer |
| `EMAIL_PASS` | Gmail App Password for Nodemailer |
| `CORS_ORIGIN` | Allowed CORS origin (e.g. `http://localhost:5173` for dev) |
| `ADMIN_EMAIL` | Email address for the admin account |
| `ADMIN_PASSWORD` | Password for the admin account |

### 3. Create the admin account

The admin account is created (or reset) by the one-time seed script.
Make sure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `backend/.env`, then run:

```bash
# from the backend/ directory
npm run seed:admin
```

You should see:

```
Connected to MongoDB
Admin account created for: admin@example.com
Done.
```

> **Re-running the script** with a new password will update the existing admin account.

### 4. Start the server

```bash
# development (auto-restart with nodemon)
npm run dev

# production
npm start
```

The API will be available at `http://localhost:5000` by default.

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Admin Login

1. Navigate to `/AdminLogin` in your browser.
2. Enter the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in `backend/.env`.
3. On success you will be redirected to the Admin Dashboard.

> The admin account must be created with `npm run seed:admin` (see above) before you can log in.
