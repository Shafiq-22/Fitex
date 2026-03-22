# Endurance

A complete offline-first fitness PWA — your personal fitness operating system. No subscriptions, no backend, no cloud dependency.

## Features

- **Multi-User Profiles** — Independent profiles with isolated data
- **Guided Onboarding** — Step-by-step setup that generates personalized workout plans
- **Today Dashboard** — Daily overview with stats, activity heatmap, workout volume charts
- **Training System** — My Plan, Custom workouts, Browse pre-built programs
- **Live Workout Engine** — Real-time set tracking, rest timer, session persistence
- **Body Tracking** — Weight, measurements, progress photos, skills, custom metrics
- **1RM Calculator** — Epley formula with history
- **AI Coach** — Chat with Claude via your own API key (optional)
- **Full Settings** — Dark/light mode, notifications, data export/import
- **PWA** — Installable, works offline, mobile optimized

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router v7
- Recharts
- date-fns
- vite-plugin-pwa

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
npm run preview
```

## Architecture

- **Storage**: localStorage (structured data) + IndexedDB (progress photos)
- **State**: Custom `useStorage` hook with event bus pattern — no Redux/Zustand
- **Offline-first**: All features work offline except AI Coach
- **PWA**: Service worker, installable, safe-area aware
