# Study Tracker

A personal study tracking app to monitor your DSA patterns, web development roadmap, daily study hours, and tasks.

## Features

- **📊 Dashboard** — Overview of streak, study hours, DSA/Web progress, activity feed, and chart
- **📝 DSA Tracker** — 110 patterns across 18 categories with per-category progress bars
- **🌐 Web Dev Roadmap** — 18-step full stack journey with timeline UI
- **✅ Task System** — Add, toggle, delete tasks with deadlines
- **📈 Analytics** — Weekly study hours chart, DSA/Web completion cards, 30-day activity heatmap
- **⚙️ Settings** — Export/import JSON backup, reset all data
- **🔐 Google Auth** — Firebase Authentication with protected routes

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 6, Vite 8 |
| Routing | React Router 7 (HashRouter) |
| Auth | Firebase 12 (Google Auth) |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Linting | Oxlint |
| Testing | Vitest + React Testing Library |
| Deployment | GitHub Pages (via GitHub Actions) |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Lint
npm run lint

# Test
npm test

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file (optional — defaults work for local dev):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + build |
| `npm test` | Run tests once |
| `npm run lint` | Run Oxlint |
| `npm run parse-data` | Parse raw text files into JSON data |

## Project Structure

```
study-tracker/
├── src/
│   ├── components/   # Sidebar, Layout, ErrorBoundary
│   ├── config/       # Firebase configuration
│   ├── context/      # Global state (GlobalContext)
│   ├── data/         # DSA patterns & web roadmap JSON
│   ├── pages/        # Dashboard, DSA, Web, Tasks, Analytics, Settings, Login
│   ├── test/         # Test setup & test files
│   ├── App.tsx       # Root component with routes
│   └── main.tsx      # Entry point
├── public/           # Static assets
├── .github/          # CI/CD (deploy, dependabot)
└── parse-data.cjs    # CLI tool to generate data JSON
```

## Deployment

The app auto-deploys to GitHub Pages on push to `main` via GitHub Actions.
