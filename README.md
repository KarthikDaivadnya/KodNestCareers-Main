# AI Resume Builder — KodNest Premium Build Track

**Project 3** of the KodNest Premium Build System.

A structured 8-step build track for building an AI-powered Resume Builder using Lovable + Vite + React + Tailwind CSS.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — redirects to `/rb/01-problem`.

---

## 📍 Routes

| Route | Description |
|---|---|
| `/rb/01-problem` | Step 1 — Problem Definition |
| `/rb/02-market` | Step 2 — Market Research |
| `/rb/03-architecture` | Step 3 — Architecture Overview |
| `/rb/04-hld` | Step 4 — High-Level Design |
| `/rb/05-lld` | Step 5 — Low-Level Design |
| `/rb/06-build` | Step 6 — Build Sprint |
| `/rb/07-test` | Step 7 — Test & QA |
| `/rb/08-ship` | Step 8 — Ship |
| `/rb/proof` | Proof of Work & Final Submission |

---

## 🔒 Gating System

- **No skipping steps.** Each step requires the previous step's artifact to be saved.
- Artifacts are stored in `localStorage` as `rb_step_X_artifact`.
- Click **"It Worked"** in the Build Panel to mark a step complete and unlock the next.

---

## 🏗️ Layout

Every step shares the **Premium Layout**:

- **Top bar** — Project title · Step X of 8 · Status badge
- **Context header** — Step tag + description
- **Main workspace (70%)** — Step instructions + gating state
- **Build panel (30%)** — Lovable prompt, Copy, Build in Lovable, It Worked / Error
- **Proof footer** — 8-step progress bar + Proof link

---

## ☁️ Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Framework: **Vite** (auto-detected)
4. Build: `npm run build` | Output: `dist`
5. Deploy — SPA routing handled by `vercel.json`

---

## 🧱 Tech Stack

- React 19 + Vite 7
- Tailwind CSS v4
- React Router v7
- Lucide React
- localStorage (artifact persistence)

---

*KodNest Premium Build System · Project 3*
