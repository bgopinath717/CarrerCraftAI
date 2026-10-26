# CareerCraft AI
### ATS-Friendly Resume, Portfolio, Cover Letter and Career Recommendation Platform

> **Developed by:** B. Gopinath  
> **Tagline:** *“Build Your Career. Get Noticed.”*  
> **Supporting Tagline:** *“Create ATS-friendly resumes, professional portfolios, personalized cover letters, and smarter career plans — all in one place.”*

---

## 🌟 Project Overview

**CareerCraft AI** is a production-level, modern, and responsive full-stack platform built for students, freshers, and job seekers. It brings together all essential career preparation workflows into a unified, high-performance SaaS platform:

1. **ATS-Friendly Resume Builder**: Dual-pane real-time editor with 4 professional ATS-optimized templates (Modern ATS, Minimal Classic, Tech Pro, Executive), AI bullet polish, and high-fidelity PDF printing.
2. **ATS Resume Analyzer**: Automated scoring engine (Formatting, Keyword Density, Section Relevance, Content Impact, Readability) with circular gauge visuals and actionable recommendations.
3. **Job Description Match Analyzer**: Compares resumes against any job posting to calculate match percentage, required vs missing skills, and recommended keyword changes.
4. **Interactive Web Portfolio Builder**: Generates responsive, customizable developer websites with live themes and unique public shareable URLs (e.g., `/portfolio/gopinath`).
5. **AI Cover Letter Generator**: Generates tailored, authentic cover letters matching target job descriptions with configurable voice tones (Professional, Confident, Friendly, Formal).
6. **Career Recommendation Engine**: Evaluates skills and experience to recommend matching tech roles, industry growth rates, and salary benchmarks.
7. **Skill Gap Analysis & Roadmaps**: 3-tier structured learning roadmaps (Beginner -> Intermediate -> Advanced) to bridge technical skill gaps.
8. **Document Manager & Settings**: Unified repository for all saved resumes, cover letters, and published portfolios with dark mode support.

---

## 🛠️ Technology Stack

### Frontend:
* **React.js 19** (Modern React Hooks & Context API)
* **Vite** (Next-generation lightning-fast build tool)
* **React Router v7** (Client-side nested routing & protected routes)
* **Axios** (REST API client with JWT interceptors & standalone fallback mode)
* **Lucide React** (Modern, clean icon set)
* **Canvas Confetti** (Interactive visual celebration effects)
* **Vanilla CSS3 Design System** (Design tokens, CSS variables, dark/light themes, glassmorphism, responsive grid)

### Backend (Production Full-Stack MERN):
* **Node.js & Express.js** (High-performance REST API with middleware architecture)
* **MongoDB & Mongoose 8** (Schemas for Users, Profiles, Resumes, Portfolios, and Cover Letters)
* **JWT (JSON Web Tokens) & Bcrypt.js** (Secure authentication, password salting & verification)
* **CORS & Dotenv** (Cross-Origin Resource Sharing & environment configuration)
* **Database Seeder** (`npm run seed` to instant seed B. Gopinath's complete profile & templates)

---

## 🚀 Getting Started & Installation

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **MongoDB** (running locally on port 27017 or MongoDB Atlas URI)
* **npm** (v9.0.0 or higher)

### 1. Installation
In the project root folder:
```bash
# Install client dependencies
npm install --prefix client

# Install server dependencies
npm install --prefix server
```

### 2. Seed Database (Optional - Prepopulates Demo Data)
```bash
npm run seed
```

### 3. Running Locally in Development Mode
To start both Express server (port 5000) and Vite React client (port 5173) together:
```bash
npm run dev
```
Or start individually in separate terminals:
```bash
npm run server   # Starts Express backend on http://localhost:5000
npm run client   # Starts Vite React frontend on http://localhost:5173
```
Open your browser and navigate to the local server URL (typically `http://localhost:5173`).

### 3. Production Build
```bash
npm run build
```

---

## 🧭 Application Routes

| Route | Description | Access |
|---|---|---|
| `/` | Modern SaaS Landing Page with hero, live ATS demo, and feature showcases | Public |
| `/login` | Secure User Login with 1-Click "Demo Login as B. Gopinath" | Public |
| `/register` | Account Registration with validation | Public |
| `/portfolio/:slug` | Standalone Public Developer Portfolio (e.g. `/portfolio/gopinath`) | Public |
| `/dashboard` | User Dashboard with stats, ATS gauge, profile completion, and quick actions | Protected |
| `/profile` | Comprehensive User Profile Manager with completion calculation | Protected |
| `/resumes/builder` | Dual-pane ATS Resume Builder with live preview & print-to-PDF | Protected |
| `/ats-checker` | Dedicated ATS score checker with category breakdown & suggestions | Protected |
| `/job-match` | Job description match analyzer | Protected |
| `/portfolio` | Web Portfolio Builder & Theme Configurator | Protected |
| `/cover-letter` | AI Cover Letter Generator with tone selection & rich editor | Protected |
| `/career-recommendation` | Career guidance & matching role suggestions | Protected |
| `/skill-gap` | Skill Gap Analysis and 3-stage learning roadmaps | Protected |
| `/documents` | Saved Documents Manager for resumes, cover letters, and portfolios | Protected |
| `/settings` | Account preferences, dark mode toggle, and privacy settings | Protected |

---

## 👤 Sample Demo Profile

The platform comes pre-seeded with realistic demonstration data:
* **Developer Name:** B. Gopinath
* **Title:** MERN Stack Developer
* **Skills:** React.js, Node.js, Express.js, MongoDB, JavaScript (ES6+), RESTful APIs, Tailwind CSS, JWT, Git
* **Projects:** CareerCraft AI Platform, Multi-Vendor E-Commerce Web Application, Student Management System
* **Public Portfolio URL:** `/portfolio/gopinath`

---

## ⚖️ Disclaimer

CareerCraft AI provides structural evaluation, keyword density scoring, and career document generation tools. ATS score and match calculations are algorithmic optimization guides and do not guarantee employment or interview calls.

---

© 2026 CareerCraft AI — Developed by **B. Gopinath**.
