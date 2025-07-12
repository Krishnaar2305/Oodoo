# Skill Swap Platform

## Team Members

- Deepak Saraswat (Leader) – [2023ucs0089@iitjammu.ac.in](mailto:2023ucs0089@iitjammu.ac.in)
- Krishna – [2023uee0140@iitjammu.ac.in](mailto:2023uee0140@iitjammu.ac.in)
- Karan Singla – [2023ucs0097@iitjammu.ac.in](mailto:2023ucs0097@iitjammu.ac.in)
- Shubham Gupta – [2023ucs0113@iitjammu.ac.in](mailto:2023ucs0113@iitjammu.ac.in)

---

## Problem Statement

You are building a full‑stack Skill Swap Platform where users can sign up, list skills they offer or want, browse other users’ profiles, and request skill swaps.

---

## Backend Structure (`/backend`)

```
backend/
├─ controllers/
│  ├─ userController.js      # Signup, login, logout, fetch user details
│  └─ skills_controller.js   # List users by skills, handle swap requests
│
├─ middleware/
│  └─ requireAuth.js         # Protect routes, verify JWT in headers
│
├─ models/
│  └─ userModel.js           # Mongoose schema for User (name, email, password, skills, availability)
│
├─ routes/
│  └─ userRoutes.js          # Defines API endpoints: /login, /signup, /skills, /request-skill, etc.
│
├─ app.js                    # Express app setup, middleware, route registration
├─ package.json              # Dependencies: express, mongoose, dotenv, jsonwebtoken, bcrypt
└─ .gitignore                # Node modules, env files, logs
```

**How it works:**

- `` uses `dotenv` to load `MONGO_URI` from `.env` and connects to MongoDB.
- **Controllers** handle request logic and talk to Mongoose models.
- **Routes** wire controllers to HTTP endpoints.
- **Middleware** ensures protected routes check for a valid JWT.

---

## Frontend Structure (`/src`)

```
src/
├─ components/
│  ├─ Navbar.jsx             # Top navigation, conditional links & logout
│  ├─ ProtectedRoute.jsx     # Redirects unauthenticated users to /login
│  ├─ Login.jsx              # Login form, posts credentials
│  ├─ Signup.jsx             # Signup form with validation
│  ├─ Dashboard.jsx          # User summary: name, email, skills, availability
│  ├─ Browse.jsx             # List other users, filter, pagination, request modal
│  ├─ Requests.jsx           # View incoming swap requests, accept/reject
│  └─ Skills.jsx             # Manage your own skills & availability
│
├─ App.jsx                   # Main router setup, renders Navbar & page routes
├─ index.jsx                 # ReactDOM entry point
└─ index.css                 # Tailwind CSS imports (`@tailwind base; @tailwind components; @tailwind utilities;`)
```

**How it works:**

- Uses **React Router** to navigate `/login`, `/signup`, `/`, `/browse`, `/requests`, `/skills`.
- **ProtectedRoute** wraps all pages except login/signup.
- **Axios** handles HTTP calls to the backend API.
- Tailwind CSS for styling, `react-select` for multi‑select skills, `react-dropzone` for drag‑drop image.

---

## 📆 MongoDB Connection Troubleshooting

If you're encountering the following error when running your Node.js + Mongoose server:

```
MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined".
```

This means your MongoDB URI is not properly loaded into the application. Here’s how to correctly set it up.

---

### ✅ Correct Setup

#### 1⃣ Install Dependencies

Make sure you have the required packages installed:

```bash
npm install mongoose dotenv
```

---

#### 2⃣ Create a `.env` File in Your Project Root

This file should contain your MongoDB URI, like so:

```
MONGO_URI=mongodb://localhost:27017/your-database-name
```

Replace `your-database-name` with your desired MongoDB database name or use your actual cloud URI.

---

#### 3⃣ Load Environment Variables in `server.js`

At the very top of your `server.js` file, require the `dotenv` module to load your environment variables:

```javascript
require('dotenv').config();
```

---

#### 4⃣ Connect to MongoDB Using Mongoose

Use the `MONGO_URI` environment variable when calling `mongoose.connect()`:

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));
```

---

#### 5⃣ (Optional) Debug Environment Variable

If you're still facing issues, log the environment variable to confirm it's being read:

```javascript
console.log('Mongo URI:', process.env.MONGO_URI);
```

If this logs `undefined`, check your `.env` file placement and spelling.

---

## 📌 Notes

- The `.env` file **must be in your project root directory**.
- Do **not commit your **``** file** to version control.
- Always restart your development server after editing environment variables.

---

## ✅ Example Directory Structure

```
project-root/
├── .env
├── server.js
├── package.json
├── node_modules/
└── ...
```

With this setup, your MongoDB connection should work without issues.

