# 🌟 Surplus Spark Network

**A full-stack platform connecting food/resource donors with NGOs, streamlined by logistics partners and managed by admins — with AI-powered classification, live maps, and more.**

---

## 📖 Table of Contents

- [What is this project?](#what-is-this-project)
- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Overview](#api-overview)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## What is this project?

Surplus Spark Network is a web application that bridges the gap between people who have surplus food or resources and NGOs that need them. The platform handles the entire lifecycle:

1. **Donors** list surplus items (food, clothing, medicine, etc.)
2. **NGOs** browse and claim available items
3. **Logistics Partners** pick up and deliver the items
4. **Admins** oversee the entire ecosystem

It is built with a **React + TypeScript** frontend and a **Node.js + Express + MongoDB** backend.

---

## Live Demo

> Coming soon / Replace with your deployed URL

---

## Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Classification** | Upload a photo — AI auto-detects item category, unit & storage tips |
| 🗺️ **Google Maps Integration** | Live location detection, pickup/delivery tracking, route optimization |
| 🔔 **Real-time Notifications** | In-app alerts for donation status changes |
| 🏆 **Leaderboard** | Gamified donor rankings based on activity |
| 📄 **Tax Receipts (80G)** | Auto-generated PDF tax receipts for eligible donations |
| 💬 **AI Chatbot** | Powered by OpenAI — answers donor/NGO queries instantly |
| 🪪 **Aadhaar Verification** | Mock Aadhaar-based identity verification flow |
| 📊 **Admin Dashboard** | Full analytics, complaint management, advertisement control |
| 🌓 **Dark / Light Mode** | Persistent theme with smooth transitions |
| 📱 **Fully Responsive** | Optimized for mobile, tablet, and desktop |
| 💳 **Monetary Donations** | NGOs can accept monetary contributions as well |
| 📣 **Complaint & Feedback System** | Users can raise complaints; admins moderate them |

---

## User Roles

```
┌─────────────┐     lists surplus      ┌──────────────────┐
│    Donor    │ ──────────────────────► │  Surplus Listing  │
└─────────────┘                         └──────────────────┘
                                                 │
                                          NGO claims item
                                                 │
                                                 ▼
┌─────────────┐     delivers item      ┌──────────────────┐
│  Logistics  │ ◄────────────────────── │      NGO          │
└─────────────┘                         └──────────────────┘
       │
       ▼
┌─────────────┐
│    Admin    │  — monitors everything, manages ads & complaints
└─────────────┘
```

| Role | What they can do |
|---|---|
| **Donor** | Add surplus items, track donations, view tax receipts, see leaderboard |
| **NGO** | Browse & claim surplus, track pickups on map, manage requests |
| **Logistics** | View assigned deliveries, optimize routes, mark tasks complete |
| **Admin** | Full platform control — users, ads, complaints, analytics |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Shadcn/ui + Radix UI | Accessible component library |
| React Query | Server state management |
| React Hook Form + Zod | Form handling & validation |
| Google Maps JS API | Maps & geolocation |
| Hugging Face API | AI image classification |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| OpenAI API | Chatbot |
| Twilio | SMS notifications |
| PDFKit | Tax receipt generation |
| express-rate-limit | API rate limiting |

---

## Project Structure

```
surplus-spark-network/
├── frontend/                  # React app (Vite)
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── admin/         # Admin-specific components
│       │   ├── donor/         # Donor-specific components
│       │   ├── ngo/           # NGO-specific components
│       │   ├── logistics/     # Logistics-specific components
│       │   └── ui/            # Shadcn base components
│       ├── pages/
│       │   ├── dashboards/    # Role dashboards
│       │   ├── Auth.tsx       # Login / Register
│       │   ├── Landing.tsx    # Public homepage
│       │   └── RoleSelection.tsx
│       ├── hooks/             # Custom React hooks
│       ├── lib/               # Utilities (AI, Maps, etc.)
│       └── types/             # TypeScript types
│
└── backend/                   # Express API
    └── src/
        ├── controllers/       # Route logic
        ├── models/            # Mongoose schemas
        ├── routes/            # API routes
        ├── middleware/        # Auth middleware
        ├── utils/             # Helpers (JWT, PDF, SMS…)
        └── scripts/           # DB seed scripts
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/atlas))
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/surplus-spark-network.git
cd surplus-spark-network
```

### 2. Install dependencies

Install both frontend and backend dependencies:

```bash
# Backend
cd backend
npm install

# Frontend (open a new terminal)
cd frontend
npm install
```

---

## Environment Variables

### Backend — create `backend/.env`

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/surplus-spark
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/surplus-spark

# JWT — generate a strong random secret:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_generated_secret_here

# Optional: Twilio (SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Optional: OpenAI (Chatbot)
OPENAI_API_KEY=your_openai_key
```

### Frontend — create `frontend/.env`

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Optional: Hugging Face (AI image classification)
VITE_HUGGING_FACE_API_KEY=your_hugging_face_key
```

> **Never commit `.env` files to Git.** They are already listed in `.gitignore`.

---

## Running the App

### Development mode

Open **two separate terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
API will be running at `http://localhost:3000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
App will open at `http://localhost:5173`

### Seed the database (optional but recommended)

```bash
cd backend
npm run seed:aadhaar   # Seeds mock Aadhaar data for testing
npm run seed:80g       # Seeds NGO 80G tax data
```

### Production build

```bash
# Build frontend
cd frontend
npm run build

# Build & start backend
cd backend
npm run build
npm run serve
```

---

## API Overview

All endpoints are prefixed with `/api`.

| Module | Base Route | Description |
|---|---|---|
| Auth | `/api/auth` | Register, login, OTP |
| Donors | `/api/donors` | Donor profile & surplus |
| NGOs | `/api/ngo` | NGO profile & requests |
| Logistics | `/api/logistics` | Task & route management |
| Admin | `/api/admin` | Platform management |
| Donations | `/api/donations` | Monetary donations |
| Notifications | `/api/notifications` | In-app alerts |
| Complaints | `/api/complaints` | Complaint system |
| Feedback | `/api/feedback` | User feedback |
| Chatbot | `/api/chatbot` | AI chatbot |
| Leaderboard | `/api/leaderboard` | Donor rankings |
| Advertisements | `/api/advertisements` | Sponsor ads |
| Aadhaar | `/api/aadhaar` | Identity verification |

---

## Screenshots

> Add screenshots of your app here.

```
Landing Page → Role Selection → Dashboard
```

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Commit message convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve a bug
docs: update documentation
style: formatting changes
refactor: code restructure without feature change
```

---

## License

This project is licensed under the **ISC License**. See [LICENSE](LICENSE) for details.

---

<div align="center">
  Made with ❤️ to reduce waste and feed communities
</div>
