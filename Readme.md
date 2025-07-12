# Skill Swap Platform

A full-stack platform where users can sign up, list skills they offer or want, browse other users’ profiles, and request skill swaps.

---

## 👥 Team Members

* Deepak Saraswat – [2023ucs0089@iitjammu.ac.in](mailto:2023ucs0089@iitjammu.ac.in)
* Krishna – [2023uee0140@iitjammu.ac.in](mailto:2023uee0140@iitjammu.ac.in)
* Karan Singla – [2023ucs0097@iitjammu.ac.in](mailto:2023ucs0097@iitjammu.ac.in)
* Shubham Gupta – [2023ucs0113@iitjammu.ac.in](mailto:2023ucs0113@iitjammu.ac.in)

---

## 📖 Problem Statement

Build a full-stack Skill Swap Platform where users can:

* Register and login
* List the skills they offer and skills they want to learn
* Browse other users by skill and availability
* Request and manage skill swap requests

---

## 📦 Server Structure (`/server`)

```
server/
├── controllers/
│   ├── userController.js
│   └── skills_controller.js
├── middleware/
│   └── requireAuth.js
├── models/
│   └── userModel.js
├── routes/
│   └── userRoutes.js
├── app.js
├── package.json
├── .env.example
└── .gitignore
```

* **Express** with **Mongoose** for backend and MongoDB connection
* JWT authentication for secure routes
* Controllers handle API logic, connected via routes
* Environment variables configured via `.env`

---

## 🎨 Client Structure (`/client`)

```
client/
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Browse.jsx
│   ├── Requests.jsx
│   └── Skills.jsx
├── App.jsx
├── index.jsx
├── index.css
└── package.json
```

* React + React Router for frontend routing
* Axios for API calls
* Tailwind CSS for styling

---

## ⚙️ Environment Setup

### 1️⃣ Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2️⃣ Create `.env` file in `server/`

```
MONGO_URI=mongodb://localhost:27017/skill-swap
ACCESS_TOKEN_SECRET= your access token secret
REFRESH_TOKEN_SECRET= your refresh token secret
RESET_TOKEN_SECRET= your reset token secret
PORT=4000
```

> ⚠️ **Note:** Do not commit this `.env` to version control. Use `.env.example` as a template.

### 3️⃣ Run MongoDB locally or set your cloud URI.

---

## 🚀 How to Run

### Server

```bash
cd server
npm run dev
```

Server runs at `http://localhost:4000/`

### Client

```bash
cd client
npm run dev
```

Client runs at `http://localhost:5173/`

---

## 🛠️ Features

* User Authentication (JWT)
* Manage Offered and Wanted Skills
* Browse User Profiles with Search & Filter
* Request Skill Swaps
* Accept/Reject Swap Requests

---

## 📌 Notes

* `.env` file should **not** be included in the repo.
* Include a `.env.example` to indicate required environment variables.
* Restart the server after modifying `.env`

---

## ✅ Example Directory Structure

```
project-root/
├── server/
│   ├── .env.example
│   ├── app.js
│   └── ...
├── client/
│   ├── src/
│   └── ...
```

---

## 📃 License

© 2024 IIT Jammu Skill Swap Team. All rights reserved.
