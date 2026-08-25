<div align="center">

# 🏫 CampusConnect
### Full Stack Placement Management System

![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 📌 About

CampusConnect is a full-stack placement management system that connects **students**, **recruiters**, and **college admins** in one platform.

- 🎓 Students browse jobs, upload resumes, and track applications
- 💼 Recruiters post jobs and manage applicants with status updates
- 👑 Admins control recruiter access through an approval workflow
- 🔔 Real-time notifications keep all users updated instantly

---

## 📸 Screenshots

### Login Page
![Login](campusconnect-frontend/screenshots/01-login-page.png.png)

### Browse Jobs
![Browse Jobs](campusconnect-frontend/screenshots/03-jobs-browse.png.png)

### Job Detail
![Job Detail](campusconnect-frontend/screenshots/05-job-detail.png.png)

### Student Profile
![Student Profile](campusconnect-frontend/screenshots/06-student-profile.png.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 JWT Authentication | Secure login with role-based access control |
| 👥 3 User Roles | Student, Recruiter, Admin — each with dedicated dashboard |
| 📄 Resume Upload | Cloudinary-powered PDF upload with snapshot per application |
| 🔍 Full-Text Search | PostgreSQL GIN indexes for fast keyword search |
| 🔔 Real-Time Notifications | Socket.IO with user-specific rooms |
| 📊 Admin Panel | Approve or reject recruiter accounts |
| 📱 Responsive UI | Works on mobile, tablet, and desktop |
| 🛡️ Security | Helmet, CORS, bcrypt, parameterized SQL queries |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| PostgreSQL (raw SQL) | Relational database — no ORM |
| JWT + bcryptjs | Authentication and password hashing |
| Socket.IO | Real-time WebSocket notifications |
| Cloudinary + Multer | Resume file storage |
| Helmet + CORS | Security headers and cross-origin access |

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI library |
| Redux Toolkit | Auth state management |
| Tailwind CSS v4 | Styling and responsive design |
| Axios | HTTP client with JWT interceptors |
| React Router v6 | Client-side routing with protected routes |

---

## 📁 Project Structure

```
campusconnect/
├── campusconnect-backend/
│   ├── src/
│   │   ├── config/        # DB + Cloudinary config
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Raw SQL queries
│   │   ├── routes/        # API endpoints
│   │   ├── middlewares/   # Auth, role, file upload
│   │   ├── services/      # Cloudinary, notifications
│   │   ├── sockets/       # Socket.IO handlers
│   │   └── utils/         # Pagination, token helpers
│   ├── database/
│   │   ├── schema.sql     # All table definitions
│   │   └── seed.sql       # Sample data
│   └── server.js
│
└── campusconnect-frontend/
    └── src/
        ├── api/           # Axios instance
        ├── store/         # Redux store + auth slice
        ├── components/    # Navbar, Spinner, ProtectedRoute
        └── pages/         # All page components
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- Cloudinary free account

### Backend Setup

```bash
cd campusconnect-backend
npm install
```

Create `.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campusconnect
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Run database:
```bash
psql -U postgres -d campusconnect -f database/schema.sql
psql -U postgres -d campusconnect -f database/seed.sql
```

Start server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd campusconnect-frontend
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start app:
```bash
npm run dev
```

Open `http://localhost:5173`

---

## 🧪 Test Accounts

| Role | Email | Password |
|---|---|---|
| 👑 Admin | admin@campusconnect.com | Password123! |
| 🎓 Student | riya.student@campusconnect.com | Password123! |
| 💼 Recruiter | hr@techcorp.com | Password123! |

---

## 📡 Key API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/jobs` | Authenticated |
| POST | `/api/jobs` | Recruiter (approved) |
| POST | `/api/applications/:jobId` | Student |
| GET | `/api/applications/my-applications` | Student |
| GET | `/api/applications/job/:jobId` | Recruiter |
| PATCH | `/api/applications/:id/status` | Recruiter |
| GET | `/api/admin/recruiters/pending` | Admin |
| PATCH | `/api/admin/recruiters/:id/approve` | Admin |

---

## 👩‍💻 Developer

**Riya Priyadarsani Sahu**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/riya-priyadarsani-sahu)
[![Portfolio](https://img.shields.io/badge/Portfolio-%237C3AED.svg?style=for-the-badge&logo=google-chrome&logoColor=white)](https://riya-sahu29.github.io/Portfolio/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:justriya2004@gmail.com)

---

<div align="center">
⭐ Star this repo if you found it helpful!
</div>
