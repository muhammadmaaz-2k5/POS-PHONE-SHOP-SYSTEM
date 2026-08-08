# 🚀 Node.js REST API Backend

A professional Node.js REST API built with **Express.js** and **MongoDB (Mongoose)** following the MVC pattern.

---

## 📁 Folder Structure

```
backend/
├── server.js                  # Entry point
├── .env                       # Environment variables (DO NOT COMMIT)
├── .gitignore
├── package.json
└── src/
    ├── app.js                 # Express app setup (middleware, routes)
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── controllers/
    │   ├── authController.js  # Register, Login, GetMe, Logout
    │   └── userController.js  # CRUD operations for users
    ├── middleware/
    │   ├── auth.js            # JWT protect + role authorization
    │   ├── errorHandler.js    # Global error handler
    │   └── validate.js        # express-validator result handler
    ├── models/
    │   └── User.js            # Mongoose User schema
    ├── routes/
    │   ├── authRoutes.js      # /api/auth/*
    │   └── userRoutes.js      # /api/users/* (admin only)
    └── utils/
        ├── asyncHandler.js    # Async wrapper for controllers
        ├── ApiError.js        # Custom error class
        └── sendResponse.js    # Standardized JSON response helper
```

---

## ⚙️ Setup & Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Edit `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/myapp
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   ```

3. **Run in development mode**
   ```bash
   npm run dev
   ```

4. **Run in production**
   ```bash
   npm start
   ```

---

## 📡 API Endpoints

| Method | Endpoint           | Access  | Description           |
|--------|--------------------|---------|-----------------------|
| POST   | /api/auth/register | Public  | Register a new user   |
| POST   | /api/auth/login    | Public  | Login & get JWT token |
| GET    | /api/auth/me       | Private | Get current user      |
| POST   | /api/auth/logout   | Private | Logout                |
| GET    | /api/users         | Admin   | Get all users         |
| GET    | /api/users/:id     | Admin   | Get user by ID        |
| PUT    | /api/users/:id     | Admin   | Update user           |
| DELETE | /api/users/:id     | Admin   | Delete user           |
| GET    | /health            | Public  | Server health check   |

---

## 🔐 Authentication

Use **Bearer Token** in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📦 Tech Stack

- **Express.js** — Web framework
- **MongoDB + Mongoose** — Database & ODM
- **JWT (jsonwebtoken)** — Authentication
- **bcryptjs** — Password hashing
- **helmet** — Security headers
- **cors** — Cross-origin resource sharing
- **morgan** — HTTP request logger
- **express-rate-limit** — Rate limiting
- **express-validator** — Input validation
- **nodemon** — Dev auto-restart
