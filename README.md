LeadFlow CRM A full-stack CRM application for managing client leads from website contact forms.

Tech Stack License

✨ Features Lead Management — Create, read, update, delete leads with full detail views Status Pipeline — Track leads through: New → Contacted → Qualified → Converted / Lost Notes System — Add timestamped notes to any lead, authored by the logged-in user Follow-up Scheduler — Schedule and track follow-up tasks with completion tracking Advanced Filtering — Filter by status, source, priority; full-text search Dashboard Analytics — Status breakdown (pie chart), monthly trend (bar chart), key metrics Secure Admin Access — JWT authentication, role-based access (admin / user) Deal Values — Track estimated deal value per lead; total pipeline value on dashboard Lead Sources — Categorize leads by website, referral, social media, email, cold call 🏗️ Architecture crm/ ├── backend/ # Node.js + Express API │ ├── models/ # Mongoose schemas (User, Lead) │ ├── routes/ # REST API routes │ ├── middleware/ # JWT auth middleware │ └── utils/ # DB seeding └── frontend/ # React SPA └── src/ ├── pages/ # Login, Dashboard, Leads, LeadDetail ├── components/ # Layout, LeadModal ├── context/ # AuthContext └── services/ # Axios API client 🚀 Getting Started Prerequisites Node.js 18+ MongoDB (local or MongoDB Atlas)

Clone & Install
Backend
cd backend npm install cp .env.example .env

Edit .env with your MongoDB URI and JWT secret
Frontend
cd ../frontend npm install 2. Configure Environment Edit backend/.env:

PORT=5000 MONGODB_URI=mongodb://localhost:27017/crm_db JWT_SECRET=your_super_secret_key_here ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=changeme123 3. Start Development

Terminal 1: Backend
cd backend npm run dev

Terminal 2: Frontend
cd frontend npm start The app will open at http://localhost:3000

Default admin credentials:

Email: admin@example.com Password: admin123 (change via .env before production!) 🔌 API Reference Authentication Method Endpoint Description POST /api/auth/login Login and receive JWT GET /api/auth/me Get current user POST /api/auth/register Create user (admin only) GET /api/auth/users List all users (admin only) Leads Method Endpoint Description GET /api/leads List leads (filter: status, source, priority, search) POST /api/leads Create lead GET /api/leads/:id Get lead details PUT /api/leads/:id Update lead DELETE /api/leads/:id Delete lead POST /api/leads/:id/notes Add note DELETE /api/leads/:id/notes/:noteId Delete note POST /api/leads/:id/followups Schedule follow-up PATCH /api/leads/:id/followups/:fId Update follow-up (e.g., mark complete) Dashboard Method Endpoint Description GET /api/dashboard/stats Aggregated pipeline stats 🛡️ Security JWT tokens with configurable expiry Password hashing with bcrypt (12 rounds) Input validation with express-validator Role-based access control (admin vs user) CORS configured for specific origins 🚢 Production Deployment Backend (e.g., Railway, Render, Heroku) Set environment variables in your platform Use MongoDB Atlas for the database npm start Frontend (e.g., Vercel, Netlify) Set REACT_APP_API_URL to your backend URL Update proxy in package.json or configure the API base URL npm run build → deploy the build/ folder 📄 License MIT — free to use and modify for commercial and personal projects.
