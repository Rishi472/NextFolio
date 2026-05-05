# NextFolio

A full-stack SaaS platform for building professional portfolios, ATS-optimized resumes, and interactive CLI-style terminal portfolios — powered by AI.

---

## ✨ Features

- **Resume Builder** — Form-driven editor for personal info, experience, education, skills, projects, achievements & certifications with real-time preview
- **AI Resume Parser** — Upload a PDF resume and auto-extract structured data via a Python NLP service
- **ATS Scoring** — Score resumes against job descriptions for Applicant Tracking System compatibility
- **Bio Optimizer** — AI-powered professional summary generation (OpenAI GPT integration)
- **Keyword Optimizer** — Compare resume skills against a target job description and surface missing keywords
- **Portfolio Generator** — Modern and Minimal theme options with live preview, social links, and project showcase
- **CLI Portfolio** — An interactive terminal-style portfolio rendered as a React component, driven by Zustand store data
- **PDF Export** — Server-side Puppeteer rendering of ATS-friendly, LaTeX-inspired PDF resumes
- **Design Panel** — Customize themes, color palettes, and layout styles on the fly
- **Authentication** — JWT-based auth with Google OAuth sign-in support
- **Publish & Share** — Publish portfolios to a unique shareable URL

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand 5 |
| Forms | React Hook Form |
| Icons | Lucide React |
| Auth | `@react-oauth/google` |
| Routing | React Router 7 |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 4 |
| Database | SQLite 3 (via Sequelize ORM) |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| PDF Parsing | pdf-parse |
| PDF Generation | Puppeteer |
| Email (OTP) | Resend |

### AI / ML Services (Python)
| Service | Purpose |
|---|---|
| `ai_parser.py` | NLP-based resume data extraction |
| `ats_scorer.py` | ATS compatibility scoring |
| `bio_optimizer.py` | Professional bio generation (OpenAI) |
| `keyword_optimizer.py` | Missing keyword detection |

---

## 📁 Project Structure

```
NextFolio/
├── client/                        # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/            # Reusable UI (Button, Card, Input, Modals…)
│   │   ├── features/              # Feature modules
│   │   │   ├── ResumeBuilder.jsx  # Main resume editor
│   │   │   ├── ResumePreview.jsx  # Live resume preview
│   │   │   ├── PortfolioPreview.jsx
│   │   │   ├── CLIPortfolio.jsx   # Terminal portfolio (React)
│   │   │   ├── AIAssistant.jsx    # AI sidebar panel
│   │   │   ├── DesignPanel.jsx    # Theme/layout customizer
│   │   │   └── themes/            # Portfolio & resume theme tokens
│   │   ├── pages/                 # Route pages (Login, About, Contact, Published)
│   │   ├── layouts/               # App shell layout
│   │   ├── store/                 # Zustand stores (resume + UI state)
│   │   ├── Login/                 # Login components
│   │   ├── NavBar/                # Navigation bar
│   │   ├── Sidebar/               # Sidebar navigation
│   │   └── utils/                 # Helpers
│   ├── public/                    # Static assets
│   ├── .env.example               # Client env template
│   └── package.json
├── server/                        # Backend (Express + SQLite)
│   ├── server.js                  # Entry point
│   ├── models/                    # Sequelize models
│   ├── routes/                    # API route handlers
│   │   ├── auth.js                # /api/auth — signup, login, Google OAuth
│   │   ├── resume.js              # /api/resume — CRUD resume data
│   │   ├── ai.js                  # /api/ai — parse, optimize, score
│   │   ├── upload.js              # /api/upload — file upload
│   │   └── generate.js            # /api/generate — PDF generation
│   ├── services/                  # Python AI microservices
│   │   ├── ai_parser.py
│   │   ├── ats_scorer.py
│   │   ├── bio_optimizer.py
│   │   └── keyword_optimizer.py
│   └── .env                       # Server env (API keys)
├── cli-portlio/                   # Legacy static CLI portfolio shell
│   ├── index.html
│   ├── script.js
│   ├── styles/
│   ├── themes/
│   └── chatBot/
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.8+ (for AI services)
- **npm**

### 1. Clone the repository

```bash
git clone https://github.com/Rishi472/NextFolio.git
cd NextFolio
```

### 2. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Configure environment variables

**Server** (`server/.env`):
```env
OPENAI_API_KEY=your_openai_api_key
RESEND_API_KEY=re_your_resend_key
OTP_FROM_EMAIL=onboarding@resend.dev
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Run the application

Open **two terminals**:

```bash
# Terminal 1 — Start the backend
cd server
npm start            # or: npm run dev (with auto-reload)

# Terminal 2 — Start the frontend
cd client
npm run dev
```

The app will be available at **https://next-folio-silk.vercel.app/**

---

## 📡 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login with email & password |
| POST | `/api/auth/google` | Google OAuth sign-in |
| GET/PUT | `/api/resume/personal` | Read/update personal info |
| POST | `/api/ai/parse` | Upload & parse a resume PDF |
| POST | `/api/ai/optimize` | Keyword optimization against a JD |
| POST | `/api/ai/optimize-bio` | AI-generated professional summary |
| POST | `/api/ai/ats-score` | ATS compatibility score |
| POST | `/api/upload` | Generic file upload |
| POST | `/api/generate/pdf` | Generate ATS-friendly PDF resume |

---

## 🎨 Themes & Customization

NextFolio ships with multiple customization layers:

- **Portfolio Themes** — Modern (gradient, glassmorphism) and Minimal (clean, typography-focused)
- **Color Palettes** — Blue, Purple, Green, and more via design tokens
- **Layout Styles** — Default, Compact, and other layout presets
- **Resume Styles** — LaTeX-inspired ATS-friendly PDF output

All theming is token-driven via `features/themes/` — palette colors, layout spacing, and typography are fully configurable.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🎯 Roadmap

- [ ] Real-time collaboration
- [ ] Additional portfolio themes
- [ ] Mobile-responsive editor
- [ ] Analytics dashboard for published portfolios
- [ ] Video portfolio support
- [ ] Custom domain mapping for published portfolios

---

**Built with ❤️ by the NextFolio Team**
