# FUTURE_FS_02 - Client Lead Management System (Mini CRM)

## 📌 Project Overview

This project is a Secure Full Stack Client Lead Management System (Mini CRM) developed under the Full Stack Web Development (FS) track.

The application allows an admin to manage client leads generated from website contact forms. It includes authentication, protected routes, dashboard analytics, and full CRUD functionality.

---

## 🚀 Features

- 🔐 Secure Admin Login (JWT Authentication)
- 🛡️ Protected API Routes
- ➕ Add New Leads
- 📋 View All Leads
- ✏️ Update Lead Status (New / Contacted / Converted)
- ❌ Delete Leads
- 📊 Dashboard Statistics (Total, New, Contacted, Converted)
- 🎨 Modern Responsive UI
- 🔓 Logout Functionality

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript (Vanilla JS)

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

### Authentication
- JSON Web Token (JWT)
- bcryptjs (Password Hashing)

---

## 📂 Project Structure
mini-crm/
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│
├── frontend/
│ ├── login.html
│ ├── index.html
│ ├── script.js
│ ├── style.css
│
└── README.md

---

## 🔐 Authentication Flow

1. Admin registers once.
2. Admin logs in via login page.
3. JWT token is generated.
4. Token is stored in localStorage.
5. All API requests include Authorization header.
6. Protected routes verify token before granting access.

---

## 📊 Lead Status Workflow

- **New** → Initial lead
- **Contacted** → Follow-up completed
- **Converted** → Successfully converted client

Dashboard dynamically updates based on lead status.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
git clone https://github.com/prashantmalagi/FUTURE_FS_02.git

### 2️⃣ Install Backend Dependencies
cd backend
npm install

### 3️⃣ Start MongoDB

Make sure MongoDB is running locally.

### 4️⃣ Run Backend Server

### 3️⃣ Start MongoDB

Make sure MongoDB is running locally.

### 4️⃣ Run Backend Server
node server.js

Server runs on:
http://localhost:5000

### 5️⃣ Open Frontend

Open:
frontend/login.html

---

## 👤 Default Admin Credentials
Username: admin
Password: admin123

---

## 🎯 Learning Outcomes

- CRUD operations
- REST API development
- Backend integration
- Database management
- JWT authentication
- Middleware implementation
- Business workflow handling
- Full Stack project structure

---

## 📌 Submission Details

Track Code: **FS**  
Repository Name: **FUTURE_FS_02**

---

## 👨‍💻 Developed By

Prashanth Malagi  
Full Stack Web Development Track








