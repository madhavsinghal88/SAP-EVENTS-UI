# SAP EVENTS UI 🚀

A premium, modern dashboard for tracking and managing applications to SAP events. Designed with a high-end dark aesthetic, glassmorphism, and automated state management.

![SAP Events Dashboard](/dashboard_preview.png)

## ✨ Features

- **Premium Dark UI**: Built with a custom design system, glass-panel cards, and high-quality iconography (Lucide React).
- **Automated Tracking**:
  - **Applied**: Mark events you've already completed.
  - **To be Applied**: Events are automatically moved to a dedicated "Tracked" sidebar for easy focus.
  - **Not Applied**: Browse the full catalog of upcoming events.
- **Dynamic Filtering**: Sort through 240+ events by category (In-Person, Virtual, Hybrid).
- **Table Sorting**: Sort the main event list by Date, Name, Location, or Status.
- **Hourly Sync (Local Simulation)**: Includes logic to simulate hourly updates from the SAP portal.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS / Styled JSX
- **State Management**: React Hooks (useState/useEffect)
- **Data Persistence**: `data/events.json` (Local) -> Ready for DB integration.

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development
```bash
npm run dev
```
Open [http://localhost:8881](http://localhost:8881) in your browser.

### 3. Population
To reset or repopulate the database with the latest 247 events:
```bash
node scripts/populate_events.js
```

## 📈 Deployment (Vercel)

To maintain persistence in production:
1. Connect a **Database** (Vercel KV or Supabase).
2. Update the API routes to use your DB instead of `events.json`.
3. Set up a **Vercel Cron Job** to trigger the hourly scraper update.

---
Created by Antigravity AI.
