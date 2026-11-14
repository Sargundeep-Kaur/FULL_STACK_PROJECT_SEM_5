# ⚡ TaskFlow – Smart Task Manager (MERN Stack)

TaskFlow is a full-stack task management application built with the **MERN** stack (**M**ongoDB, **E**xpress, **R**eact, **N**ode.js) featuring a dark glassmorphism UI, JWT authentication, and real-time task filtering and progress tracking.

---

## ✨ Features

- **Authentication & Security**: User registration and login with JWT tokens and `bcryptjs` password hashing.
- **Task CRUD**: Create, view, edit, and delete tasks with title, description, priority, category, status, and due date.
- **One-Click Status Cycling**: Click any task's status chip (`To Do` → `In Progress` → `Done`) to update progress immediately.
- **Smart Filtering & Search**: Filter tasks by status, priority (`low`, `medium`, `high`), category (`work`, `personal`, `health`, `learning`, `other`), and keyword search.
- **Live Progress Dashboard**: Real-time statistics and overall completion percentage bar.

---

## 📁 Project Structure

```text
FULL_STACK_PROJECT/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── api/axios.js
    │   ├── components/
    │   │   ├── FilterBar.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── TaskCard.jsx
    │   │   └── TaskModal.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** running locally on `mongodb://localhost:27017/taskflow` (or a MongoDB Atlas URI in `backend/.env`)

### 1. Configure Backend Environment

Check `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=taskflow_super_secret_jwt_key_2024
NODE_ENV=development
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Run the Application

Start the backend API server (runs on `http://localhost:5000`):

```bash
cd backend
npm run dev
```

In a new terminal, start the frontend Vite server (runs on `http://localhost:5173`):

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.
